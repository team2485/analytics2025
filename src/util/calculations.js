function calcAuto(record) {
    return (
      record.autol1success * 1 + // Level 1 Coral
      record.autol2success * 2 + // Level 2 Coral
      record.autol3success * 3 + // Level 3 Coral
      record.autol4success * 4 + // Level 4 Coral
      record.autoprocessorsuccess * 3 + // Processor success
      record.autonetsuccess * 5 + // Net success
      (record.leave ? 2 : 0) // Leaving starting zone bonus
    );
  }
  
  function calcTele(record) {
    return (
      record.telel1success * 1 + // Level 1 Coral
      record.telel2success * 2 + // Level 2 Coral
      record.telel3success * 3 + // Level 3 Coral
      record.telel4success * 4 + // Level 4 Coral
      record.teleprocessorsuccess * 3 + // Processor success in teleop
      record.telenetsuccess * 5 + // Net success in teleop
      record.hpsuccess * 2 // Human player success bonus
    );
  }
  
  function calcEnd(record) {
    let endgamePoints = 0;
  
    switch (record.endlocation) {
      case 1:
        endgamePoints = 2; // Parked
        break;
      case 2:
        endgamePoints = 4; // Shallow Dock
        break;
      case 3:
        endgamePoints = 6; // Deep Dock
        break;
      case 4:
        endgamePoints = 2; // Failed Attempt
        break;
      default:
        endgamePoints = 0; // No endgame placement or invalid value
    }
  
    const cageBonus = record.cagesuccess ? record.cagesuccess * 5 : 0;
  
    return endgamePoints + cageBonus;
  }
  
  function calcEPA(record) {
    return calcAuto(record) + calcTele(record) + calcEnd(record);
  }
  
  export { calcAuto, calcTele, calcEnd, calcEPA };