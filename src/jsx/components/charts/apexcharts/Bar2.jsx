import React from "react";

import ReactApexChart from "react-apexcharts";

const series= [
  {
    name: "Cycling",
    data: [80, 40, 55, 20, 45, 30, 50, 80, 50, 90, 30],
  },
];
const options= {
    chart: {
      type: "bar",
      height: 230,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#007a64"],
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    dataLabels: {
      enabled: false,
      offsetX: -6,
      style: {
        fontSize: "12px",            
      },
    },
    stroke: {
      show: false,
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
    xaxis: {
      show: false,
      categories: [2013, 2014, 2015,2016,2017,2018,2019,2020,2021,2022,2023],
    },
}

const ApexBar2 =()=>{
  return(
      <div id="chart" className="line-chart-style bar-chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={300}
          />
      </div>
  )
}
export default ApexBar2;
