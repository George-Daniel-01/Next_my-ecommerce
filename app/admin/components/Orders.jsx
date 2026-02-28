"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/app/admin/components/Header";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "@/app/store/slices/adminOrderSlice";

const Orders = () => {
  const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.adminOrder);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterByStatus, setFilterByStatus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

  const filteredOrders = filterByStatus === "All" ? orders : orders?.filter((o) => o.order_status === filterByStatus);

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      <div className="flex-1 md:p-6">
        <Header />
        <h1 className="text-2xl font-bold">All Orders</h1>
        <p className="text-sm text-gray-600 mb-6">Manage all your orders.</p>
      </div>
      {loading ? (
        <div className="w-16 h-16 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-20" />
      ) : (
        <>
          <div className="px-6 mb-4">
            <select value={filterByStatus} onChange={(e) => setFilterByStatus(e.target.value)} className="border p-2 rounded">
              {statusArray.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {filteredOrders?.length === 0 ? <p className="p-10">No orders found.</p> : filteredOrders?.map((order) => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg p-6 mb-6 mx-6">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Status:</strong> {order.order_status}</p>
                  <p><strong>Placed At:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Total:</strong> ${order.total_price}</p>
                </div>
                <div className="flex gap-2 items-start">
                  <select value={selectedStatus[order.id] || order.order_status}
                    onChange={(e) => { setSelectedStatus({...selectedStatus, [order.id]: e.target.value}); dispatch(updateOrderStatus({ orderId: order.id, status: e.target.value })); }}
                    className="border p-2 rounded">
                    {statusArray.filter(s => s !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setDeleteConfirm({ open: true, id: order.id })} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">Delete</button>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Shipping Info</h4>
                <p>{order.shipping_info?.full_name} | {order.shipping_info?.phone}</p>
                <p>{order.shipping_info?.address}, {order.shipping_info?.city}, {order.shipping_info?.state}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items</h4>
                {Array.isArray(order.order_items) && order.order_items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 mb-2 border-b pb-2">
                    {item.image && <img src={item.image} alt={item.title} className="w-16 h-16 object-cover cursor-pointer" onClick={() => setPreviewImage(item.image)} />}
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p>Qty: {item.quantity} | Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="preview" className="max-w-[90%] max-h-[90%] rounded" />
        </div>
      )}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete this order?</h3>
            <div className="flex justify-center gap-4">
              <button onClick={() => { dispatch(deleteOrder(deleteConfirm.id)); setDeleteConfirm({ open: false, id: null }); }} className="bg-red-600 text-white px-4 py-2 rounded">Yes, Delete</button>
              <button onClick={() => setDeleteConfirm({ open: false, id: null })} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
export default Orders;