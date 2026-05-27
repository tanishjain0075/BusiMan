import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../../api/auth.api';
import Button from '../../components/common/Button';
import { useState } from 'react';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'inventory_manager', label: 'Inventory Manager' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'sales', label: 'Sales' },
  { value: 'viewer', label: 'Viewer' },
];

const Register = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'viewer' } });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const errorMsg = backendErrors && Array.isArray(backendErrors)
        ? backendErrors.join('. ')
        : err.response?.data?.message || 'Registration failed.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';
  const labelCls = 'block text-sm font-medium text-slate-300 mb-1.5';
  const errorCls = 'mt-1 text-xs text-red-400';

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 mb-4 shadow-lg shadow-orange-900/40">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Get started with BusiMan</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="John Doe"
                className={inputCls}
              />
              {errors.name && <p className={errorCls}>{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
                placeholder="you@company.com"
                className={inputCls}
              />
              {errors.email && <p className={errorCls}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required', 
                  validate: {
                    minLength: (v) => v.length >= 8 || 'Password must be at least 8 characters long',
                    hasUppercase: (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                    hasNumber: (v) => /\d/.test(v) || 'Password must contain at least one number'
                  }
                })}
                placeholder="••••••••"
                className={inputCls}
              />
              {errors.password && <p className={errorCls}>{errors.password.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Role</label>
              <select
                {...register('role')}
                className={`${inputCls} appearance-none`}
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <Button type="submit" loading={submitting} className="w-full py-3 text-base">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
