import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createProduct } from '../../api/product.api';
import { getCategories } from '../../api/category.api';
import Button from '../../components/common/Button';

const UNITS = ['pcs', 'kg', 'g', 'litre', 'ml', 'box', 'pack', 'dozen'];

const inputCls = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';
const labelCls = 'block text-sm font-medium text-slate-300 mb-1';
const errorCls = 'mt-1 text-xs text-red-400';

const AddProduct = ({ onSuccess, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { lowStockThreshold: 10, unit: 'pcs' },
  });

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createProduct(data);
      toast.success('Product added successfully.');
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Product Name *</label>
          <input {...register('name', { required: 'Name is required' })} placeholder="Product name" className={inputCls} />
          {errors.name && <p className={errorCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>SKU *</label>
          <input {...register('sku', { required: 'SKU is required' })} placeholder="SKU-001" className={inputCls} />
          {errors.sku && <p className={errorCls}>{errors.sku.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category</label>
          <select {...register('category')} className={`${inputCls} appearance-none`}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Unit</label>
          <select {...register('unit')} className={`${inputCls} appearance-none`}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Cost Price *</label>
          <input type="number" step="0.01" {...register('costPrice', { required: 'Required', min: { value: 0, message: '≥ 0' } })} placeholder="0.00" className={inputCls} />
          {errors.costPrice && <p className={errorCls}>{errors.costPrice.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Selling Price *</label>
          <input type="number" step="0.01" {...register('sellingPrice', { required: 'Required', min: { value: 0, message: '≥ 0' } })} placeholder="0.00" className={inputCls} />
          {errors.sellingPrice && <p className={errorCls}>{errors.sellingPrice.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Quantity *</label>
          <input type="number" {...register('quantity', { required: 'Required', min: { value: 0, message: '≥ 0' } })} placeholder="0" className={inputCls} />
          {errors.quantity && <p className={errorCls}>{errors.quantity.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelCls}>Low Stock Threshold</label>
        <input type="number" {...register('lowStockThreshold')} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea {...register('description')} rows={3} placeholder="Optional description..." className={`${inputCls} resize-none`} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>Add Product</Button>
      </div>
    </form>
  );
};

export default AddProduct;
