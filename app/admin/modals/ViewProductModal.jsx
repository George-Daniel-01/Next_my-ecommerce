"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { toggleViewProductModal } from "@/app/store/slices/extraSlice";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  if (!selectedProduct) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        <button onClick={() => dispatch(toggleViewProductModal())} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-3">
            {selectedProduct.images?.map((img, idx) => <img key={idx} src={img?.url} alt={`Product ${idx}`} className="w-full h-full object-cover rounded" />)}
          </div>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedProduct.id}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Price:</strong> ${selectedProduct.price}</p>
            <p><strong>Ratings:</strong> ⭐ {selectedProduct.ratings}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : "Out of Stock"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewProductModal;