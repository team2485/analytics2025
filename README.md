## Getting Started

First, install the dependencies:

```bash
npm install
```

Next, set up the database on Vercel with test data.
```sql

CREATE TABLE CompetitionYear (
   ID serial PRIMARY KEY,
   ScoutName VARCHAR (255),
   ScoutTeam INT,
   Team INT,
   Match INT,
   Breakdown BOOLEAN,
   NoShow BOOLEAN,
   Leave BOOLEAN,
   AutoAmpScored INT,
   AutoAmpFailed INT,
   AutoSpeakerScored INT,
   AutoSpeakerFailed INT,
   PassedNotes INT,
   TeleAmpScored INT,
   TeleAmpFailed INT,
   TeleNAmpedSpeakerScored INT,
   TeleAmpedSpeakerScored INT,
   TeleSpeakerFailed INT,
   EndLocation INT,
   StagePlacement INT,
   Harmony BOOLEAN,
   TrapScored INT,
   TrapFailed INT,
   Maneuverability INT,
   Aggression INT,
   DefenseRating INT,
   DefenseEvasion INT,
   SpeakerSpeed INT,
   AmpSpeed INT,
   GndIntake BOOLEAN,
   SrcIntake BOOLEAN,
   StageHazard INT,
   TrapSpeed INT,
   OnStageSpeed INT,
   HarmonySpeed INT,
   GeneralComments VARCHAR (255),
   BreakdownComments VARCHAR (255),
   DefenseComments VARCHAR (255)
);

INSERT INTO phr2025 (ScoutName, ScoutTeam, Team, Match, Breakdown, NoShow, Leave, AutoAmpScored, AutoAmpFailed, AutoSpeakerScored, AutoSpeakerFailed, TeleAmpScored, TeleAmpFailed, TeleNAmpedSpeakerScored, TeleAmpedSpeakerScored, TeleSpeakerFailed, EndLocation, Harmony, TrapScored, TrapFailed, Maneuverability, Aggression, DefenseEvasion, SpeakerSpeed, AmpSpeed, GndIntake, SrcIntake, StageHazard, TrapSpeed, OnStageSpeed, HarmonySpeed, GeneralComments, BreakdownComments, DefenseComments)
VALUES 
('John Doe ', 2475, 9, 1, FALSE, FALSE, FALSE, 1, 0, 4, 1, 2, 0, 4, 8, 3, 7, TRUE, 4, 6, 10, 3, 1, 9, 4, FALSE, FALSE, 4, 3, 1, 2, 'Very maneuverable', NULL, 'Very good at getting in other’s way, able to effectively slow down other alliance.'), 
('Milan Gupta', 2485, 11, 1, FALSE, FALSE, FALSE, 0, 3, 5, 2, 5, 2, 3, 1, 0, 5, FALSE, 5, 1, 8, 7, 9, 6, 7, TRUE, FALSE, 2, 7, 5, 4, 'Reliable scorer with consistent performance', NULL, 'Solid wall defense against high-scoring robots'),
('Preston Seay', 2495, 10, 1, FALSE, FALSE, FALSE, 2, 1, 2, 0, 3, 1, 0, 2, 2, 4, TRUE, 3, 0, 7, 5, 6, 5, 6, FALSE, FALSE, 3, 5, 4, 7, 'Creative playmaker with unexpected maneuvers', 'Strategic use of stage hazards to disrupt opponents', NULL),
('John Doe', 2475, 9, 2, FALSE, FALSE, FALSE, 2, 2, 3, 0, 4, 1, 1, 5, 2, 6, TRUE, 3, 4, 9, 2, 5, 8, 5, FALSE, TRUE, 2, 5, 3, 4, 'Solid defense with opportunistic scoring', NULL, 'Effective at drawing penalties with strategic maneuvering'),
('Milan Gupta', 2485, 11, 2, FALSE, FALSE, FALSE, 3, 0, 2, 3, 2, 1, 2, 3, 1, 4, FALSE, 2, 2, 7, 6, 8, 5, 4, TRUE, FALSE, 3, 4, 7, 3, 'Consistent climber with strong field awareness', NULL, 'Anticipatory defense against climbing-focused robots'),
('Preston Seay', 2495, 10, 2, FALSE, FALSE, FALSE, 1, 1, 4, 1, 3, 2, 3, 0, 2, 3, TRUE, 4, 1, 6, 4, 7, 6, 7, FALSE, FALSE, 1, 6, 5, 6, 'Technical finesse with efficient movements', 'Minor issue with auto speaker in breakdown', 'Strong strategic coordination with alliance partners');


```

Next, set up the .env.local by copying and renaming .env.local.template to .env.local.
Import your database passwords from vercel to your local machine in that file.
Add the database name yourself.
Add the FIRST api token.

Finally, execute the following command to run the code:

```bash
npm run dev
```