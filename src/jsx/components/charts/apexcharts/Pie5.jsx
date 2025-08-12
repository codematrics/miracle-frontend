import React from "react";
import ReactApexChart from "react-apexcharts";

const series = [71, 63, 90]
const options = {
  chart: {
    type: "radialBar",
    //width:320,
    //  height: 350,
    offsetY: 0,
    offsetX: 0,
  },
  plotOptions: {
    radialBar: {
      size: undefined,
      inverseOrder: false,
      hollow: {
        margin: 0,
        size: "30%",
        background: "transparent",
      },

      track: {
        show: true,
        background: "#007a64",
        strokeWidth: "10%",
        opacity: 1,
        margin: 18, // margin is in pixels
      },
    },
  },
  responsive: [
    {
      breakpoint: 830,
      options: {
        chart: {
          offsetY: 0,
          offsetX: 0,
        },
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "20%",
            },
          },
        },
      },
    },
    {
      breakpoint: 800,
      options: {
        chart: {
          offsetY: 0,
          offsetX: 0,
        },
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "10%",
            },
          },
        },
      },
    },
    {
      breakpoint: 768,
      options: {
        chart: {
          offsetY: 0,
          offsetX: 0,
        },
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "30%",
            },
          },
        },
      },
    },
    {
      breakpoint: 330,
      options: {
        chart: {
          offsetY: 0,
          offsetX: 0,
        },
        legend: {
          position: "bottom",
          offsetX: 0,
          offsetY: 0,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: "20%",
            },
          },
        },
      },
    },
  ],

  fill: {
    opacity: 1,
  },

  colors: ["#007a64", "#007a64", "#007a64"],
  labels: ["Ticket A", "Ticket B", "Ticket C"],
  legend: {
    fontSize: "14px",
    show: true,
    position: "bottom",
  },
}

const ApexRedialBar2 = () => {  
   return (
      <div id="chart" className="line-chart-style bar-chart">
        <ReactApexChart
          options={options}
          series={series}
          type="radialBar"
          height={350}
        />
      </div>
  );
  
}
export default ApexRedialBar2;
