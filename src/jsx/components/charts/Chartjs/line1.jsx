import React from "react";
import { Line } from 'react-chartjs-2';

import 'chart.js/auto'


const data = {
  defaultFontFamily: "Poppins",
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "My First dataset",
      data: [25, 20, 50, 41, 55, 45, 70],
      borderColor: "rgba(0,122,100,1)",
      borderWidth: "2",          
      backgroundColor: "rgba(0,122,100, 0)",
      tension:0.4
    },
  ],
};

const options = {
  plugins:{		  
    legend: {
      display:false
    }
  },
  scales: {
    y: 
      {
        min: 0,	
        max: 100,
        ticks: {
          beginAtZero: true,    
          padding: 0,
        },
        // grid:{
        //   color:"rgba(255, 255, 255, 0.1)"
        // }
      },
    
    x: 
      {
        ticks: {
          padding: 0,
        },
        // grid:{
        //   color:"rgba(255, 255, 255, 0.1)"
        // }
      },
    
  },
};

const LineChart1 = (height) =>  {
    return (
      <>
        <Line
          data={data}
          options={options}
          height={height ? height : 150}
        />
      </>
    );
  

}

export default LineChart1;
