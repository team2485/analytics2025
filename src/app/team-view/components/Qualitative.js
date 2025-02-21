'use client';
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function Qualitative({ color1, color2, data }) {
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
              backgroundColor: color1 + '4D', // Adding transparency
              borderColor: color2,
              pointBackgroundColor: color2,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: color2
            }]
          },
          options: {
            responsive: true,
            layout: {
              padding: {
                top: 1
              },
            },
            scales: {
              r: {
                angleLines: { display: true },
                suggestedMin: -1,
                suggestedMax: 5,
                ticks: { stepSize: 1 }, 
                pointLabels: {
                  font: {size: 11},
              },
              }
            },
            plugins: {
              legend: {
                display: false ,
                position: 'bottom',
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
  }, [isClient, data, color1, color2]);

  if (!isClient) {
    return null;
  }

  return <canvas ref={chartRef} />;
}