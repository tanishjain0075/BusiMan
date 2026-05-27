import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getProducts, deleteProduct } from '../../api/product.api';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ search, page, limit: 10 });
      setProducts(data.products || data);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted.');
      load();
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
      render: (val) => val?.name || val || '—',
    },
    {
      key: 'quantity',
      label: 'Qty',
      render: (val, row) => (
        <span className="flex items-center gap-2">
          {val}
          {val <= (row.lowStockThreshold || 10) && <Badge variant="warning">LOW</Badge>}
        </span>
      ),
    },
    {
      key: 'sellingPrice',
      label: 'Selling Price',
      render: (val) => formatCurrency(val),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (_, row) => (
        <span className="flex items-center gap-2">
          <button
            onClick={() => setEditTarget(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="w-72">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search products..." />
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Table columns={columns} data={products} loading={loading} emptyMessage="No products found." />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Product" size="lg">
        <AddProduct
          onSuccess={() => { setShowAdd(false); load(); }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Product" size="lg">
        {editTarget && (
          <EditProduct
            product={editTarget}
            onSuccess={() => { setEditTarget(null); load(); }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
