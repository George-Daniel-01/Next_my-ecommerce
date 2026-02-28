"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/app/admin/components/Header";
import { fetchAllUsers, deleteUser } from "@/app/store/slices/adminSlice";

const Users = () => {
  const [page, setPage] = useState(1);
  const { loading, users, totalUsers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const maxPage = Math.ceil(totalUsers / 10) || 1;

  useEffect(() => { dispatch(fetchAllUsers(page)); }, [page, dispatch]);

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      <div className="flex-1 md:p-6">
        <Header />
        <h1 className="text-2xl font-bold">All Users</h1>
        <p className="text-sm text-gray-600 mb-6">Manage your website users.</p>
      </div>
      <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
        {loading ? (
          <div className="w-16 h-16 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : users?.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Avatar</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Registered</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4"><img src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=random&color=fff`}
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=0D8ABC&color=fff`; }} alt="avatar" className="w-10 h-10 rounded-full object-cover" /></td>
                    <td className="px-3 py-4">{user.name}</td>
                    <td className="px-3 py-4">{user.email}</td>
                    <td className="px-3 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-4">
                      <button onClick={() => dispatch(deleteUser(user.id, page))} className="text-white rounded-md px-3 py-2 font-semibold bg-gradient-to-br from-red-400 to-red-600 hover:opacity-90">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <h3>No Users Found!</h3>}
        {!loading && users?.length > 0 && (
          <div className="flex justify-center mt-6 gap-4">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Previous</button>
            <span className="px-4 py-2">Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={maxPage === page} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </main>
  );
};
export default Users;