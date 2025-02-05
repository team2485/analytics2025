'use client';
import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export default function PiecePlacement({ L1, L2, L3, L4, net, processor, HP }) {
  const [isClient, setIsClient] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isClient && chartRef.current) {
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
            datasets: [{
              label: 'Piece Placement',
              data: [L1, L2, L3, L4, net, processor, HP],
              backgroundColor: "#76E3D3",
              borderColor: "#18a9a2",
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              }
            },
            plugins: {
              legend: {
                display: false // Disable the legend entirely
              }
            }
          }
        });
      }
    }
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isClient, L1, L2, L3, L4, net, processor, HP]);
  if (!isClient) {
    return null;
  }
  return <canvas ref={chartRef} />;
}