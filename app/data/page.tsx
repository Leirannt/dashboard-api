"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function DataPage() {
  const [data, setData] = useState<any[]>([]);

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
                <td>{item.category}</td>
                <td>{item.created_at.split("T")[0]}</td>

                <td>
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
  );
}