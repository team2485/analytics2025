function calcAuto(record) {
    return (
      record.autoL1success * 1 + // Level 1 Coral
      record.autoL2success * 2 + // Level 2 Coral
      record.autoL3success * 3 + // Level 3 Coral
      record.autoL4success * 4 + // Level 4 Coral
      record.autoprocessorsuccess * 3 + // Processor success
      record.autonetsuccess * 5 + // Net success
      (record.leave ? 2 : 0) // Leaving starting zone bonus
    );
  }
  
  function calcTele(record) {
    return (
      record.teleL1success * 1 + // Level 1 Coral
      record.teleL2success * 2 + // Level 2 Coral
      record.teleL3success * 3 + // Level 3 Coral
      record.teleL4success * 4 + // Level 4 Coral
      record.telealgaeprocessor * 3 + // Processor success in teleop
      record.telealgaenet * 5 + // Net success in teleop
      record.hpsuccess * 2 // Human player success bonus
    );
  }
  
  function calcEnd(record) {
    return (
      (record.endlocation === null || record.endlocation === 0
        ? 0 // No endgame placement
        : record.endlocation === 1
        ? 2 // Parked
        : record.endlocation === 2
        ? 4 // Shallow Dock
        : record.endlocation === 3
        ? 6 // Deep Dock
        : record.endlocation === 4
        ? 2 // Failed Attempt
        : 0) + // Default case
      record.cagesuccess * 5 // Successful cage lock bonus
    );
  }
  
  function calcEPA(record) {
    return calcAuto(record) + calcTele(record) + calcEnd(record);
  }
  
  export { calcAuto, calcTele, calcEnd, calcEPA };