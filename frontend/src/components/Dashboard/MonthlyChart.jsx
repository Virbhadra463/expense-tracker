import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MonthlyChart = ({ expenses = [] }) => {
    // Generate the last 6 months labels and data buckets
    const labels = [];
    const monthlyData = [];
    const today = new Date();

    // Iterate backwards from 5 months ago to the current month to have it left-to-right chronologically
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        labels.push(date.toLocaleString('default', { month: 'short' }));
        monthlyData.push({ month: date.getMonth(), year: date.getFullYear(), total: 0 });
    }

    // Aggregate expenses into the correct month buckets
    expenses.forEach(exp => {
        if (!exp.date) return;
        const expDate = new Date(exp.date);
        const bucket = monthlyData.find(d => d.month === expDate.getMonth() && d.year === expDate.getFullYear());
        if (bucket) {
            bucket.total += parseFloat(exp.amount || 0);
        }
    });

    const dataArray = monthlyData.map(d => d.total);

    const monthlyChartData = {
        labels: labels,
        datasets: [{
            label: 'Spent',
            data: dataArray,
            backgroundColor: '#4D10A6',
            borderRadius: 12,
            maxBarThickness: 40
        }]
    };

    const monthlyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return 'Spent: ₹' + context.parsed.y.toLocaleString('en-IN');
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                border: { display: false },
                grid: { color: '#F3F4F6', drawTicks: false },
                ticks: {
                    color: '#6B7280',
                    font: { size: 12 },
                    callback: function (value) {
                        return '₹' + (value / 1000) + 'k';
                    },
                    padding: 8
                }
            },
            x: {
                border: { display: false },
                grid: { display: false },
                ticks: {
                    color: '#6B7280',
                    font: { size: 12 }
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Monthly Expenses</h3>
                <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
            <div className="relative" style={{ height: '250px' }}>
                <Bar data={monthlyChartData} options={monthlyChartOptions} />
            </div>
        </div>
    );
};

export default MonthlyChart;
