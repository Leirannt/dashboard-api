"use client";

import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: any) {
  const success = data.filter((d: any) => d.category === "success").length;
  const failed = data.filter((d: any) => d.category === "failed").length;

  const chartData = {
    labels: ["success", "failed" ],
    datasets: [
    {
      data: [success, failed],
      backgroundColor: [
        "#005288", //(success)
        "#A7A9AC", //(failed)
      ],
      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
  };

  return <Pie data={chartData} />;
}