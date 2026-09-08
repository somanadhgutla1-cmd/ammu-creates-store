'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = 'https://xrsnfqielfdywwljemik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyc25mcWllbGZkeXd3bGplbWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODYwNDA3NCwiZXhwIjoyMTA0MTgwMDc0fQ.beaFsu8iYC7w0DMitPQ-ez0dgkP5G1IuVut1hT5CoTQ';

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // New info section details
  const businessDetails = [
    {
      text: '✨ Beautifully handcrafted with colourful stones, pearls and traditional detailing ❤️',
    },
    { text: '✨ Handmade | Custom Made | Made to Order' },
    {
      text: '📩 DM us to order yours or customise it according to your choice!',
    },
    {
      text: '📍 Available in Hyderabad • Nalgonda • Suryapet',
      isLocation: true,
    },
  ];

  useEffect(() => {
  async function fetchData() {
    // 1. Fetch Categories
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData && catData.length > 0) {
      setCategories(catData);
    } else {
      // Fallback categories if database return is empty
      setCategories([
        { id: 1, name: 'Bangles', slug: 'bangles' },
        { id: 2, name: 'Earrings', slug: 'earrings' },
        { id: 3, name: 'Hair Pins', slug: 'hair-pins' },
        { id: 4, name: 'Ear Side Chains', slug: 'ear-side-chains' },
        { id: 15, name: 'Jhumkas', slug: 'jhumkas' },
        { id: 17, name: 'Pins', slug: 'pins' },
        { id: 18, name: 'Necklaces', slug: 'necklaces' },
        { id: 19, name: 'Combos', slug: 'combos' },
      ]);
    }

    // 2. Fetch Products
    const { data: prodData, error } = await supabase.from('products').select('*');
    if (prodData) {
      setProducts(prodData);
      setFilteredProducts(prodData);
    }
    if (error) {
      console.error('Error fetching products:', error);
    }

    setLoading(false);
  }
  fetchData();
}, []);
  // Filter products by search term and selected category
  useEffect(() => {
  let result = products;

  if (selectedCategory !== 'all') {
    const catObj = categories.find(
      (c) => c.slug === selectedCategory || c.name?.toLowerCase() === selectedCategory.toLowerCase()
    );
    if (catObj) {
      // Loose comparison (==) matches string IDs with numeric IDs
      result = result.filter((p) => p.category_id == catObj.id);
    }
  }

  if (searchQuery.trim() !== '') {
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  setFilteredProducts(result);
}, [selectedCategory, searchQuery, products, categories]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
        <div className="flex items-center gap-2 text-amber-800 font-medium">
          <Sparkles className="animate-spin w-5 h-5" /> Loading Collection...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Banner */}
      <div className="bg-amber-900 text-amber-100 text-xs py-2 text-center font-medium tracking-wide px-4">
        ✨ Free Domestic Shipping on Orders Above ₹1,999 | 💳 Google Pay, PhonePe & Paytm Accepted
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* INTEGRATED LOGO IMAGE */}
            <div className="p-1 bg-amber-50 rounded-full border border-amber-200">
              <img
                src="/logo.jpeg"
                alt="Ammu Creates Handmade Jewellery Logo"
                className="w-16 h-16 object-cover rounded-full"
              />
            </div>
            {/* INTEGRATED BRANDING TYPOGRAPHY */}
            <div className="flex flex-col">
              <span
                className="text-3xl font-bold text-amber-950"
                style={{ fontFamily: 'serif', letterSpacing: '-0.5px' }}
              >
                AMMU CREATES<span className="text-amber-800">🤍</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-amber-800 tracking-widest mt-[-2px]">
                Handmade Jewellery
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jhumkas, bangles, pins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            {/* Admin Link */}
            <Link
              href="/admin"
              className="text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md border border-amber-200 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-amber-300 text-xs font-bold uppercase tracking-widest bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/30">
            Handcrafted Luxury
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-4 mb-3">
            Timeless Elegance For Every Moment
          </h2>
          <p className="text-amber-100/80 text-sm max-w-lg mx-auto">
            Explore our artisanal collection of Kundan bangles, bridal ear
            chains, and pearl jhumkas.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* NEW BUSINESS INFORMATION SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="p-3 bg-amber-50 rounded-full border border-amber-100 shrink-0">
            <Sparkles className="w-8 h-8 text-amber-700" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-amber-950 mb-3">
              Make your Varalakshmi Ammavaru even more beautiful this Vratam{' '}
              <span className="text-xl">🌺</span>
            </h3>
            <div className="space-y-1.5">
              {businessDetails.map((detail, index) => (
                <p
                  key={index}
                  className={`text-sm ${
                    detail.isLocation
                      ? 'text-amber-800 font-medium'
                      : 'text-slate-600'
                  }`}
                >
                  {detail.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-12 justify-start md:justify-center no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-900 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-amber-900 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-300 max-w-md mx-auto">
            <p className="text-gray-600 font-medium">
              No matching items found.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try clearing your search query or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/400'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-slate-900 text-lg group-hover:text-amber-800 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <div>
                    <span className="text-xs text-gray-400 block">Price</span>
                    <span className="text-xl font-bold text-amber-950">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/917330789207?text=${encodeURIComponent(
                      `Hi Ammu Creates! I would like to order: *${item.name}* (Price: ₹${item.price})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
                  >
                    Buy on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16 py-8 text-center text-sm text-gray-500">
        <p className="font-medium text-amber-950">
          Ammu Creates Handmade Jewellery
        </p>
        <p className="text-xs text-gray-400 mt-1.5">
          Available in Hyderabad • Nalgonda • Suryapet
        </p>

        {/* Payment Badges */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-semibold text-slate-600">
          <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200">Google Pay</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200">PhonePe</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200">Paytm</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded border border-slate-200">Bank Transfer</span>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          © 2026 Aura Jewels. All rights reserved. Powered by Next.js &
          Supabase.
        </p>
      </footer>
    </div>
  );
}
