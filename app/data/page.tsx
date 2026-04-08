"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function DataPage() {
  const [data, setData] = useState<any[]>([]);

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

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="text-center">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}