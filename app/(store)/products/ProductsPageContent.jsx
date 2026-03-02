"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "@/app/data/products";
import ProductCard from "@/app/components/Products/ProductCard";
import Pagination from "@/app/components/Products/Pagination";
import AISearchModal from "@/app/components/Products/AISearchModal";
import { fetchAllProducts } from "@/app/store/slices/productSlice";

export default function ProductsPageContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { products, loading, totalPages } = useSelector((state) => state.product);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts({ search, category, minPrice, maxPrice, rating, page }));
  }, [search, category, minPrice, maxPrice, rating, page]);

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <h1 className="text-3xl font-bold">All Products</h1>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setShowAIModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition">
              <Sparkles size={16} /> AI Search
            </button>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" />
            <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" />
            <select value={rating} onChange={(e) => { setRating(e.target.value); setPage(1); }} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <option value="">All Ratings</option>
              {[4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}+ <Star size={12} /></option>)}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>
      {showAIModal && <AISearchModal onClose={() => setShowAIModal(false)} />}
    </main>
  );
}