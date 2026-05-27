import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createInvoice } from '../../api/invoice.api';
import { getClients } from '../../api/client.api';
import { getProducts } from '../../api/product.api';
import { calculateGST } from '../../utils/gst';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';

const inputCls = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';
const labelCls = 'block text-sm font-medium text-slate-300 mb-1';

const GST_RATES = [0, 5, 12, 18, 28];
const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Credit'];

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    defaultValues: {
      clientId: '',
      isInterState: false,
      paymentMode: 'Cash',
      dueDate: '',
      notes: '',
      items: [{ productId: '', quantity: 1, unitPrice: 0, unit: 'pcs', gstRate: 18 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');
  const isInterState = watch('isInterState');

  useEffect(() => {
    Promise.all([getClients(), getProducts()]).then(([c, p]) => {
      setClients(c.data?.clients || c.data || []);
      setProducts(p.data?.products || p.data || []);
    }).catch(() => {});
  }, []);

  const computedItems = (watchedItems || []).map((item) =>
    calculateGST({
      unitPrice: Number(item.unitPrice) || 0,
      quantity: Number(item.quantity) || 0,
      gstRate: Number(item.gstRate) || 0,
      isInterState,
    })
  );

  const subtotal = computedItems.reduce((s, i) => s + i.subtotal, 0);
  const totalCgst = computedItems.reduce((s, i) => s + i.cgst, 0);
  const totalSgst = computedItems.reduce((s, i) => s + i.sgst, 0);
  const totalIgst = computedItems.reduce((s, i) => s + i.igst, 0);
  const grandTotal = computedItems.reduce((s, i) => s + i.lineTotal, 0);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        client: data.clientId,
        isInterState: data.isInterState,
        paymentMode: data.paymentMode,
        dueDate: data.dueDate,
        notes: data.notes,
        items: data.items.map((item, idx) => ({
          product: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          unit: item.unit,
          gstRate: Number(item.gstRate),
          ...computedItems[idx],
        })),
        subtotal,
        cgstTotal: totalCgst,
        sgstTotal: totalSgst,
        igstTotal: totalIgst,
        grandTotal,
      };
      await createInvoice(payload);
      toast.success('Invoice created!');
      navigate('/billing');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
      {/* Section 1: Client & Settings */}
      <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Client *</label>
            <select {...register('clientId', { required: 'Client is required' })} className={`${inputCls} appearance-none`}>
              <option value="">Select client...</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name} {c.businessName ? `— ${c.businessName}` : ''}</option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-xs text-red-400">{errors.clientId.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Payment Mode</label>
            <select {...register('paymentMode')} className={`${inputCls} appearance-none`}>
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Due Date</label>
            <input type="date" {...register('dueDate')} className={inputCls} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input type="checkbox" id="isInterState" {...register('isInterState')} className="h-4 w-4 rounded accent-indigo-500" />
            <label htmlFor="isInterState" className="text-sm text-slate-300">Inter-State Supply (IGST applies)</label>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Notes</label>
          <textarea {...register('notes')} rows={2} placeholder="Optional notes..." className={`${inputCls} resize-none`} />
        </div>
      </div>

      {/* Section 2: Line Items */}
      <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Line Items</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ productId: '', quantity: 1, unitPrice: 0, unit: 'pcs', gstRate: 18 })}
          >
            <PlusIcon className="h-4 w-4" />
            Add Row
          </Button>
        </div>

        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            <span className="col-span-3">Product</span>
            <span className="col-span-1">Qty</span>
            <span className="col-span-1">Unit</span>
            <span className="col-span-2">Unit Price</span>
            <span className="col-span-1">GST%</span>
            <span className="col-span-2">Line Total</span>
            <span className="col-span-1">GST Amt</span>
            <span className="col-span-1"></span>
          </div>

          {fields.map((field, idx) => {
            const computed = computedItems[idx];
            const gstAmt = isInterState ? computed?.igst : (computed?.cgst || 0) + (computed?.sgst || 0);
            return (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3">
                  <select {...register(`items.${idx}.productId`)} className={`${inputCls} appearance-none`}>
                    <option value="">Select...</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <input type="number" min="1" {...register(`items.${idx}.quantity`)} className={inputCls} />
                </div>
                <div className="col-span-1">
                  <input {...register(`items.${idx}.unit`)} placeholder="pcs" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <input type="number" step="0.01" {...register(`items.${idx}.unitPrice`)} className={inputCls} />
                </div>
                <div className="col-span-1">
                  <select {...register(`items.${idx}.gstRate`)} className={`${inputCls} appearance-none`}>
                    {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                <div className="col-span-2 text-sm text-slate-300 font-medium">
                  {formatCurrency(computed?.lineTotal || 0)}
                </div>
                <div className="col-span-1 text-sm text-slate-400">
                  {formatCurrency(gstAmt || 0)}
                </div>
                <div className="col-span-1 flex justify-center">
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(idx)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Summary */}
      <div className="bg-slate-800 rounded-xl p-6 ring-1 ring-slate-700">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Summary</h2>
        <div className="max-w-sm ml-auto space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {isInterState ? (
            <div className="flex justify-between text-sm text-slate-300">
              <span>IGST</span>
              <span>{formatCurrency(totalIgst)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm text-slate-300">
                <span>CGST</span>
                <span>{formatCurrency(totalCgst)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>SGST</span>
                <span>{formatCurrency(totalSgst)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-base font-bold text-slate-100 border-t border-slate-700 pt-3">
            <span>Grand Total</span>
            <span className="text-indigo-400">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => navigate('/billing')}>Cancel</Button>
        <Button type="submit" loading={submitting}>Create Invoice</Button>
      </div>
    </form>
  );
};

export default CreateInvoice;
