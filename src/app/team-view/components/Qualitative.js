'use client';
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function Qualitative({ color = "#116677", data }) {
  const [isClient, setIsClient] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: data.map(item => item.name),
            datasets: [{
              data: data.map(item => item.rating),
              fill: true,
              backgroundColor: color + '4D', // Adding transparency
              borderColor: color,
              pointBackgroundColor: color,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: color
            }]
          },
          options: {
            responsive: true,
            scales: {
              r: {
                angleLines: { display: true },
                suggestedMin: 0,
                suggestedMax: 5,
                ticks: { stepSize: 1 }
              }
            },
            plugins: {
              legend: {
                display: false 
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isClient, data, color]);

  if (!isClient) {
    return null;
  }

  return <canvas ref={chartRef} />;
}