'use client';
import { VictoryPie } from "victory";

export default function Endgame ({endgameData}) {
    return (
        <VictoryPie
          padding={100}
          data={endgameData}
          colorScale="blue"
          labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}%`}
        />
    )
}