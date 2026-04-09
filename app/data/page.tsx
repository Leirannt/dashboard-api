"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function DataPage() {

  const [data, setData] = useState<any[]>([]);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch("/api/users");
    const result = await res.json();
    setData(result);
  };

  const handleSync = async () => {
    await fetch("/api/sync");
    loadData();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/users/${id}`, {
      method: "DELETE"
    });
    setData(prev =>
      prev.filter(item => item.id !== id)
    );
  };

  const handleSave = async (id: string) => {
    await fetch(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: editName,
        category: editCategory
      })
    });
    setData(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: editName,
              category: editCategory
            }
          : item
      )
    );
    setEditId(null);
  };

  const filteredData = data.filter(item =>
    item.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === "created_at") {
      return sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortField === "id") {
      return sortOrder === "asc"
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    }
    return sortOrder === "asc"
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          Manajemen Data
        </h1>

        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <button
            onClick={handleSync}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Sync Data
          </button>

          <input
            type="text"
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full md:w-64"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <SortableHeader
                  label="ID"
                  field="id"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onClick={handleSort}
                />
                <SortableHeader
                  label="Nama"
                  field="name"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onClick={handleSort}
                />
                <SortableHeader
                  label="Kategori"
                  field="category"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onClick={handleSort}
                />

                <SortableHeader
                  label="Tanggal"
                  field="created_at"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onClick={handleSort}
                />
                <th className="p-3">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map(item => (
                <tr
                  key={item.id}
                  className="border-t text-center"
                >
                  <td className="p-2">
                    {item.id}
                  </td>


                  {/* NAME */}
                  <td className="p-2">
                    {editId === item.id ? (
                      <input
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      item.name
                    )}
                  </td>


                  {/* CATEGORY */}
                  <td className="p-2">
                    {editId === item.id ? (
                      <input
                        value={editCategory}
                        onChange={(e) =>
                          setEditCategory(e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      item.category
                    )}
                  </td>

                  {/* DATE */}
                  <td className="p-2">
                    {item.created_at.split("T")[0]}
                  </td>

                  {/* ACTION */}
                  <td className="p-2 space-x-2">
                    {editId === item.id ? (
                      <button
                        onClick={() => handleSave(item.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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


{/* SORT HEADER */}
function SortableHeader({
  label,
  field,
  sortField,
  sortOrder,
  onClick
}: any) {
  return (
    <th
      onClick={() => onClick(field)}
      className="p-3 cursor-pointer select-none"
    >
      {label}
      {sortField === field && (
        sortOrder === "asc"
          ? " ↑"
          : " ↓"
      )}
    </th>
  );
}