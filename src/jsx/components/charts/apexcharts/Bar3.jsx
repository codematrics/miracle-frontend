import React from "react";
import ReactApexChart from "react-apexcharts";

const series= [
  {
    name: "Income",
    data: [420, 550, 450, 220, 650, 830],
  },
  {
    name: "Expenses",
    data: [170, 850, 300, 90, 250, 730],
  },
]
  const options= {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "80%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },

      legend: {
        show: true,
        fontSize: "12px",
        fontWeight: 300,

        labels: {
          colors: "black",
        },
        position: "bottom",
        horizontalAlign: "center",
        markers: {
          width: 19,
          height: 19,
          strokeWidth: 0,
          radius: 19,
          strokeColor: "#fff",
          fillColors: ["#fc8019", "#007a64"],
          offsetX: 0,
          offsetY: 0,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#3e4954",
            fontSize: "14px",
            fontFamily: "Poppins",
            fontWeight: 100,
          },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["06", "07", "08", "09", "10", "11"],
      },
      fill: {
        colors: ["#fc8019", "#007a64"],
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
  }

const ApexBar3 = () =>{
  return (
      <div id="chart" className="line-chart-style bar-chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </div>
  );
  
}

export default ApexBar3;
