import React, { useMemo } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

function BarChart({ results }) {
    // Function to calculate average accuracy for each difficulty level
    const calculateAverageAccuracy = (difficulty) => {
        const filteredResults = results.filter(r => r.difficulty === difficulty);
        const totalAccuracy = filteredResults.reduce((sum, r) => sum + r.accuracy, 0);
        return filteredResults.length > 0 ? (totalAccuracy / filteredResults.length).toFixed(2) : 0;
    };

    // Memoize chart data for performance optimization
    const chartData = useMemo(() => ({
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
            {
                label: 'Average Accuracy (%)',
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], // Colors: Green, Yellow, Red
                data: [
                    calculateAverageAccuracy('Easy'),
                    calculateAverageAccuracy('Medium'),
                    calculateAverageAccuracy('Hard'),
                ],
            },
        ],
    }), [results]); // Recalculate when `results` change

    return (
        <div style={{ width: '600px', height: '400px' }} className="mx-auto">
            <Bar data={chartData} />
        </div>
    );
}

export default BarChart;
