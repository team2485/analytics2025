'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function PiecePlacement({ colors, matchMax, L1, L2, L3, L4, net, processor, HP }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  console.log('Rendering PiecePlacement:', typeof window !== 'undefined' ? 'Client' : 'Server');


  useEffect(() => {
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['L1', 'L2', 'L3', 'L4', 'Net', 'Prcsr', 'HP'],
          datasets: [
            {
              data: [L1, L2, L3, L4, net, processor, HP],
              backgroundColor: colors[0],
              borderColor: colors[2],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: matchMax,
            },
          },
          plugins: {
            legend: {
              display: false // Disable the legend entirely
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [L1, L2, L3, L4, net, processor, HP, matchMax]);

  return <canvas ref={chartRef} />;
}
