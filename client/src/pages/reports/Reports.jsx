import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  CalendarIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CubeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { getSalesReport, getInventoryReport, getClientReport } from '../../api/report.api';
import Table from '../../components/common/Table';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');

  // Sales State
  const [salesData, setSalesData] = useState([]);
  const [salesSummary, setSalesSummary] = useState({ count: 0, subtotal: 0, tax: 0, total: 0 });
  const [salesLoading, setSalesLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Inventory State
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  // Client State
  const [clientData, setClientData] = useState([]);
  const [clientLoading, setClientLoading] = useState(true);

  // 1. Load Sales Report
  const loadSales = useCallback(async () => {
    setSalesLoading(true);
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const { data } = await getSalesReport(params);
      setSalesData(data.invoices || data.data?.invoices || []);
      setSalesSummary(
        data.summary || data.data?.summary || { count: 0, subtotal: 0, tax: 0, total: 0 }
      );
    } catch {
      toast.error('Failed to load sales report.');
    } finally {
      setSalesLoading(false);
    }
  }, [fromDate, toDate]);

  // 2. Load Inventory Report
  const loadInventory = useCallback(async () => {
    setInventoryLoading(true);
    try {
      const { data } = await getInventoryReport();
      setInventoryData(data.data || data || []);
    } catch {
      toast.error('Failed to load inventory report.');
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  // 3. Load Client Report
  const loadClients = useCallback(async () => {
    setClientLoading(true);
    try {
      const { data } = await getClientReport();
      setClientData(data.data || data || []);
    } catch {
      toast.error('Failed to load client report.');
    } finally {
      setClientLoading(false);
    }
  }, []);

  // Sync loading on tab switch
  useEffect(() => {
    if (activeTab === 'sales') {
      loadSales();
    } else if (activeTab === 'inventory') {
      loadInventory();
    } else if (activeTab === 'clients') {
      loadClients();
    }
  }, [activeTab, loadSales, loadInventory, loadClients]);

  // Helper calculation for inventory valuation summary
  const totalValuation = inventoryData.reduce((acc, curr) => acc + (curr.inventoryValue || 0), 0);
  const lowStockCount = inventoryData.filter((item) => item.isLowStock || item.quantity <= 10).length;

  // Helper for Top customer computation
  const topCustomer = clientData.length > 0 ? clientData[0] : null;

  // Column definitions for Sales Table
  const salesColumns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    { key: 'client', label: 'Client', render: (v) => v?.name || '—' },
    { key: 'createdAt', label: 'Date', render: (v) => formatDate(v) },
    { key: 'subtotal', label: 'Subtotal', render: (v) => formatCurrency(v) },
    { key: 'cgstTotal', label: 'CGST', render: (_, r) => formatCurrency((r.cgstTotal || 0) + (r.sgstTotal || 0) + (r.igstTotal || 0)) },
    { key: 'total', label: 'Total Sales', render: (v) => formatCurrency(v) },
    {
      key: 'status',
      label: 'Status',
      render: (v) => {
        const variants = { paid: 'success', sent: 'info', overdue: 'danger', draft: 'default' };
        return <Badge variant={variants[v] || 'default'}>{v?.toUpperCase() || 'UNKNOWN'}</Badge>;
      },
    },
  ];

  // Column definitions for Inventory Valuation Table
  const inventoryColumns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category', render: (v) => v || '—' },
    {
      key: 'quantity',
      label: 'Qty',
      render: (v, r) => (
        <span className="flex items-center gap-2 font-medium">
          {v}
          {(v <= 10 || r.isLowStock) && (
            <Badge variant="danger">LOW STOCK</Badge>
          )}
        </span>
      ),
    },
    { key: 'costPrice', label: 'Cost Price', render: (v) => formatCurrency(v) },
    { key: 'sellingPrice', label: 'Selling Price', render: (v) => formatCurrency(v) },
    { key: 'inventoryValue', label: 'Valuation', render: (v) => formatCurrency(v) },
  ];

  // Column definitions for Client Purchase Table
  const clientColumns = [
    { key: 'name', label: 'Client Name' },
    { key: 'businessName', label: 'Business Name', render: (v) => v || '—' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'invoiceCount', label: 'Invoices Issued', render: (v) => <span className="font-semibold text-indigo-400">{v || 0}</span> },
    {
      key: 'totalPurchases',
      label: 'Total Purchased',
      render: (v) => (
        <span className="font-bold text-emerald-400">{formatCurrency(v)}</span>
      ),
    },
  ];

  // Trigger local CSV generation or Print report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <ChartBarIcon className="h-8 w-8 text-indigo-500" />
            BusiMan B2B Reports Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Analyze business health, inventory value, and sales tax reporting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Modern Glassmorphic Tabs */}
      <div className="flex bg-slate-800 p-1.5 rounded-xl ring-1 ring-slate-700/60 w-fit">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'sales'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarIcon className="h-4 w-4" />
          Sales & Tax Reports
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'inventory'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CubeIcon className="h-4 w-4" />
          Inventory Valuation
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'clients'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UsersIcon className="h-4 w-4" />
          Customer Value
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filters */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-end gap-4 shadow-lg">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadSales}
                disabled={salesLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md h-[42px]"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Filter Report
              </button>
              {(fromDate || toDate) && (
                <button
                  onClick={() => {
                    setFromDate('');
                    setToDate('');
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors h-[42px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sales Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Invoices Raised"
              value={salesSummary.count}
              color="indigo"
              icon={ChartBarIcon}
            />
            <StatCard
              title="Untaxed Revenue"
              value={formatCurrency(salesSummary.subtotal)}
              color="emerald"
            />
            <StatCard
              title="Tax Collected (GST)"
              value={formatCurrency(salesSummary.tax)}
              color="amber"
            />
            <StatCard
              title="Total Billed Value"
              value={formatCurrency(salesSummary.total)}
              color="indigo"
            />
          </div>

          {/* Sales Table */}
          <div className="bg-slate-800 rounded-2xl p-6 ring-1 ring-slate-700/60 shadow-xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Detailed Invoiced Transactions</h3>
            <Table
              columns={salesColumns}
              data={salesData}
              loading={salesLoading}
              emptyMessage="No sales transactions found in the specified range."
            />
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Inventory Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Unique Products"
              value={inventoryData.length}
              color="indigo"
              icon={CubeIcon}
            />
            <StatCard
              title="Low Stock Warning Threshold"
              value={lowStockCount}
              color={lowStockCount > 0 ? 'red' : 'emerald'}
              icon={lowStockCount > 0 ? ExclamationTriangleIcon : CheckCircleIcon}
            />
            <StatCard
              title="Total Stock Capital Value"
              value={formatCurrency(totalValuation)}
              color="emerald"
            />
          </div>

          {/* Inventory Table */}
          <div className="bg-slate-800 rounded-2xl p-6 ring-1 ring-slate-700/60 shadow-xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Real-time Stock Asset Analysis</h3>
            <Table
              columns={inventoryColumns}
              data={inventoryData}
              loading={inventoryLoading}
              emptyMessage="No inventory assets found."
            />
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Clients Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Active B2B Customers"
              value={clientData.length}
              color="indigo"
              icon={UsersIcon}
            />
            <StatCard
              title="Top Customer (Highest Purchases)"
              value={topCustomer ? `${topCustomer.name} (${formatCurrency(topCustomer.totalPurchases)})` : '—'}
              color="emerald"
            />
          </div>

          {/* Clients Table */}
          <div className="bg-slate-800 rounded-2xl p-6 ring-1 ring-slate-700/60 shadow-xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Customer Buying Frequencies</h3>
            <Table
              columns={clientColumns}
              data={clientData}
              loading={clientLoading}
              emptyMessage="No customer ledger purchases registered."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
