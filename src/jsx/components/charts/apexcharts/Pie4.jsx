import React from "react";
import ReactApexChart from "react-apexcharts";

const series= [42, 47, 52, 58]

const options= {
  chart: {
    // width: 300,
    type: "polarArea",
    sparkline: {
      enabled: true,
    },
  },
  labels: ["VIP", "Reguler", "Exclusive", "Economic"],
  fill: {
    opacity: 1,
    colors: ["#ff5b21", "#00c562", "#ff2735", "#007a64"],
  },
  stroke: {
    width: 0,
    colors: undefined,
  },
  yaxis: {
    show: false,
  },
  legend: {
    position: "bottom",
  },
  plotOptions: {
    polarArea: {
      rings: {
        strokeWidth: 0,
      },
    },
  },
  theme: {
    monochrome: {
      enabled: true,
      shadeTo: "light",
      shadeIntensity: 0.6,
    },
  },
}
const ApexPie4 = () => {
    return (
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="polarArea"
          height={251}          
        />
      </div>
    );
  
}

export default ApexPie4;
