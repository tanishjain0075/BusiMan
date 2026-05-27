import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CurrencyRupeeIcon,
  UsersIcon,
  CubeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { getDashboardStats, getRevenueChart, getTopProducts } from '../../api/dashboard.api';
import { getLowStockProducts } from '../../api/product.api';
import StatCard from '../../components/common/StatCard';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import RevenueChart from '../../components/charts/RevenueChart';
import ProductChart from '../../components/charts/ProductChart';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, revenueRes, topRes, lowRes] = await Promise.all([
          getDashboardStats(),
          getRevenueChart(),
          getTopProducts(),
          getLowStockProducts(),
        ]);
        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
        setTopProducts(topRes.data);
        setLowStock(lowRes.data);
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={CurrencyRupeeIcon}
          color="indigo"
          trend="up"
          trendValue={stats?.revenueTrend}
        />
        <StatCard
          title="Total Clients"
          value={stats?.totalClients ?? 0}
          icon={UsersIcon}
          color="emerald"
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          icon={CubeIcon}
          color="amber"
        />
        <StatCard
          title="Pending Invoices"
          value={stats?.pendingInvoices ?? 0}
          icon={DocumentTextIcon}
          color="red"
          trend="neutral"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueData} />
        <ProductChart data={topProducts} />
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-slate-800 rounded-xl ring-1 ring-amber-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-200">Low Stock Alerts</h2>
            <Badge variant="warning">{lowStock.length} items</Badge>
          </div>
          <div className="space-y-2">
            {lowStock.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-700/40"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">{product.name}</p>
                  <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-300">Qty: {product.quantity}</span>
                  <Badge variant="warning">LOW</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
