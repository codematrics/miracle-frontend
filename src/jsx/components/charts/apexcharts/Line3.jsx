import React from "react";
import ReactApexChart from "react-apexcharts";

const series= [
    {
      name: "Running",
      data: [20, 40, 20, 80, 40, 40, 20, 60, 60, 20, 110, 60],
    },
]
const options= {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: [4],
      colors: ["#007a64"],
      curve: "straight",
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
    colors: ["#007a64"],
    markers: {
      size: [6],
      strokeWidth: [4],
      strokeColors: ["#007a64"],
      border: 0,
      colors: ["#fff"],
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
const ApexLine3 = () => {
    return (
      <div id="chart" className="bar-chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={300}
        />
      </div>
    );
  
}

export default ApexLine3;
