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
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Manajemen Data</h1>
        <button
          onClick={handleSync}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Sync Data
        </button>

        <input
          type="text"
          placeholder="Cari nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-4"
        />

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="text-center">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  {editId === item.id ? (
                    <input
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="border"
                    />
                  ) : (
                    item.category
                  )}
                </td>
                <td>{item.created_at.split("T")[0]}</td>

                <td>
                  <td>
                    {editId === item.id ? (

                      // Save
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
                                ? { ...d, name: editName, category: editCategory }
                                : d
                            )
                          );

                          setEditId(null);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                    ) : (

                      // Edit
                      <button
                        onClick={() => {
                          setEditId(item.id);
                          setEditName(item.name);
                          setEditCategory(item.category);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      // Delete
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}