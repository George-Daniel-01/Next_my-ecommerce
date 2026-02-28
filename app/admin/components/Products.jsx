"use client";
import React, { useState, useEffect } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/app/admin/components/Header";
import { fetchAllAdminProducts, deleteProduct } from "@/app/store/slices/adminProductSlice";
import { toggleCreateProductModal, toggleUpdateProductModal, toggleViewProductModal } from "@/app/store/slices/extraSlice";
import CreateProductModal from "@/app/admin/modals/CreateProductModal";
import UpdateProductModal from "@/app/admin/modals/UpdateProductModal";
import ViewProductModal from "@/app/admin/modals/ViewProductModal";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { isViewProductModalOpened, isCreateProductModalOpened, isUpdateProductModalOpened } = useSelector((state) => state.extra);
  const { products, totalProducts, loading } = useSelector((state) => state.adminProduct);
  const maxPage = Math.ceil(totalProducts / 10) || 1;

  useEffect(() => { dispatch(fetchAllAdminProducts(page)); }, [dispatch, page]);

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-gray-600 mb-6">Manage your products.</p>
          <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            {loading ? (
              <div className="w-16 h-16 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : products?.length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Image</th>
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Price</th>
                      <th className="py-3 px-4 text-left">Stock</th>
                      <th className="py-3 px-4 text-left">Ratings</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedProduct(product); dispatch(toggleViewProductModal()); }}>
                        <td className="py-3 px-4"><img src={product?.images?.[0]?.url} alt={product.name} className="w-10 h-10 rounded-md object-cover" /></td>
                        <td className="px-3 py-4">{product.name}</td>
                        <td className="px-3 py-4">{product.category}</td>
                        <td className="px-3 py-4">${Number(product.price).toFixed(2)}</td>
                        <td className="px-3 py-4">{product.stock}</td>
                        <td className="px-3 py-4 text-yellow-500">{product.ratings}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button className="text-white rounded-md px-3 py-2 font-semibold bg-blue-500 hover:bg-blue-600"
                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); dispatch(toggleUpdateProductModal()); }}>Update</button>
                          <button className="text-white rounded-md px-3 py-2 font-semibold bg-red-500 hover:bg-red-600"
                            onClick={(e) => { e.stopPropagation(); dispatch(deleteProduct(product.id, page)); }}>
                            {selectedProduct?.id === product.id && loading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <h3 className="text-2xl p-6 font-bold">No products found.</h3>}
            {!loading && products?.length > 0 && (
              <div className="flex justify-center mt-6 gap-4">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Previous</button>
                <span className="px-4 py-2">Page {page}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={maxPage === page} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        </div>
        <button onClick={() => dispatch(toggleCreateProductModal())} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50" title="Create New Product">
          <Plus size={20} />
        </button>
      </main>
      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && <UpdateProductModal selectedProduct={selectedProduct} />}
      {isViewProductModalOpened && <ViewProductModal selectedProduct={selectedProduct} />}
    </>
  );
};
export default Products;