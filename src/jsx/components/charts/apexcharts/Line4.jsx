import React from "react";
import ReactApexChart from "react-apexcharts";

const series= [
    {
      name: "Yoga",
      data: [65, 65, 65, 120, 120, 80, 120, 100, 100, 120, 120, 120],
    },
    {
      name: "Cycling",
      data: [50, 100, 35, 35, 0, 0, 80, 20, 40, 40, 40, 40],
    },
    {
      name: "Running",
      data: [20, 40, 20, 80, 40, 40, 20, 60, 60, 20, 110, 60],
    },
]
const options = {
    chart: {
      height: 300,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: [4, 4, 4],
      colors: ["#007a64", "#1EA7C5", "#FF9432"],
      curve: "straight",
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "text",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    colors: ["#007a64", "#1EA7C5", "#FF9432"],
    markers: {
      size: [8, 8, 6],
      strokeWidth: [0, 0, 4],
      strokeColors: ["#007a64", "#1EA7C5", "#FF9432"],
      border: 0,
      colors: ["#007a64", "#1EA7C5", "#fff"],
      hover: {
        size: 10,
      },
    },
    yaxis: {
      title: {
        text: "",
      },
    },
}

const ApexLine4 = () => {  
    return (
      <div id="chart" className="bar-chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={300}
        />
      </div>
    );
  
}

export default ApexLine4;
