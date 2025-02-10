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
   AutoL1Scored INT,
   AutoL1Failed INT,
   AutoL2Scored INT,
   AutoL2Failed INT,
   AutoL3Scored INT,
   AutoL3Failed INT,
   AutoL4Scored INT,
   AutoL4Failed INT,
   AutoCoralScored INT,
   AutoCoralFailed INT,
   AutoAlgaeRemoved INT,
   AutoProcessorScored INT,
   AutoProcessorFailed INT,
   AutoNetScored INT,
   AutoNetFailed INT,
   TeleL1Scored INT,
   TeleL1Failed INT,
   TeleL2Scored INT,
   TeleL2Failed INT,
   TeleL3Scored INT,
   TeleL3Failed INT,
   TeleL4Scored INT,
   TeleL4Failed INT,
   TeleCoralScored INT,
   TeleCoralFailed INT,
   TeleAlgaeRemoved INT,
   TeleProcessorScored INT,
   TeleProcessorFailed INT,
   TeleNetScored INT,
   TeleNetFailed INT,
   HPScored INT,
   HPFailed INT,
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
   AutoL1Scored, AutoL1Failed, AutoL2Scored, AutoL2Failed, AutoL3Scored, AutoL3Failed, AutoL4Scored, AutoL4Failed, 
   AutoCoralScored, AutoCoralFailed, AutoAlgaeRemoved, AutoProcessorScored, AutoProcessorFailed, AutoNetScored, AutoNetFailed,
   TeleL1Scored, TeleL1Failed, TeleL2Scored, TeleL2Failed, TeleL3Scored, TeleL3Failed, TeleL4Scored, TeleL4Failed, 
   TeleCoralScored, TeleCoralFailed, TeleAlgaeRemoved, TeleProcessorScored, TeleProcessorFailed, TeleNetScored, TeleNetFailed, 
   HPScored, HPFailed, EndLocation, CoralSpeed, ProcessorSpeed, NetSpeed, AlgaeRemovalSpeed, ClimbSpeed, Maneuverability, 
   DefensePlayed, DefenseEvasion, Aggression, CageHazard, CoralGrndIntake, CoralStationIntake, Lollipop, AlgaeGrndIntake, 
   AlgaeHighReefIntake, AlgaeLowReefIntake, GeneralComments, BreakdownComments, DefenseComments
) VALUES 
('John Doe', 2475, 9, 1, 0, FALSE, FALSE, FALSE, 1, 0, 4, 1, 2, 0, 4, 8, 3, 7, TRUE, 4, 6, 10, 3, 1, 9, 4, FALSE, FALSE, 4, 3, 1, 2, FALSE, FALSE, FALSE, FALSE, FALSE, 'Very maneuverable', NULL, 'Very good at getting in other’s way, able to effectively slow down other alliance.'),
('Milan Gupta', 2485, 11, 1, 0, FALSE, FALSE, FALSE, 0, 3, 5, 2, 5, 2, 3, 1, 0, 5, FALSE, 5, 1, 8, 7, 9, 6, 7, TRUE, FALSE, 2, 7, 5, 4, TRUE, FALSE, TRUE, TRUE, FALSE, 'Reliable scorer with consistent performance', NULL, 'Solid wall defense against high-scoring robots'),
('Preston Seay', 2495, 10, 1, 0, FALSE, FALSE, FALSE, 2, 1, 2, 0, 3, 1, 0, 2, 2, 4, TRUE, 3, 0, 7, 5, 6, 5, 6, FALSE, FALSE, 3, 5, 4, 7, TRUE, FALSE, FALSE, FALSE, TRUE, 'Creative playmaker with unexpected maneuvers', 'Strategic use of stage hazards to disrupt opponents', NULL);



```

Next, set up the .env.local by copying and renaming .env.local.template to .env.local.
Import your database passwords from vercel to your local machine in that file.
Add the database name yourself.
Add the FIRST api token.

Finally, execute the following command to run the code:

```bash
npm run dev
```