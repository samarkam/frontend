import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

export default function AdminChart({ courses }) {
  const [currChart, setCurrChart] = useState("chapters");

  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };

  const chartDataChapters = {
    labels: courses.map((course) => course.titre),
    datasets: [
      {
        data: courses.map((course) => course.chapitres?.length || 0),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e5e5", // Match richblack-50
        },
      },
    },
  };

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-lg bg-richblack-800 p-6 shadow-md">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrChart("chapters")}
          className={`rounded-sm px-3 py-1 transition-all duration-200 ${
            currChart === "chapters" ? "bg-richblack-700 text-yellow-50" : "text-yellow-400"
          }`}
        >
          Chapters
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-full w-full max-h-[300px]">
        <Pie data={chartDataChapters} options={options} />
      </div>
    </div>
  );
}