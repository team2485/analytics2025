/*"use client";
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
} */

  /*"use client";
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
} */

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
  const [regressionData, setRegressionData] = useState([]);

  useEffect(() => {
    setIsClient(true);
    
    // Calculate linear regression when data changes
    if (data && data.length > 1) {
      calculateRegressionLine();
    }
  }, [data]);

  const calculateRegressionLine = () => {
    // Skip if no data
    if (!data || data.length < 2) return;
    
    // Extract x and y values
    const xyValues = data.map(item => ({
      x: item.match,
      y: item[label]
    }));
    
    // Calculate the regression line using least squares method
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    const n = xyValues.length;
    
    for (let i = 0; i < n; i++) {
      sumX += xyValues[i].x;
      sumY += xyValues[i].y;
      sumXY += xyValues[i].x * xyValues[i].y;
      sumXX += xyValues[i].x * xyValues[i].x;
    }
   
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Find min and max x values to draw the regression line
    const minX = Math.min(...xyValues.map(point => point.x));
    const maxX = Math.max(...xyValues.map(point => point.x));
    
    // Create regression line data points
    const regressionPoints = [
      { match: minX, [label]: slope * minX + intercept, regression: slope * minX + intercept },
      { match: maxX, [label]: slope * maxX + intercept, regression: slope * minX + intercept }
    ];
    
    setRegressionData(regressionPoints);
  };

  if (!isClient) return null;
  
  return (
    <LineChart width={width} height={height} data={[...data, ...regressionData]}>
      <XAxis type="number" dataKey="match"/>
      <YAxis dataKey={label}/>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Line type="monotone" dataKey={label} stroke={color} strokeWidth="3" />
      <Line 
        type="monotone" 
        dataKey="regression" 
        stroke="#ff7300" 
        strokeWidth="2" 
        dot={false} 
        activeDot={false} 
        strokeDasharray="5 5" 
      />
    </LineChart>
  );
}