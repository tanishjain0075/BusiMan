import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PrinterIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getInvoice } from '../../api/invoice.api';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

const STATUS_VARIANTS = { paid: 'success', draft: 'default', overdue: 'danger', sent: 'info' };

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoice(id)
      .then(({ data }) => setInvoice(data.invoice || data))
      .catch(() => toast.error('Failed to load invoice.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-96"><Spinner size="lg" /></div>;
  if (!invoice) return <p className="text-slate-400 text-center mt-20">Invoice not found.</p>;

  const isInterState = invoice.isInterState;

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; background: white !important; color: black !important; }
          .print-card * { color: black !important; background: transparent !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Button variant="ghost" size="sm" onClick={() => navigate('/billing')}>
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            <PrinterIcon className="h-4 w-4" />
            Print
          </Button>
        </div>

        {/* Invoice Card */}
        <div className="print-card bg-slate-800 rounded-xl ring-1 ring-slate-700 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-700 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-indigo-400">BusiMan</h1>
              <p className="text-slate-500 text-sm mt-0.5">Business Management System</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-100">{invoice.invoiceNumber}</p>
              <p className="text-sm text-slate-400 mt-0.5">{formatDate(invoice.createdAt)}</p>
              <div className="mt-2">
                <Badge variant={STATUS_VARIANTS[invoice.status] || 'default'}>
                  {invoice.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="px-8 py-5 border-b border-slate-700 bg-slate-800/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Bill To</p>
            <p className="text-slate-100 font-semibold">{invoice.client?.name}</p>
            {invoice.client?.businessName && <p className="text-slate-400 text-sm">{invoice.client.businessName}</p>}
            {invoice.client?.gstin && <p className="text-slate-400 text-sm">GSTIN: {invoice.client.gstin}</p>}
            {invoice.client?.phone && <p className="text-slate-400 text-sm">{invoice.client.phone}</p>}
          </div>

          {/* Line Items */}
          <div className="px-8 py-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-500 font-semibold">Item</th>
                  <th className="text-right py-2 text-slate-500 font-semibold">Qty</th>
                  <th className="text-right py-2 text-slate-500 font-semibold">Rate</th>
                  <th className="text-right py-2 text-slate-500 font-semibold">GST</th>
                  <th className="text-right py-2 text-slate-500 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {invoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 text-slate-200">
                      {item.product?.name || 'Item'}
                      <span className="text-slate-500 text-xs ml-2">({item.unit})</span>
                    </td>
                    <td className="py-3 text-right text-slate-300">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-300">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right text-slate-300">{item.gstRate}%</td>
                    <td className="py-3 text-right text-slate-200 font-medium">{formatCurrency(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 py-5 border-t border-slate-700 bg-slate-800/50">
            <div className="max-w-xs ml-auto space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {isInterState ? (
                <div className="flex justify-between text-slate-400">
                  <span>IGST</span>
                  <span>{formatCurrency(invoice.igstTotal)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>CGST</span>
                    <span>{formatCurrency(invoice.cgstTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SGST</span>
                    <span>{formatCurrency(invoice.sgstTotal)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-base font-bold text-slate-100 border-t border-slate-700 pt-3">
                <span>Grand Total</span>
                <span className="text-indigo-400">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer notes */}
          {invoice.notes && (
            <div className="px-8 py-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-slate-400">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceDetail;
