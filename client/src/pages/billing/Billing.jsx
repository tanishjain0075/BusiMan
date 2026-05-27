import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getInvoices, deleteInvoice } from '../../api/invoice.api';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STATUS_VARIANTS = {
  paid: 'success',
  draft: 'default',
  overdue: 'danger',
  sent: 'info',
};

const Billing = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await getInvoices(params);
      setInvoices(data.invoices || data);
    } catch {
      toast.error('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await deleteInvoice(id);
      toast.success('Invoice deleted.');
      load();
    } catch {
      toast.error('Failed to delete invoice.');
    }
  };

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    {
      key: 'client',
      label: 'Client',
      render: (v) => v?.name || '—',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (v) => formatDate(v),
    },
    {
      key: 'grandTotal',
      label: 'Total',
      render: (v) => formatCurrency(v),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <Badge variant={STATUS_VARIANTS[v] || 'default'}>{v?.toUpperCase()}</Badge>,
    },
    {
      key: '_id',
      label: 'Actions',
      render: (_, row) => (
        <span className="flex items-center gap-2">
          <button onClick={() => navigate(`/billing/${row._id}`)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors">
            <TrashIcon className="h-4 w-4" />
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>

        <Button onClick={() => navigate('/billing/create')}>
          <PlusIcon className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <Table columns={columns} data={invoices} loading={loading} emptyMessage="No invoices found." />
    </div>
  );
};

export default Billing;
