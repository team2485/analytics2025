"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function EPALineChart({ 
  label,
  data, 
  color = "#116677", 
  width = 350, 
  height = 175 
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <LineChart width={width} height={height} data={data}>
      <XAxis type="number" dataKey="match"/>
      <YAxis dataKey={label}/>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Line type="monotone" dataKey={label} stroke={color} strokeWidth="3"/>
    </LineChart>
  );
}