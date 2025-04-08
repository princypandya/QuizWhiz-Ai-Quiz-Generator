import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

function BarChart({ results }) {
    const calculateAverageAccuracy = (difficulty) => {
        const filteredResults = results.filter(r => r.difficulty === difficulty);
        const totalAccuracy = filteredResults.reduce((sum, r) => {
            if (r.totalQuestions && r.score !== undefined) {
                return sum + (r.score / r.totalQuestions);
            }
            return sum;
        }, 0);
        return filteredResults.length > 0
            ? parseFloat(((totalAccuracy / filteredResults.length) * 100).toFixed(2))
            : 0;
    };

    const chartData = useMemo(() => ({
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
            {
                label: 'Average Accuracy (%)',
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                data: [
                    calculateAverageAccuracy('easy'),
                    calculateAverageAccuracy('medium'),
                    calculateAverageAccuracy('hard'),
                ],
            },
        ],
    }), [results]);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Average Accuracy by Difficulty',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Accuracy (%)'
                }
            },
        },
    };

    if (!results || results.length === 0) {
        return <p>No data available to display chart.</p>;
    }

    return (
        <div style={{ width: '600px', height: '400px' }} className="mx-auto">
            <Bar data={chartData} 
            options={options} />
        </div>
    );
}

export default BarChart;
