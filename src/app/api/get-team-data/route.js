import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import _ from 'lodash';
import { tidy, mutate, mean, select, summarizeAll, groupBy, summarize, first, n, median, total, arrange, asc, slice } from '@tidyjs/tidy';
import { calcEPA, calcAuto, calcTele, calcEnd } from "../../../util/calculations.js";

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get('team');

  if (!_.isNumber(+team)) {
    return NextResponse.json({ message: "ERROR: Invalid team number" }, { status: 400 });
  }

  // Fetch team data from database
  let data = await sql`SELECT * FROM sdr2025 WHERE team = ${team};`;
  const rows = data.rows;

  if (rows.length === 0) {
    return NextResponse.json({ message: `ERROR: No data for team ${team}` }, { status: 404 });
  }

  function byAveragingNumbers(index) {
    if (['noshow', 'leave', 'breakdown', 'defense', 'cageattempt'].includes(index)) {
      return arr => arr.some(row => row[index] === true);
    }
    if (['scoutname', 'generalcomments', 'breakdowncomments', 'defensecomments'].includes(index)) {
      return arr => arr.map(row => row[index]).filter(a => a != null).join(" - ") || null;
    }
    if (['coralspeed', 'processorspeed', 'netspeed', 'algaeremovalspeed', 'climbspeed', 'maneuverability', 'defenseplayed', 'defenseevasion', 'aggression', 'cagehazard'].includes(index)) {
      return arr => {
        let filtered = arr.filter(row => row[index] != -1 && row[index] != null).map(row => row[index]);
        return filtered.length === 0 ? -1 : mean(filtered);
      };
    }
    return mean(index);
  }

  let teamTable = tidy(rows, mutate({
    auto: rec => calcAuto(rec),
    tele: rec => calcTele(rec),
    end: rec => calcEnd(rec),
    epa: rec => calcEPA(rec) // Ensure EPA is using the correct calculation
}));


  function rowsToArray(x, index) {
    return x.map(row => row[index]).filter(val => val != null);
  }

  function percentValue(arr, index, value) {
    return arr.filter(e => e[index] === value).length / arr.length;
  }

  // fetch team name from blue alliance api, commented our for now while testing getting from the backend
  const teamName = await fetch(`https://www.thebluealliance.com/api/v3/team/frc${team}/simple`, {
    headers: {
      "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY,
      "Accept": "application/json"
    },
  })
  .then(resp => {
    if (resp.status !== 200) {
      console.error(`TBA API Error: Received status ${resp.status}`);
      return null;  // Return null if the request fails
    }
    return resp.json();
  })
  .then(data => {
    if (!data || !data.nickname) { 
      console.warn(`TBA API Warning: No nickname found for team ${team}`);
      return "";  // Provide a default fallback
    }
    return data.nickname;
  });
    const matchesScouted = new Set(teamTable.map(row => row.match)).size;

    function standardDeviation(arr, key) {
      const values = arr.map(row => row[key]).filter(v => typeof v === 'number' && !isNaN(v));
    
      if (values.length === 0) return 0;
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
    
      console.log(`📏 Manual StdDev Debug → values: [${values.join(', ')}] | Mean: ${avg} | Variance: ${variance} | StdDev: ${stdDev}`);
    
      return stdDev;
    }
    
    let returnObject = tidy(teamTable, 
      summarize({
        epa: mean('epa'),
        auto: mean('auto'),
        tele: mean('tele'),
        end: mean('end'),
        team: first('team'),
        name: () => teamName,
        avgEpa: mean('epa'),
        avgAuto: mean('auto'),
        avgTele: mean('tele'),
        avgEnd: mean('end'),
        
        // Last 3 averages
        last3Epa: arr => {
          // If we have 3 or fewer matches, use all data (same as average)
          if (arr.length <= 3) {
            return arr.reduce((sum, row) => sum + row.epa, 0) / arr.length;
          }
          // Otherwise, sort by match number (descending) and take first 3
          const latest3 = [...arr].sort((a, b) => b.match - a.match).slice(0, 3);
          return latest3.reduce((sum, row) => sum + row.epa, 0) / 3;
        },
// Last 3 averages
last3Epa: arr => {
  // Get unique matches and their average EPA
  const matchGroups = {};
  arr.forEach(row => {
    if (!matchGroups[row.match]) {
      matchGroups[row.match] = { sum: 0, count: 0 };
    }
    matchGroups[row.match].sum += row.epa;
    matchGroups[row.match].count += 1;
  });
  
  // Convert to array of match averages
  const matchAverages = Object.entries(matchGroups).map(([match, data]) => ({
    match: parseInt(match),
    avgEpa: data.sum / data.count
  }));
  
  // Sort by match number (descending) and take last 3
  const latest3Matches = matchAverages.sort((a, b) => b.match - a.match).slice(0, 3);
  
  if (latest3Matches.length === 0) return 0;
  return latest3Matches.reduce((sum, m) => sum + m.avgEpa, 0) / latest3Matches.length;
},

last3Auto: arr => {
  // Get unique matches and their average Auto
  const matchGroups = {};
  arr.forEach(row => {
    if (!matchGroups[row.match]) {
      matchGroups[row.match] = { sum: 0, count: 0 };
    }
    matchGroups[row.match].sum += row.auto;
    matchGroups[row.match].count += 1;
  });
  
  // Convert to array of match averages
  const matchAverages = Object.entries(matchGroups).map(([match, data]) => ({
    match: parseInt(match),
    avgAuto: data.sum / data.count
  }));
  
  // Sort by match number (descending) and take last 3
  const latest3Matches = matchAverages.sort((a, b) => b.match - a.match).slice(0, 3);
  
  if (latest3Matches.length === 0) return 0;
  return latest3Matches.reduce((sum, m) => sum + m.avgAuto, 0) / latest3Matches.length;
},

last3Tele: arr => {
  // Get unique matches and their average Tele
  const matchGroups = {};
  arr.forEach(row => {
    if (!matchGroups[row.match]) {
      matchGroups[row.match] = { sum: 0, count: 0 };
    }
    matchGroups[row.match].sum += row.tele;
    matchGroups[row.match].count += 1;
  });
  
  // Convert to array of match averages
  const matchAverages = Object.entries(matchGroups).map(([match, data]) => ({
    match: parseInt(match),
    avgTele: data.sum / data.count
  }));
  
  // Sort by match number (descending) and take last 3
  const latest3Matches = matchAverages.sort((a, b) => b.match - a.match).slice(0, 3);
  
  if (latest3Matches.length === 0) return 0;
  return latest3Matches.reduce((sum, m) => sum + m.avgTele, 0) / latest3Matches.length;
},

last3End: arr => {
  // Get unique matches and their average End
  const matchGroups = {};
  arr.forEach(row => {
    if (!matchGroups[row.match]) {
      matchGroups[row.match] = { sum: 0, count: 0 };
    }
    matchGroups[row.match].sum += row.end;
    matchGroups[row.match].count += 1;
  });
  
  // Convert to array of match averages
  const matchAverages = Object.entries(matchGroups).map(([match, data]) => ({
    match: parseInt(match),
    avgEnd: data.sum / data.count
  }));
  
  // Sort by match number (descending) and take last 3
  const latest3Matches = matchAverages.sort((a, b) => b.match - a.match).slice(0, 3);
  
  if (latest3Matches.length === 0) return 0;
  return latest3Matches.reduce((sum, m) => sum + m.avgEnd, 0) / latest3Matches.length;
},
        
        // Extract match and performance metrics
        epaOverTime: arr => tidy(arr, select(['epa', 'match'])),
        autoOverTime: arr => tidy(arr, select(['match', 'auto'])),
        teleOverTime: arr => tidy(arr, select(['match', 'tele'])),
      
        // Consistency calculation
        consistency: arr => {
          const uniqueMatches = new Set(arr.map(row => row.match));
          const uniqueBreakdownCount = Array.from(uniqueMatches).filter(match =>
            arr.some(row => row.match === match && row.breakdowncomments !== null)
          ).length;
          const breakdownRate = (uniqueBreakdownCount / uniqueMatches.size) * 100;
        
          const epaStdDev = standardDeviation(arr, 'epa');
          return 100 - (breakdownRate + epaStdDev);
        },
    
        lastBreakdown: arr => arr.filter(e => e.breakdowncomments !== null).reduce((a, b) => b.match, "N/A"),
        noShow: arr => percentValue(arr, 'noshow', true),
    
        breakdown: arr => {
          const uniqueMatches = new Set(arr.map(row => row.match));
          const uniqueBreakdownCount = Array.from(uniqueMatches).filter(match =>
            arr.some(row => row.match === match && row.breakdowncomments !== null)
          ).length;
          return (uniqueBreakdownCount / uniqueMatches.size) * 100;
        },
    
        defense: arr => {
          const uniqueMatches = new Set(arr.map(row => row.match));
          const uniqueDefenseCount = Array.from(uniqueMatches).filter(match =>
            arr.some(row => row.match === match && row.defensecomments !== null)
          ).length;
          return (uniqueDefenseCount / uniqueMatches.size) * 100;
        },
    
        matchesScouted: () => matchesScouted,
        scouts: arr => {
          const scoutsByMatch = {};
          arr.forEach(row => {
            if (row.scoutname && row.scoutname.trim()) {
              if (!scoutsByMatch[row.match]) {
                scoutsByMatch[row.match] = [];
              }
              if (!scoutsByMatch[row.match].includes(row.scoutname)) {
                scoutsByMatch[row.match].push(row.scoutname);
              }
            }
          });
          
          const result = Object.entries(scoutsByMatch).map(([match, scouts]) => 
            ` *Match ${match}: ${scouts.join(', ')}*`
          );
          
          return result.length > 0 ? result : [];
        },
        generalComments: arr => {
          const commentsByMatch = {};
          arr.forEach(row => {
            if (row.generalcomments && row.generalcomments.trim()) {
              if (!commentsByMatch[row.match]) {
                commentsByMatch[row.match] = [];
              }
              commentsByMatch[row.match].push(row.generalcomments);
            }
          });
          
          const result = Object.entries(commentsByMatch).map(([match, comments]) => 
            ` *Match ${match}: ${comments.join(' -- ')}*`
          );
          
          return result.length > 0 ? result : [];
        },
        
        breakdownComments: arr => {
          const commentsByMatch = {};
          arr.forEach(row => {
            if (row.breakdowncomments && row.breakdowncomments.trim()) {
              if (!commentsByMatch[row.match]) {
                commentsByMatch[row.match] = [];
              }
              commentsByMatch[row.match].push(row.breakdowncomments);
            }
          });
          
          const result = Object.entries(commentsByMatch).map(([match, comments]) => 
            ` *Match ${match}: ${comments.join(' -- ')}*`
          );
          
          return result.length > 0 ? result : [];
        },
      
    defenseComments: arr => {
      const commentsByMatch = {};
      arr.forEach(row => {
        if (row.defensecomments && row.defensecomments.trim()) {
          if (!commentsByMatch[row.match]) {
            commentsByMatch[row.match] = [];
          }
          commentsByMatch[row.match].push(row.defensecomments);
        }
      });
      
      const result = Object.entries(commentsByMatch).map(([match, comments]) => 
        ` *Match ${match}: ${comments.join(' -- ')}*`
      );
      
      return result.length > 0 ? result : [];
    },
    autoOverTime: arr => tidy(arr, select(['match', 'auto'])),
    teleOverTime: arr => tidy(arr, select(['match', 'tele'])),
    leave: arr => {
      const uniqueLeaveMatches = new Set(arr.filter(e => e.leave === true).map(e => e.match));
      return uniqueLeaveMatches.size / new Set(arr.map(e => e.match)).size || 0;
    },

    auto: arr => ({
      coral: {

      total: (() => {
        const totalSuccess = rows.reduce((sum, row) => 
            sum + (row.autol1success || 0) +
                   (row.autol2success || 0) +
                   (row.autol3success || 0) +
                   (row.autol4success || 0), 
        0);
        return totalSuccess / rows.length;
    })(),
    
        success: (() => {
          const totalSuccess = rows.reduce((sum, row) => sum + ((row.autol1success || 0) + (row.autol2success || 0) + (row.autol3success || 0) + (row.autol4success || 0)), 0);
          const totalAttempts = rows.reduce((sum, row) => sum + ((row.autol1success || 0) + (row.autol2success || 0) + (row.autol3success || 0) + (row.autol4success || 0) + (row.autol1fail || 0) + (row.autol2fail || 0) + (row.autol3fail || 0) + (row.autol4fail || 0)), 0);
          return totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 0;
        })(),
        avgL1: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autol1success || 0), 0) / rows.length : 0)(),
        avgL2: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autol2success || 0), 0) / rows.length : 0)(),
        avgL3: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autol3success || 0), 0) / rows.length : 0)(),
        avgL4: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autol4success || 0), 0) / rows.length : 0)(),


        successL1: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autol1success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autol1fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
    
        successL2: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autol2success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autol2fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
    
        successL3: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autol3success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autol3fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
    
        successL4: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autol4success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autol4fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        
      },
      algae: {
        removed: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autoalgaeremoved || 0), 0) / rows.length : 0)(),
        avgProcessor: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autoprocessorsuccess || 0), 0) / rows.length : 0)(),
        avgNet: (() => rows.length ? rows.reduce((sum, row) => sum + (row.autonetsuccess || 0), 0) / rows.length : 0)(),
      
        successProcessor: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autoprocessorsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autoprocessorfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      
        successNet: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.autonetsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.autonetfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      },
      
    }),

    tele: arr => ({
      coral: {
        total: (() => {
          const totalSuccess = rows.reduce((sum, row) => 
              sum + (row.telel1success || 0) +
                     (row.telel2success || 0) +
                     (row.telel3success || 0) +
                     (row.telel4success || 0), 
          0);
          return totalSuccess / rows.length;
      })(),
      
    
    success: (() => {
          const totalSuccess = rows.reduce((sum, row) => sum + ((row.telel1success || 0) + (row.telel2success || 0) + (row.telel3success || 0) + (row.telel4success || 0)), 0);
          const totalAttempts = rows.reduce((sum, row) => sum + ((row.telel1success || 0) + (row.telel2success || 0) + (row.telel3success || 0) + (row.telel4success || 0) + (row.telel1fail || 0) + (row.telel2fail || 0) + (row.telel3fail || 0) + (row.telel4fail || 0)), 0);
          return totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 0;
        })(),
        
        avgL1: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel1success || 0), 0) / rows.length : 0)(),
        avgL2: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel2success || 0), 0) / rows.length : 0)(),
        avgL3: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel3success || 0), 0) / rows.length : 0)(),
        avgL4: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telel4success || 0), 0) / rows.length : 0)(),

        successL1: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel1success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel1fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL2: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel2success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel2fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL3: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel3success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel3fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        successL4: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telel4success || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telel4fail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),

        
      },
      algae: {
        removed: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telealgaeremoved || 0), 0) / rows.length : 0)(),
        avgProcessor: (() => rows.length ? rows.reduce((sum, row) => sum + (row.teleprocessorsuccess || 0), 0) / rows.length : 0)(),
        avgNet: (() => rows.length ? rows.reduce((sum, row) => sum + (row.telenetsuccess || 0), 0) / rows.length : 0)(),
      
        successProcessor: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.teleprocessorsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.teleprocessorfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      
        successNet: (() => {
          const successes = rows.reduce((sum, row) => sum + (row.telenetsuccess || 0), 0);
          const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.telenetfail || 0), 0);
          return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
        })(),
      },
      
      avgHp: (() => {
        const validRows = rows.filter(row => row.hpsuccess !== null);
        return validRows.length ? validRows.reduce((sum, row) => sum + row.hpsuccess, 0) / validRows.length : 0;
      })(),
      successHp: (() => {
        const successes = rows.reduce((sum, row) => sum + (row.hpsuccess || 0), 0);
        const totalAttempts = successes + rows.reduce((sum, row) => sum + (row.hpfail || 0), 0);
        return totalAttempts > 0 ? (successes / totalAttempts) * 100 : 0;
      })(),


    }),

// This appears to be inside a function that returns something via NextResponse
  // I'm providing the fixed version of the code snippet you shared
  
  // Assuming this is inside a function where 'rows' is defined

  // The endPlacement, attemptCage, successCage functions are likely inside a map or some object construction
  // which appears to be closed with "))" and then the result is assigned to returnObject[0]
  
  // First part of your object definition with fixed endPlacement
  endPlacement: arr => {
    // Group data by match ID
    const matchGroups = {};
    rows.forEach(row => {
      const matchId = row.matchid || row.match_id; // adapt to your actual match ID field name
      if (!matchGroups[matchId]) {
        matchGroups[matchId] = [];
      }
      matchGroups[matchId].push(row);
    });
    
    // Find the most common endlocation for each match
    const matchModes = [];
    Object.values(matchGroups).forEach(matchRows => {
      // Count occurrences of each endlocation value
      const counts = {};
      matchRows.forEach(row => {
        const endLoc = row.endlocation;
        counts[endLoc] = (counts[endLoc] || 0) + 1;
      });
      
      // Find the mode (most frequent value)
      let mode = null;
      let maxCount = 0;
      Object.entries(counts).forEach(([value, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mode = parseInt(value);
        }
      });
      
      matchModes.push(mode);
    });
    
    // Calculate percentages of the modal values
    const totalMatches = matchModes.length;
    return {
      none: (matchModes.filter(mode => mode === 0).length / totalMatches) * 100,
      park: (matchModes.filter(mode => mode === 1).length / totalMatches) * 100,
      shallow: (matchModes.filter(mode => mode === 3).length / totalMatches) * 100,
      deep: (matchModes.filter(mode => mode === 4).length / totalMatches) * 100,
      parkandFail: (matchModes.filter(mode => mode === 2).length / totalMatches) * 100,
    };
  },

  // Fixed attemptCage function using the same match-based approach
  attemptCage: arr => {
    // Group data by match ID
    const matchGroups = {};
    rows.forEach(row => {
      const matchId = row.matchid || row.match_id;
      if (!matchGroups[matchId]) {
        matchGroups[matchId] = [];
      }
      matchGroups[matchId].push(row);
    });
    
    // Count matches where the modal endlocation value indicates a cage attempt
    const matchesWithAttempt = Object.values(matchGroups).filter(matchRows => {
      // Find the most common endlocation for this match
      const counts = {};
      matchRows.forEach(row => {
        const endLoc = row.endlocation;
        counts[endLoc] = (counts[endLoc] || 0) + 1;
      });
      
      let mode = null;
      let maxCount = 0;
      Object.entries(counts).forEach(([value, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mode = parseInt(value);
        }
      });
      
      // Return true if the modal value indicates a cage attempt
      return [2, 3, 4].includes(mode);
    }).length;
    
    const totalMatches = Object.keys(matchGroups).length;
    return totalMatches > 0 ? (matchesWithAttempt / totalMatches) * 100 : 0;
  },
  
  // Fixed successCage function using the same match-based approach
  successCage: arr => {
    // Group data by match ID
    const matchGroups = {};
    rows.forEach(row => {
      const matchId = row.matchid || row.match_id;
      if (!matchGroups[matchId]) {
        matchGroups[matchId] = [];
      }
      matchGroups[matchId].push(row);
    });
    
    // Count matches where the modal endlocation value indicates a successful cage
    const matchesWithSuccess = Object.values(matchGroups).filter(matchRows => {
      // Find the most common endlocation for this match
      const counts = {};
      matchRows.forEach(row => {
        const endLoc = row.endlocation;
        counts[endLoc] = (counts[endLoc] || 0) + 1;
      });
      
      let mode = null;
      let maxCount = 0;
      Object.entries(counts).forEach(([value, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mode = parseInt(value);
        }
      });
      
      // Return true if the modal value indicates a successful cage
      return [3, 4].includes(mode);
    }).length;
    
    const totalMatches = Object.keys(matchGroups).length;
    return totalMatches > 0 ? (matchesWithSuccess / totalMatches) * 100 : 0;
  },
  
  qualitative: arr => [
    { name: "Coral Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.coralspeed || 0), 0) / rows.length : 0 },
    { name: "Processor Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.processorspeed || 0), 0) / rows.length : 0 },
    { name: "Net Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.netspeed || 0), 0) / rows.length : 0 },
    { name: "Algae Removal Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.algaeremovalspeed || 0), 0) / rows.length : 0 },
    { name: "Climb Speed", rating: rows.length ? rows.reduce((sum, row) => sum + (row.climbspeed || 0), 0) / rows.length : 0 },
    { name: "Maneuverability", rating: rows.length ? rows.reduce((sum, row) => sum + (row.maneuverability || 0), 0) / rows.length : 0 },
    { name: "Defense Played", rating: rows.length ? rows.reduce((sum, row) => sum + (row.defenseplayed || 0), 0) / rows.length : 0 },
    { name: "Defense Evasion", rating: rows.length ? rows.reduce((sum, row) => sum + (row.defenseevasion || 0), 0) / rows.length : 0 },
    { name: "Aggression*", rating: rows.length ? 5 - (rows.reduce((sum, row) => sum + (row.aggression || 0), 0) / rows.length) : 0 },
    { name: "Cage Hazard*", rating: rows.length ? 5 - (rows.reduce((sum, row) => sum + (row.cagehazard || 0), 0) / rows.length) : 0 },
  ],
}));  // This appears to close the object and function call that contains these properties

// The rest of your code seems fine and doesn't need modification for your current issue
returnObject[0] = {
  ...returnObject[0],
  coralGroundIntake: rows.some(row => row.coralgrndintake === true),
  coralStationIntake: rows.some(row => row.coralstationintake === true),
  algaeGroundIntake: rows.some(row => row.algaegrndintake === true),
  algaeLowReefIntake: rows.some(row => row.algaelowreefintake === true),
  algaeHighReefIntake: rows.some(row => row.algaehighreefintake === true),
  lollipop: rows.some(row => row.lollipop === true),
};

// Aggregate function definition
function aggregateByMatch(dataArray) {
  return tidy(
    dataArray,
    groupBy("match", [
      summarize({
        epa: mean("epa"),
        auto: mean("auto"),
        tele: mean("tele"),
      }),
    ]),
    mutate({
      epa: d => Math.round(d.epa * 100) / 100,
      auto: d => Math.round(d.auto * 100) / 100,
      tele: d => Math.round(d.tele * 100) / 100,
    }),
    arrange([asc("match")])
  );
}

// Apply the aggregation and sorting
let processedEPAOverTime = aggregateByMatch(returnObject[0].epaOverTime);
let processedAutoOverTime = aggregateByMatch(returnObject[0].autoOverTime);
let processedTeleOverTime = aggregateByMatch(returnObject[0].teleOverTime);

returnObject[0].epaOverTime = processedEPAOverTime;
returnObject[0].autoOverTime = processedAutoOverTime;
returnObject[0].teleOverTime = processedTeleOverTime;

console.log("Backend End Placement:", returnObject[0].defense);

return NextResponse.json(returnObject[0], { status: 200 });
}