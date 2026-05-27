import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getClients, deleteClient } from '../../api/client.api';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import AddClient from './AddClient';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getClients({ search });
      setClients(data.clients || data);
    } catch {
      toast.error('Failed to load clients.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await deleteClient(id);
      toast.success('Client deleted.');
      load();
    } catch {
      toast.error('Failed to delete client.');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'businessName', label: 'Business' },
    { key: 'phone', label: 'Phone' },
    { key: 'gstin', label: 'GSTIN', render: (v) => v || '—' },
    {
      key: 'totalPurchases',
      label: 'Total Purchases',
      render: (v) => v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—',
    },
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
          <SearchBar value={search} onChange={(v) => setSearch(v)} placeholder="Search clients..." />
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <PlusIcon className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Table columns={columns} data={clients} loading={loading} emptyMessage="No clients found." />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Client">
        <AddClient onSuccess={() => { setShowAdd(false); load(); }} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Client">
        {editTarget && (
          <AddClient
            existing={editTarget}
            onSuccess={() => { setEditTarget(null); load(); }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Clients;
