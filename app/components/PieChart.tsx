"use client";

import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }: any) {
  const male = data.filter((d: any) => d.category === "male").length;
  const female = data.filter((d: any) => d.category === "female").length;

  const chartData = {
    labels: ["Male", "Female"],
    datasets: [
    {
      data: [male, female],
      backgroundColor: [
        "#3B82F6", //(male)
        "#F472B6", //(female)
      ],
      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
  };

  return <Pie data={chartData} />;
}