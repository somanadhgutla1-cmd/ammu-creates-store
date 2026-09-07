'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xrsnfqielfdywwljemik.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyc25mcWllbGZkeXd3bGplbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDg6MDQ0MDA3M30.BglAXrOH4aQ78IBr_OTP5LpJSmXrSU8BLeP_SizoHQ4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { PlusCircle, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminPortal() {
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

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
  const { data: catData } = await supabase.from('categories').select('*');
  
  if (catData && catData.length > 0) {
    setCategories(catData);
  } else {
    // Fallback categories so dropdown populates immediately
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
      fetchData(); // Refresh list
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      fetchData(); // Refresh list
    }
  }

  if (loading) return <div className="p-8 text-center font-sans">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-white border rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-amber-950">Store Manager</h1>
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