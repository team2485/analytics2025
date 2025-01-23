'use client';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function PiecePlacement({ matchMax, L1, L2, L3, L4, net, processor, HP }) {
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
          labels: ['L1', 'L2', 'L3', 'L4', 'Net', 'Proc', 'HP'],
          datasets: [
            {
              label: 'Piece Placement',
              data: [L1, L2, L3, L4, net, processor, HP],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
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
        },
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
