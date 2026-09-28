



import React, { useEffect, useState } from 'react';
import { api } from '../Utils/api';
import type { Contact } from '../Utils/types';
import { Search, Users, Mail, Building2, Plus, X, Pencil, Trash2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export const Contacts = () => {
  const [contacts, setContacts]   = useState<Contact[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [picFilter, setPicFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({
    person_name: '',
    company_name: '',
    designation: '',
    email: '',
    phone: '',
    address: '',
    region: '',
    location: '',
    vertical: '',
  });

  const fetchContacts = async () => {
    const data = await api.getContacts(search, projectFilter, page, picFilter, verificationFilter);
    setContacts(data.results);
    setTotalContacts(data.count);
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchContacts(), 300);
    return () => clearTimeout(timer);
  }, [search, projectFilter, picFilter, verificationFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [search, projectFilter, picFilter, verificationFilter]);

  const getCreatorName = (contact: Contact) => {
    const owner = contact.created_by_info?.name || contact.created_by_name || contact.source_owner_name || '';
    return /\bsync\b/i.test(owner) ? 'Unassigned' : owner || 'Unassigned';
  };

  const picOptions = Array.from(new Set(
    contacts.map(getCreatorName).filter(name => name && name !== 'Unassigned')
  )).sort((a, b) => a.localeCompare(b));
  const visibleContacts = contacts;
  const totalPages = Math.max(1, Math.ceil(totalContacts / 25));

  const resetForm = () => {
    setForm({
      person_name: '',
      company_name: '',
      designation: '',
      email: '',
      phone: '',
      address: '',
      region: '',
      location: '',
      vertical: '',
    });
    setEditingContact(null);
    setError('');
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setForm({
      person_name: contact.person_name || contact.name || '',
      company_name: contact.company_name || '',
      designation: contact.designation || '',
      email: contact.email || '',
      phone: contact.phone || '',
      address: contact.address || '',
      region: contact.region || '',
      location: contact.location || '',
      vertical: contact.vertical || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleSaveContact = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() && !form.phone.trim()) {
      setError('Email or phone is required.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        person_name: form.person_name.trim(),
        company_name: form.company_name.trim(),
        designation: form.designation.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        region: form.region.trim(),
        location: form.location.trim(),
        vertical: form.vertical.trim(),
      };

      if (editingContact) {
        await api.updateContact(editingContact.id, payload);
      } else {
        await api.createContact(payload);
      }

      closeModal();
      await fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = async (contact: Contact) => {
    const label = contact.name || contact.person_name || contact.email || 'this contact';
    if (!window.confirm(`Delete ${label}?`)) return;

    try {
      await api.deleteContact(contact.id);
      await fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact.');
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const getSourceLabel = (source?: string) => ({
    marketing_crm: 'Marketing CRM',
    salespie: 'SalesPie',
  }[source || ''] || 'BDCRM');

  const getSourceBadgeClass = (source?: string) => ({
    marketing_crm: 'bg-violet-50 text-violet-700 border-violet-200',
    salespie: 'bg-sky-50 text-sky-700 border-sky-200',
  }[source || ''] || 'bg-slate-50 text-slate-600 border-slate-200');

  const avatarColors = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
  ];

  const ROW_ACCENTS = [
    'border-l-blue-400',
    'border-l-violet-400',
    'border-l-emerald-400',
    'border-l-amber-400',
    'border-l-rose-400',
    'border-l-cyan-400',
  ];

  const TABLE_HEADERS = [
    { label: 'Contact',    color: 'text-blue-200'   },
    { label: 'Company',    color: 'text-violet-200' },
    { label: 'Designation', color: 'text-emerald-200'},
    { label: 'Phone', color: 'text-amber-200'  },
    { label: 'Region / Location', color: 'text-cyan-200' },
    { label: 'Added',      color: 'text-pink-200'   },
    { label: 'Created By', color: 'text-sky-200' },
    { label: 'Actions',      color: 'text-indigo-100'   },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes floatBlob {
          0%,100% { transform:translateY(0) translateX(0); }
          50%     { transform:translateY(-12px) translateX(6px); }
        }
        .anim-blob   { animation:floatBlob 7s ease-in-out infinite; }
        .f1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
        .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s }
        .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .25s }
        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size:200% 100%;
          animation:shimmer 4s ease-in-out infinite;
        }

        /* table row */
        .trow { transition:background 0.15s ease, transform 0.15s ease; }
        .trow:hover { background:linear-gradient(90deg,#eef2ff,#f5f3ff); transform:translateX(3px); }

        /* search bar focus */
        .search-wrap { transition:all .25s ease; }
        .search-wrap:focus-within {
          transform:translateY(-1px);
          box-shadow:0 0 0 4px rgba(99,102,241,0.14),0 4px 16px rgba(99,102,241,0.1);
          border-radius:14px;
        }

        /* table container */
        .table-card {
          border-radius:18px;
          border:1.5px solid #e2e8f0;
          box-shadow:0 4px 24px rgba(15,23,42,0.07),0 1px 4px rgba(15,23,42,0.04);
          overflow:hidden;
        }
        .table-card:hover {
          box-shadow:0 8px 32px rgba(79,70,229,0.1),0 2px 8px rgba(0,0,0,0.05);
        }
        .table-card { transition:box-shadow .25s ease; }

        /* avatar hover */
        .avatar-wrap { transition:transform .2s ease; }
        .trow:hover .avatar-wrap { transform:scale(1.08); }
      `}</style>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" style={{ animationDelay:'3s' }} />

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden relative f1"
        style={{
          background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
          boxShadow:'0 12px 40px -4px rgba(79,70,229,0.5),0 2px 8px rgba(0,0,0,0.12)',
        }}>
        <div className="shimmer-overlay" />
        <div className="px-7 py-6 flex items-center gap-5 flex-wrap relative z-10"
          style={{ backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
            <Users className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">All Contacts</h1>
            <p className="text-[13px] text-indigo-200 mt-1 font-medium">
              Complete directory of everyone in your pipeline.
            </p>
          </div>
          {totalContacts > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
              style={{ backgroundColor:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)' }}>
              <Users size={14} className="text-indigo-200" />
              <span className="text-[13px] font-black text-indigo-100">
                {totalContacts} contact{totalContacts !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {totalContacts > 0 && (
            <div className="hidden">
              <span>Page {page} of {totalPages} · showing {contacts.length} contacts</span>
              <div className="flex gap-2">
                <button type="button" disabled={page === 1} onClick={() => setPage(value => Math.max(1, value - 1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40"><ChevronLeft size={15} /> Previous</button>
                <button type="button" disabled={page === totalPages} onClick={() => setPage(value => Math.min(totalPages, value + 1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40">Next <ChevronRight size={15} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ BODY ══════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ══ SEARCH + TABLE CARD ══ */}
        <div className="table-card bg-white f2">

          {/* toolbar */}
          <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3"
            style={{ borderBottom:'1.5px solid #eef2ff', background:'linear-gradient(90deg,#ffffff,#fafbff)' }}>

            {/* title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
                <Users size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-slate-800 leading-tight">Contact Directory</h2>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                  {totalContacts} contact{totalContacts !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* search */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              className="px-3 py-2.5 text-[13px] font-bold text-slate-600 bg-slate-50 rounded-xl"
              style={{ border:'1.5px solid #e2e8f0' }}
            >
              <option value="all">All projects</option>
              <option value="marketing_crm">Marketing CRM contacts</option>
              <option value="salespie">SalesPie contacts</option>
            </select>
            <select
              value={picFilter}
              onChange={e => setPicFilter(e.target.value)}
              className="max-w-[180px] px-3 py-2.5 text-[13px] font-bold text-slate-600 bg-slate-50 rounded-xl"
              style={{ border:'1.5px solid #e2e8f0' }}
              aria-label="Filter contacts by PIC"
            >
              <option value="all">All PICs</option>
              {picOptions.map(pic => <option key={pic} value={pic}>{pic}</option>)}
            </select>
            <select
              value={verificationFilter}
              onChange={e => setVerificationFilter(e.target.value)}
              className="px-3 py-2.5 text-[13px] font-bold text-slate-600 bg-slate-50 rounded-xl"
              style={{ border:'1.5px solid #e2e8f0' }}
              aria-label="Filter contacts by verification status"
            >
              <option value="all">All statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-black text-white transition-all hover:translate-y-[-1px]"
              style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 14px rgba(79,70,229,0.28)' }}
            >
              <Plus size={15} />
              Add Contact
            </button>

            <div className="search-wrap">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by name, company, email…"
                  className="pl-10 pr-4 py-2.5 text-[13px] font-medium text-slate-700
                    bg-slate-50 rounded-xl placeholder:text-slate-300
                    focus:bg-white focus:outline-none transition-all duration-200 w-72"
                  style={{ border:'1.5px solid #e2e8f0' }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            </div>
          </div>

          {/* empty state */}
          {visibleContacts.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background:'linear-gradient(145deg,#f8fafc,#f1f5f9)', border:'1.5px dashed #e2e8f0' }}>
                <Users size={28} className="text-slate-300" />
              </div>
              <p className="text-[15px] font-black text-slate-600">No contacts found</p>
              <p className="text-[13px] text-slate-400 font-medium">
                Try adjusting your search or add new leads.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                {/* table header */}
                <thead>
                  <tr style={{ background:'linear-gradient(90deg,#1e1b4b 0%,#312e81 30%,#4f46e5 65%,#7c3aed 100%)' }}>
                    {TABLE_HEADERS.map((h, i) => (
                      <th key={h.label}
                        className={`px-6 py-4 text-[12px] font-black ${h.color} uppercase tracking-widest whitespace-nowrap ${i === 3 ? 'text-right' : ''}`}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleContacts.map((contact, index) => (
                    <tr key={contact.id}
                      className={`trow group border-l-[4px] ${ROW_ACCENTS[index % ROW_ACCENTS.length]} cursor-pointer`}
                      style={{ borderBottom:'1px solid #f1f5f9' }}>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`avatar-wrap w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]}
                            flex items-center justify-center text-white text-[12px] font-black shrink-0`}
                            style={{ boxShadow:`0 4px 12px rgba(79,70,229,0.25)` }}>
                            {getInitials(contact.name || contact.person_name || contact.company_name || 'N')}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14px] font-black text-slate-800 group-hover:text-indigo-700 transition-colors leading-snug">
                              {contact.name || contact.person_name || contact.company_name}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${getSourceBadgeClass(contact.source_project)}`}>
                                From {getSourceLabel(contact.source_project)}
                              </span>
                              {contact.is_verified && (
                                <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-700">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                              <Mail size={11} /> {contact.email || '-'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                          <Building2 size={14} className="text-slate-300 shrink-0" />
                          {contact.company_name || '-'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-[12px] text-slate-600">
                          <p>{contact.designation || '-'}</p>
                          <p><span className="font-bold text-slate-400">Vertical:</span> {contact.vertical || '-'}</p>
                          <p className="max-w-[190px] break-words text-slate-400"><span className="font-bold">Address:</span> {contact.address || '-'}</p>
                        </div>
                      </td>

                      {/* Deal Value */}
                      <td className="px-6 py-4 text-[14px] font-black text-slate-800 text-right">
                        {contact.phone || '-'}
                      </td>

                      {/* Region / Location */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-[13px] text-slate-600 font-medium">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} className="text-slate-300 shrink-0" />
                            {contact.region || '-'}
                          </span>
                          <span className="text-[12px] text-slate-400 pl-5">
                            {contact.location || '-'}
                          </span>
                        </div>
                      </td>

                      {/* Added */}
                      <td className="px-6 py-4 text-[13px] text-slate-400 font-medium">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>

                      {/* Created By */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-semibold text-slate-600">
                            {getCreatorName(contact)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">Created by</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(contact)}
                            className="w-9 h-9 rounded-xl inline-flex items-center justify-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            title="Edit contact"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteContact(contact)}
                            className="w-9 h-9 rounded-xl inline-flex items-center justify-center text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                            title="Delete contact"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalContacts > 0 && (
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-[13px] font-semibold text-slate-600 flex-wrap">
              <span>Page {page} of {totalPages} · showing {contacts.length} contacts</span>
              <div className="flex gap-2">
                <button type="button" disabled={page === 1} onClick={() => setPage(value => Math.max(1, value - 1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15} /> Previous</button>
                <button type="button" disabled={page === totalPages} onClick={() => setPage(value => Math.min(totalPages, value + 1))} className="inline-flex items-center gap-1 rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={15} /></button>
              </div>
            </div>
          )}
        </div>

        <div className="pb-4" />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-[18px] font-black text-slate-800">{editingContact ? 'Edit Contact' : 'Add Contact'}</h3>
                <p className="text-[12px] text-slate-400 font-medium">Saved contacts sync to Marketing CRM.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-6 space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-bold text-rose-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Name" value={form.person_name} onChange={value => updateForm('person_name', value)} />
                <Field label="Company" value={form.company_name} onChange={value => updateForm('company_name', value)} />
                <Field label="Designation" value={form.designation} onChange={value => updateForm('designation', value)} />
                <Field label="Email" value={form.email} onChange={value => updateForm('email', value)} type="email" />
                <Field label="Phone" value={form.phone} onChange={value => updateForm('phone', value)} />
                <Field label="Region" value={form.region} onChange={value => updateForm('region', value)} />
                <Field label="Location" value={form.location} onChange={value => updateForm('location', value)} />
                <Field label="Vertical" value={form.vertical} onChange={value => updateForm('vertical', value)} />
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-black uppercase tracking-wide text-slate-500">Address</span>
                <textarea
                  value={form.address}
                  onChange={event => updateForm('address', event.target.value)}
                  className="min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none focus:border-indigo-300 focus:bg-white"
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl px-5 py-2.5 text-[13px] font-black text-white disabled:opacity-60"
                  style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                >
                  {isSaving ? 'Saving...' : editingContact ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

type FieldProps = {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

const Field = ({ label, value, type = 'text', onChange }: FieldProps) => (
  <label className="block">
    <span className="mb-1.5 block text-[12px] font-black uppercase tracking-wide text-slate-500">{label}</span>
    <input
      type={type}
      value={value}
      onChange={event => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-medium text-slate-700 outline-none focus:border-indigo-300 focus:bg-white"
    />
  </label>
);
