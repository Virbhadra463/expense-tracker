import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SpendingTrend = ({ expenses = [] }) => {
    const chartData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const today = now.getDate();

        // Filter to current month
        const monthExpenses = expenses.filter(exp => {
            if (!exp.date) return false;
            const d = new Date(exp.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        // Build daily cumulative spend
        const dailyTotals = {};
        monthExpenses.forEach(exp => {
            const day = new Date(exp.date).getDate();
            dailyTotals[day] = (dailyTotals[day] || 0) + parseFloat(exp.amount || 0);
        });

        const labels = [];
        const data = [];
        let cumulative = 0;

        for (let d = 1; d <= today; d++) {
            labels.push(d);
            cumulative += (dailyTotals[d] || 0);
            data.push(cumulative);
        }

        return { labels, data };
    }, [expenses]);

    const data = {
        labels: chartData.labels,
        datasets: [{
            label: 'Cumulative Spend',
            data: chartData.data,
            borderColor: '#4D10A6',
            backgroundColor: (ctx) => {
                const canvas = ctx.chart.ctx;
                const gradient = canvas.createLinearGradient(0, 0, 0, 250);
                gradient.addColorStop(0, 'rgba(77, 16, 166, 0.2)');
                gradient.addColorStop(1, 'rgba(77, 16, 166, 0.01)');
                return gradient;
            },
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#4D10A6',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                intersect: false,
                mode: 'index',
                callbacks: {
                    title: (items) => `Day ${items[0].label}`,
                    label: (context) => `Total: ₹${context.parsed.y.toLocaleString('en-IN')}`
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
                    font: { size: 11 },
                    callback: (v) => '₹' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v),
                    padding: 8
                }
            },
            x: {
                border: { display: false },
                grid: { display: false },
                ticks: {
                    color: '#6B7280',
                    font: { size: 11 },
                    maxTicksLimit: 10
                }
            }
        }
    };

    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Spending Trend</h3>
                <span className="text-sm text-gray-500">{monthName}</span>
            </div>
            <div className="relative" style={{ height: '280px' }}>
                {chartData.data.length > 0 ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        No expenses this month yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpendingTrend;
