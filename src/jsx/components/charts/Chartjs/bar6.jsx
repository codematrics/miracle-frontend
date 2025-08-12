import React from "react";
import { Bar } from "react-chartjs-2";

const data = {
  defaultFontFamily: "Poppins",
  labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Black",
      backgroundColor: "rgba(0,122,100, 1)",
      hoverBackgroundColor: "rgba(0,122,100, 1)",
      data: ["12", "12", "12", "12", "12", "12", "12"],
      barPercentage: 0.5,
    },
    {
      label: "Glacier",
      backgroundColor: "rgba(25,33,250, 1)",
      hoverBackgroundColor: "rgba(25,33,250, 1)",
      data: ["12", "12", "12", "12", "12", "12", "12"],
      barPercentage: 0.5,
    },
    {
      label: "Red",
      backgroundColor: "rgba(250,56,64, 1)",
      hoverBackgroundColor: "rgba(250,56,64, 1)",
      data: ["12", "12", "12", "12", "12", "12", "12"],
      barPercentage: 0.5,
    },
  ],
};
const options = {
  plugins:{
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltips: {
     mode: "index",
      intersect: false,
    },
    responsive: true,
 },
  scales: {
    x:
      {
        stacked: true,
        // grid:{
        //   color:"rgba(255, 255, 255, 0.1)"
        // }
      },
    y:
      {
        stacked: true,
        // grid:{
        //   color:"rgba(255, 255, 255, 0.1)"
        // }
      },
  },
};

const BarChart6 = () => {
  return (
      <>
        <Bar data={data} height={150} options={options} />
      </>
    );  
}

export default BarChart6;
