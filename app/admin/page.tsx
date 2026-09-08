'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PlusCircle, Trash2, ArrowLeft, Image as ImageIcon, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = 'https://xrsnfqielfdywwljemik.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyc25mcWllbGZkeXd3bGplbWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODYwNDA3NCwiZXhwIjoyMTA0MTgwMDc0fQ.beaFsu8iYC7w0DMitPQ-ez0dgkP5G1IuVut1hT5CoTQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPortal() {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1. Check Active Session on Mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data when Session is Active
  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function fetchData() {
    const { data: catData } = await supabase.from('categories').select('*');

    if (catData && catData.length > 0) {
      setCategories(catData);
    } else {
      setCategories([
        { id: 1, name: 'Bangles' },
        { id: 2, name: 'Earrings' },
        { id: 3, name: 'Hair Pins' },
        { id: 4, name: 'Ear Side Chains' },
        { id: 15, name: 'Jhumkas' },
        { id: 17, name: 'Pins' },
        { id: 18, name: 'Necklaces' },
        { id: 19, name: 'Combos' },
      ]);
    }

    const { data: prodData } = await supabase.from('products').select('*');
    if (prodData) setProducts(prodData);

    setLoading(false);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price || !categoryId) return alert('Please fill in required fields');

    setSubmitting(true);

    const { error } = await supabase.from('products').insert([
      {
        name,
        description,
        price: parseFloat(price),
        image_url: imageUrl || 'https://images.unsplash.com/photo-1611591475140-13617e467b85?w=500',
        category_id: parseInt(categoryId),
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert('Error adding product: ' + error.message);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      fetchData();
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      fetchData();
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-amber-950 font-medium text-sm">
        Verifying authorization...
      </div>
    );
  }

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-amber-900" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-amber-950">Ammu Creates</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Store Manager Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-950 hover:bg-amber-900 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-amber-900 hover:underline">
              ← Return to Main Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center font-sans">Loading Admin Panel...</div>;

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-white border rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-amber-950">Store Manager</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Logged in as <strong className="text-slate-800">{session.user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
              <PlusCircle className="w-5 h-5 text-amber-800" /> Add New Item
            </h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Thread Choker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short details about the material, finish, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-900 hover:bg-amber-800 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
              >
                {submitting ? 'Adding...' : 'Publish Item'}
              </button>
            </form>
          </div>

          {/* Product Inventory Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-slate-900">Current Inventory ({products.length})</h2>

            <div className="space-y-3">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md bg-slate-100"
                    />
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900">{item.name}</h3>
                      <span className="text-xs font-bold text-amber-800">₹{item.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}