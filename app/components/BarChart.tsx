"use client";

import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement);

export default function BarChart({ data }: any) {
  const countByDate: any = {};

  data.forEach((item: any) => {
    const date = item.created_at.split("T")[0];
    countByDate[date] = (countByDate[date] || 0) + 1;
  });

  const labels = Object.keys(countByDate);
  const values = Object.values(countByDate);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Data",
        data: values,
      },
    ],
  };

  return <Bar data={chartData} />;
}