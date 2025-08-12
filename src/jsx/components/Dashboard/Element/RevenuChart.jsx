import React from "react";
import ReactApexChart from "react-apexcharts";

class RevenuChart extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         series: [
            {
                name: 'Running',
                data: [50, 18, 70, 40, 90, 70, 20, 55, 25],
            }, 
            {
              name: 'Cycling',
              data: [80, 40, 55, 20, 45, 30, 80, 45, 15]
            }, 
         ],
         options: {
            chart: {
               type: "bar",
               height: 370,
               toolbar: {
                  show: false,
               },
            },
            plotOptions: {
               bar: {
                  horizontal: false,
                  columnWidth: "75%",                  
               },
            },
            colors:['#007A64', '#BDA25C'],
            dataLabels: {
               enabled: false,
            },

            
            markers: {
                shape: "circle",
            },
            legend: {
                show: true,
                fontSize: '12px',
                offsetY:8,
                labels: {
                    colors: '#000000',                      
                },
                markers: {
                    width: 18,
                    height: 18,
                    strokeWidth: 0,
                    strokeColor: '#fff',
                    fillColors: undefined,
                    radius: 0,	
                }
            },
            stroke: {
                show: true,
                width: 4,
                colors: ['transparent']
            },
            grid: {
                borderColor: '#eee',
            },
            xaxis: {                  
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                labels: {
                 style: {
                    colors: '#787878',
                    fontSize: '13px',
                    fontFamily: 'poppins',
                    fontWeight: 100,
                    cssClass: 'apexcharts-xaxis-label',
                  },
                },
                crosshairs: {
                    show: false,
                }
            },
            yaxis: {
                  labels: {
                      offsetX:-16,
                     style: {
                        colors: '#787878',
                        fontSize: '13px',
                         fontFamily: 'poppins',
                        fontWeight: 100,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
            },
         },
      };
   }

   render() {
      return (
        <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={370}
        />
         
      );
   }
}

export default RevenuChart;
