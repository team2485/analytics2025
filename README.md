## Getting Started

First, install the dependencies:

```bash
npm install
```

Next, set up the database on Vercel with test data.
```sql

CREATE TABLE phr2025 (
   ID serial PRIMARY KEY,
   ScoutName VARCHAR (255),
   ScoutTeam INT,
   Team INT,
   Match INT,
   MatchType INT,
   Breakdown BOOLEAN,
   NoShow BOOLEAN,
   Leave BOOLEAN,
   AutoL1Success INT,
   AutoL1Fail INT,
   AutoL2Success INT,
   AutoL2Fail INT,
   AutoL3Success INT,
   AutoL3Fail INT,
   AutoL4Success INT,
   AutoL4Fail INT,
   AutoCoralSuccess INT,
   AutoCoralFail INT,
   AutoAlgaeRemoved INT,
   AutoProcessorSuccess INT,
   AutoProcessorFail INT,
   AutoNetSuccess INT,
   AutoNetFail INT,
   TeleL1Success INT,
   TeleL1Fail INT,
   TeleL2Success INT,
   TeleL2Fail INT,
   TeleL3Success INT,
   TeleL3Fail INT,
   TeleL4Success INT,
   TeleL4Fail INT,
   TeleCoralSuccess INT,
   TeleCoralFail INT,
   TeleAlgaeRemoved INT,
   TeleProcessorSuccess INT,
   TeleProcessorFail INT,
   TeleNetSuccess INT,
   TeleNetFail INT,
   HPSuccess INT,
   HPFail INT,
   EndLocation INT,
   CoralSpeed INT,
   ProcessorSpeed INT,
   NetSpeed INT,
   AlgaeRemovalSpeed INT,
   ClimbSpeed INT,
   Maneuverability INT,
   DefensePlayed INT,
   DefenseEvasion INT,
   Aggression INT,
   CageHazard INT,
   CoralGrndIntake BOOLEAN,
   CoralStationIntake BOOLEAN,
   Lollipop BOOLEAN,
   AlgaeGrndIntake BOOLEAN,
   AlgaeHighReefIntake BOOLEAN,
   AlgaeLowReefIntake BOOLEAN,
   GeneralComments VARCHAR (255),
   BreakdownComments VARCHAR (255),
   DefenseComments VARCHAR (255)
);
INSERT INTO phr2025 (
   ScoutName, ScoutTeam, Team, Match, MatchType, Breakdown, NoShow, Leave,
   AutoL1Success, AutoL1Fail, AutoL2Success, AutoL2Fail, AutoL3Success, AutoL3Fail, AutoL4Success, AutoL4Fail, 
   AutoCoralSuccess, AutoCoralFail, AutoAlgaeRemoved, AutoProcessorSuccess, AutoProcessorFail, AutoNetSuccess, AutoNetFail,
   TeleL1Success, TeleL1Fail, TeleL2Success, TeleL2Fail, TeleL3Success, TeleL3Fail, TeleL4Success, TeleL4Fail, 
   TeleCoralSuccess, TeleCoralFail, TeleAlgaeRemoved, TeleProcessorSuccess, TeleProcessorFail, TeleNetSuccess, TeleNetFail, 
   HPSuccess, HPFail, EndLocation, CoralSpeed, ProcessorSpeed, NetSpeed, AlgaeRemovalSpeed, ClimbSpeed, Maneuverability, 
   DefensePlayed, DefenseEvasion, Aggression, CageHazard, CoralGrndIntake, CoralStationIntake, Lollipop, AlgaeGrndIntake, 
   AlgaeHighReefIntake, AlgaeLowReefIntake, GeneralComments, BreakdownComments, DefenseComments
) 
VALUES 
('John Doe', 2475, 9, 1, 0, FALSE, FALSE, FALSE, 
 2, 1, 3, 0, 4, 2, 5, 1, 
 6, 2, 3, 4, 1, 5, 2, 
 3, 0, 4, 2, 5, 1, 6, 3, 
 7, 1, 4, 2, 3, 1, 2, 0, 
 3, 1, 2, 3, 4, 5, 3, 2, 4, 
 1, 0, 3, TRUE, FALSE, TRUE, FALSE, 
 TRUE, FALSE, 'Strong defensive play, efficient scorer', 'Lost mobility mid-game', 'Effectively blocked opponents'),
 
('Milan Gupta', 2485, 11, 2, 1, FALSE, FALSE, TRUE, 
 1, 2, 3, 1, 2, 0, 3, 2, 
 4, 2, 5, 3, 1, 2, 0, 
 2, 1, 3, 0, 4, 1, 5, 3, 
 6, 2, 5, 1, 4, 0, 3, 2, 
 5, 1, 3, 2, 4, 3, 1, 0, 2, 
 1, 3, 4, FALSE, TRUE, TRUE, FALSE, 
 TRUE, TRUE, 'Consistent shooter, fast intake', NULL, 'Good coordination with alliance'),

('Preston Seay', 2495, 10, 3, 2, FALSE, TRUE, FALSE, 
 3, 0, 2, 1, 4, 2, 5, 1, 
 6, 2, 3, 4, 1, 5, 2, 
 3, 1, 4, 0, 5, 2, 6, 3, 
 7, 1, 4, 2, 3, 1, 2, 0, 
 3, 1, 2, 3, 4, 5, 3, 2, 4, 
 1, 0, 3, TRUE, FALSE, FALSE, TRUE, 
 FALSE, TRUE, 'Smart playmaker, adaptive strategy', 'Had an intake jam', NULL);

```

Next, set up the .env.local by copying and renaming .env.local.template to .env.local.
Import your database passwords from vercel to your local machine in that file.
Add the database name yourself.
Add the FIRST api token.

Finally, execute the following command to run the code:

```bash
npm run dev
```