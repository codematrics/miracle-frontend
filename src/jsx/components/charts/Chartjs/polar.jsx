import React from "react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea  } from "react-chartjs-2";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const data = {
   defaultFontFamily: "Poppins",
   datasets: [
      {
         data: [15, 18, 9, 6, 19],
         borderWidth: 0,
         backgroundColor: [
            "rgba(258, 128, 25,1)",
            "rgba(44, 44, 44, 1)",
            "rgba(255, 106, 89,1)",
            "rgba(54, 147, 255, 1)",
            "rgba(0,122,100, 1)",
         ],
          
      },
   ],
};

const options = {
	type: 'polarArea',
   plugins:{   
	   responsive: true,      
   },
   scales: {
      display: false,
      r: {
         ticks: {
            display: false
         },
         grid : {
            display: false,
         },        
      },
         
   },   

   maintainAspectRatio: false,
};
const PolarChart = () => {   
   return <PolarArea  data={data} options={options} height={150} />;
}

export default PolarChart;
