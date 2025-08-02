import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TimeSeriesChart({ results }) {
  const [period, setPeriod] = useState('month');

  const processData = useMemo(() => {
    if (!results || results.length === 0) {
      // Generate sample data for demonstration
      const now = new Date();
      const sampleLabels = [];
      const sampleData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        sampleLabels.push(date.toLocaleDateString());
        sampleData.push(Math.floor(Math.random() * 5) + 1); // Random quiz count 1-5
      }
      
      return { labels: sampleLabels, data: sampleData, isSample: true };
    }

    const now = new Date();
    let startDate;
    let groupBy;

    // Set start date and grouping based on period
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        groupBy = 'hour';
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupBy = 'day';
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = 'month';
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupBy = 'day';
    }

    // Filter results within the selected period
    const filteredResults = results.filter(result => {
      const resultDate = new Date(result.date);
      return resultDate >= startDate && resultDate <= now;
    });

    // Group results by time period
    const groupedData = {};
    
    filteredResults.forEach(result => {
      const resultDate = new Date(result.date);
      let key;

      switch (groupBy) {
        case 'hour':
          key = resultDate.toLocaleDateString() + ' ' + resultDate.getHours() + ':00';
          break;
        case 'day':
          key = resultDate.toLocaleDateString();
          break;
        case 'month':
          key = resultDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          break;
        default:
          key = resultDate.toLocaleDateString();
      }

      groupedData[key] = (groupedData[key] || 0) + 1;
    });

    // Fill in missing dates with 0
    const allKeys = [];
    const current = new Date(startDate);

    while (current <= now) {
      let key;
      switch (groupBy) {
        case 'hour':
          if (current.getDate() === startDate.getDate()) {
            for (let hour = current.getHours(); hour < 24; hour++) {
              key = current.toLocaleDateString() + ' ' + hour + ':00';
              allKeys.push(key);
            }
          }
          current.setHours(current.getHours() + 1);
          break;
        case 'day':
          key = current.toLocaleDateString();
          allKeys.push(key);
          current.setDate(current.getDate() + 1);
          break;
        case 'month':
          key = current.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          allKeys.push(key);
          current.setMonth(current.getMonth() + 1);
          break;
        default:
          key = current.toLocaleDateString();
          allKeys.push(key);
          current.setDate(current.getDate() + 1);
      }
    }

    // Create final data arrays
    const labels = allKeys.slice(0, 20); // Limit to 20 data points for better visualization
    const data = labels.map(label => groupedData[label] || 0);

    return { labels, data, isSample: false };
  }, [results, period]);

  const chartData = {
    labels: processData.labels,
    datasets: [
      {
        label: 'Quizzes Attempted',
        data: processData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: `Quiz Activity - ${period.charAt(0).toUpperCase() + period.slice(1)} View`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `Date: ${context[0].label}`;
          },
          label: function(context) {
            return `Quizzes: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Time Period',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Number of Quizzes',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        hoverRadius: 8,
        radius: 6,
      },
      line: {
        tension: 0.3,
      },
    },
  };

  const totalQuizzes = processData.data.reduce((sum, count) => sum + count, 0);
  const averageQuizzes = processData.data.length > 0 ? (totalQuizzes / processData.data.length).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex justify-center space-x-4">
          {['day', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                period === p
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalQuizzes}</div>
          <div className="text-sm text-blue-500">Total Quizzes</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{averageQuizzes}</div>
          <div className="text-sm text-green-500">Average per Period</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Summary */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {processData.isSample ? (
          <p className="text-orange-600 font-medium">
            📊 Showing sample data. Complete a quiz to see your actual activity!
          </p>
        ) : (
          <p>
            Showing quiz activity for the selected {period} period. 
            {totalQuizzes > 0 && (
              <span className="ml-2 font-medium">
                You attempted {totalQuizzes} quiz{totalQuizzes !== 1 ? 'es' : ''} in this period.
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default TimeSeriesChart; 