import React from "react";
import ReactApexChart from "react-apexcharts";

const  series = [81]
const options = {
  chart: {
    height: 300,
    type: "radialBar",
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: "16px",
          color: undefined,
          offsetY: 120,
        },
        value: {
          offsetY: 0,
          fontSize: "34px",
          color: "#007a64",
          formatter: function (val) {
            return val + "%";
          },
        },
      },
    },
  },
  fill: {
    type: "gradient",
    colors: "#007a64",
    gradient: {
      shade: "dark",
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: {
    dashArray: 4,
    colors: "#007a64",
  },
  labels: [""],
}

const ApexRedialBar = () => {  
    return (
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="radialBar"
          height={350}
        />
      </div>
    );
  
}
export default ApexRedialBar;
