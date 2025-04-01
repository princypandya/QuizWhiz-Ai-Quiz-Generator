import React, { useMemo } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

function PieChart({ data }) {
    // Memoize the chart data to avoid unnecessary re-renders
    const chartData = useMemo(() => ({
        labels: ['Easy', 'Medium', 'Hard'], // Labels for difficulty levels
        datasets: [
            {
                label: 'Difficulty Distribution',
                data: [data.easy, data.medium, data.hard], // Aggregate difficulty counts
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], // Colors for each slice
                hoverOffset: 4, // Offset when hovering
            },
        ],
    }), [data]); // Re-calculate only if `data` changes

    return (
        <div style={{ width: '400px', height: '400px' }} className="mx-auto">
            <Doughnut data={chartData} />
        </div>
    );
}

export default PieChart;
