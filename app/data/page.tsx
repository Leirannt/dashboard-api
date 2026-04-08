"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function DataPage() {
  const [data, setData] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [search, setSearch] = useState("");

  const filtered = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/users");
      const result = await res.json();
      setData(result);
    };
    loadData();
  }, []);

  const handleSync = async () => {
    await fetch("/api/sync");
    const res = await fetch("/api/users");
    const result = await res.json();
    setData(result);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Manajemen Data</h1>

        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <button
            onClick={handleSync}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Sync Data
          </button>

          <input
            type="text"
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-64"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="text-center border-t">
                  <td className="p-2">{item.id}</td>

                  <td className="p-2">
                    {editId === item.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-1 rounded"
                      />
                    ) : (
                      item.name
                    )}
                  </td>

                  {/* EDIT CATEGORY */}
                  <td className="p-2">
                    {editId === item.id ? (
                      <input
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="border p-1 rounded"
                      />
                    ) : (
                      item.category
                    )}
                  </td>

                  <td className="p-2">
                    {item.created_at.split("T")[0]}
                  </td>

                  {/* ACTION */}
                  <td className="p-2 space-x-2">
                    {editId === item.id ? (
                      <button
                        onClick={async () => {
                          await fetch(`/api/users/${item.id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                              name: editName,
                              category: editCategory,
                            }),
                          });

                          setData(
                            data.map((d) =>
                              d.id === item.id
                                ? {
                                    ...d,
                                    name: editName,
                                    category: editCategory,
                                  }
                                : d
                            )
                          );

                          setEditId(null);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditId(item.id);
                          setEditName(item.name);
                          setEditCategory(item.category);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}