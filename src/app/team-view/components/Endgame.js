
'use client';
import { useState, useEffect } from 'react';
import { VictoryPie } from "victory";

export default function Endgame({ endgameData }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <VictoryPie
      padding={100}
      data={endgameData}
      colorScale="blue"
      labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}%`}
    />
  );
}