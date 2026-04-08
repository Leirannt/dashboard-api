"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/users");
      const users = await res.json();
      setData(users);

      const resSync = await fetch("/api/last-sync");
      const sync = await resSync.json();
      setLastSync(sync?.last_sync || "-");
    };

    loadData();
  }, []);

  const total = data.length;

  const countCategory: any = {};
  data.forEach((item) => {
    countCategory[item.category] =
      (countCategory[item.category] || 0) + 1;
  });

  const topCategory =
    Object.keys(countCategory).length > 0
      ? Object.keys(countCategory).reduce((a, b) =>
          countCategory[a] > countCategory[b] ? a : b
        )
      : "-";

  const filteredData = data.filter((item) => {
    if (!startDate || !endDate) return true;
    const date = item.created_at.split("T")[0];
    return date >= startDate && date <= endDate;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* 🔹 SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500 text-sm">Total Data</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500 text-sm">Kategori Terbanyak</p>
            <h2 className="text-2xl font-bold capitalize">
              {topCategory}
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500 text-sm">Last Sync</p>
            <h2 className="text-sm font-medium">
              {lastSync}
            </h2>
          </div>
        </div>

        {/* 🔹 FILTER */}
        <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Start Date</label>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500">End Date</label>
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* 🔹 CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="font-semibold mb-4">Distribusi Kategori</h2>
            <PieChart data={filteredData} />
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="font-semibold mb-4">Distribusi Tanggal</h2>
            <BarChart data={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
}