"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState("");

  useEffect(() => {
    const loadData = async () => {
      // ambil data users
      const res = await fetch("/api/users");
      const users = await res.json();
      setData(users);

      // ambil last sync
      const resSync = await fetch("/api/last-sync");
      const sync = await resSync.json();
      setLastSync(sync?.last_sync || "-");
    };

    loadData();
  }, []);

  // total data
  const total = data.length;

  // hitung kategori terbanyak
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

  return (
    <div>
      <Navbar />

      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white shadow p-4 rounded">
            Total Data: {total}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Kategori Terbanyak: {topCategory}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Last Sync: {lastSync}
          </div>
        </div>
                  <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow p-4 rounded">
              <h2 className="font-bold mb-2">Pie Chart</h2>
              <PieChart data={data} />
            </div>

            <div className="bg-white shadow p-4 rounded">
              <h2 className="font-bold mb-2">Bar Chart</h2>
              <BarChart data={data} />
            </div>
          </div>
      </div>
    </div>
  );
}