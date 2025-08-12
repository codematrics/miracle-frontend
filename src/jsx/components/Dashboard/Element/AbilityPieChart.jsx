import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";


class AbilityPieChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
        
          series: [42, 47, 52, 58],
          options: {
            chart: {
                type: 'polarArea',
                width: 130,
				height: 150,
                sparkline: {
                    enabled: true,
                },
            },
            labels: ['Colestrol', 'Heart Beat', 'Stamina', 'Immunities'],
			fill: {
				opacity: 1,
				colors: ['#5FBF91', '#FF6E5A', '#FFD439', '#5F74BF']
			},
			stroke: {
				width: 0,
				colors: undefined
			},
			colors: ['#5FBF91', '#FF6E5A', '#FFD439', '#5F74BF'],
			yaxis: {
				show: false
			},
			legend: {
				position: 'bottom'
			},
			plotOptions: {
				polarArea: {
					rings: {
						strokeWidth: 0
					}
				}
			},
			theme: {
				monochrome: {
					enabled: true,
					shadeTo: 'light',
					shadeIntensity: 0.6
				}
			}
          },
        
        
        };
    }
  render() {   
    return (      		
		<ReactApexChart options={this.state.options} series={this.state.series} type="polarArea" width={'230'}/>		
    );
  }
}

export default AbilityPieChart;
