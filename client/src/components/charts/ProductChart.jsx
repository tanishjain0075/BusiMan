import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductChart = ({ data = [] }) => {
  const top5 = data.slice(0, 5);
  const labels = top5.map((d) => d.name);
  const values = top5.map((d) => d.quantity);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Units Sold',
        data: values,
        backgroundColor: 'rgba(99,102,241,0.7)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51,65,85,0.5)' },
        ticks: { color: '#94a3b8', font: { size: 12 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 12 } },
      },
    },
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700">
      <h3 className="text-sm font-semibold text-slate-400 mb-4">Top Products by Units</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProductChart;
