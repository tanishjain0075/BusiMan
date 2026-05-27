import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getVendors, deleteVendor } from '../../api/vendor.api';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import AddVendor from './AddVendor';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getVendors({ search });
      setVendors(data.vendors || data);
    } catch {
      toast.error('Failed to load vendors.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    try {
      await deleteVendor(id);
      toast.success('Vendor deleted.');
      load();
    } catch {
      toast.error('Failed to delete vendor.');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'businessName', label: 'Business' },
    { key: 'phone', label: 'Phone' },
    { key: 'gstin', label: 'GSTIN', render: (v) => v || '—' },
    { key: 'paymentTerms', label: 'Payment Terms', render: (v) => v || '—' },
    {
      key: '_id',
      label: 'Actions',
      render: (_, row) => (
        <span className="flex items-center gap-2">
          <button onClick={() => setEditTarget(row)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors">
            <PencilSquareIcon className="h-4 w-4" />
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
        <div className="w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Search vendors..." />
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <PlusIcon className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <Table columns={columns} data={vendors} loading={loading} emptyMessage="No vendors found." />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Vendor">
        <AddVendor onSuccess={() => { setShowAdd(false); load(); }} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Vendor">
        {editTarget && (
          <AddVendor existing={editTarget} onSuccess={() => { setEditTarget(null); load(); }} onCancel={() => setEditTarget(null)} />
        )}
      </Modal>
    </div>
  );
};

export default Vendors;
