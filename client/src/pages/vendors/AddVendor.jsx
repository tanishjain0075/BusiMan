import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createVendor, updateVendor } from '../../api/vendor.api';
import Button from '../../components/common/Button';
import { useState } from 'react';

const inputCls = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';
const labelCls = 'block text-sm font-medium text-slate-300 mb-1';
const errorCls = 'mt-1 text-xs text-red-400';

const PAYMENT_TERMS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Immediate', 'On Delivery'];

const AddVendor = ({ existing, onSuccess, onCancel }) => {
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!existing;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: existing
      ? {
          name: existing.name,
          email: existing.email,
          phone: existing.phone,
          gstin: existing.gstin,
          businessName: existing.businessName,
          paymentTerms: existing.paymentTerms,
          'address.line1': existing.address?.line1,
          'address.city': existing.address?.city,
          'address.state': existing.address?.state,
          'address.pincode': existing.address?.pincode,
        }
      : {},
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      address: {
        line1: data['address.line1'],
        city: data['address.city'],
        state: data['address.state'],
        pincode: data['address.pincode'],
      },
    };
    ['address.line1', 'address.city', 'address.state', 'address.pincode'].forEach((k) => delete payload[k]);

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateVendor(existing._id, payload);
        toast.success('Vendor updated.');
      } else {
        await createVendor(payload);
        toast.success('Vendor added.');
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input {...register('name', { required: 'Required' })} placeholder="Vendor name" className={inputCls} />
          {errors.name && <p className={errorCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" {...register('email')} placeholder="vendor@example.com" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Phone *</label>
          <input {...register('phone', { required: 'Required' })} placeholder="+91 9000000000" className={inputCls} />
          {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelCls}>GSTIN</label>
          <input {...register('gstin')} placeholder="22AAAAA0000A1Z5" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Business Name</label>
          <input {...register('businessName')} placeholder="Company Pvt. Ltd." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Payment Terms</label>
          <select {...register('paymentTerms')} className={`${inputCls} appearance-none`}>
            <option value="">Select terms</option>
            {PAYMENT_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Address</p>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Line 1</label>
            <input {...register('address.line1')} placeholder="Street address" className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input {...register('address.city')} placeholder="Delhi" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input {...register('address.state')} placeholder="Delhi" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Pincode</label>
              <input {...register('address.pincode')} placeholder="110001" className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>{isEdit ? 'Save Changes' : 'Add Vendor'}</Button>
      </div>
    </form>
  );
};

export default AddVendor;
