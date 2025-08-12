import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";


class PatientPieChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
        
          series: [40, 15,25,30],
          options: {
            chart: {
              type: 'donut',
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
               width: 0,
            },
            colors:['#5FBF91', '#FF6E5A', '#FFD439', '#5F74BF'],
            legend: {
                position: 'bottom',
                show:false
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom',
                        show:false
                    }
                }
            }]
          },
        
        
        };
    }
  render() {   
    return (      
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" />
    );
  }
}

export default PatientPieChart;
