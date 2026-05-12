import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authStore, type UserRole } from '../Utils/auth';

const API_URL = 'http://127.0.0.1:8000/api/auth/create-user/';

export const UserCreationPage: React.FC = () => {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const token = authStore.getToken();
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone_number: '',
    designation: '',
    department: '',
    address: '',
    role: 'employee' as UserRole,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!token) return <Navigate to="/login" replace />;
  if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.username?.[0] || 'Failed to create user.');
      }

      setSuccess(`User "${data.username}" created successfully.`);
      setForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        phone_number: '',
        designation: '',
        department: '',
        address: '',
        role: 'employee',
        is_active: true,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create New User</h1>
        <p className="text-slate-500 mt-1">Admin can create employee or admin accounts.</p>

        {error && <div className="mt-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}
        {success && <div className="mt-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded-lg p-3" placeholder="Username" value={form.username} onChange={(e) => update('username', e.target.value)} required />
          <input className="border rounded-lg p-3" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="First name" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Last name" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Phone number" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Designation" value={form.designation} onChange={(e) => update('designation', e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Department" value={form.department} onChange={(e) => update('department', e.target.value)} />
          <select className="border rounded-lg p-3" value={String(form.is_active)} onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <textarea className="border rounded-lg p-3 md:col-span-2 min-h-24" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} />
          <input className="border rounded-lg p-3 md:col-span-2" type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
          <select className="border rounded-lg p-3 md:col-span-2" value={form.role} onChange={(e) => update('role', e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button disabled={loading} className="md:col-span-2 bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Creating user...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};
