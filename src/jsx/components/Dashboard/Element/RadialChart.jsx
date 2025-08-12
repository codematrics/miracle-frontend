import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

{
  /* Circle Chart Start */
}
class RadialChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [64, 73, 48],
      options: {
        chart: {
          type: "radialBar",
          //width:320,
          height: 330,
        //   offsetY: 0,
        //   offsetX: 0,
        },
        plotOptions: {
            
          radialBar: {
            startAngle: -180,
			endAngle: 180,
            // size: undefined,
            // inverseOrder: false,
            hollow: {
              margin: 0,
              size: "30%",
              background: "transparent",
            },

            track: {
              show: true,
              background: "#e1e5ff",
              strokeWidth: "10%",
              opacity: 1,
              margin: 15, // margin is in pixels
            },
            dataLabels: {
                name: {
                  fontSize: '18px',
                },
                value: {
                  fontSize: '16px',
                },
            }
          },
        },
        colors:['#BDA25C','#209F84','#323232'],
        labels: ['New Patient', 'Recovered', 'In Treatment'],
        // responsive: [
        //   {
        //     breakpoint: 480,
        //     options: {
        //       chart: {
        //         offsetY: 0,
        //         offsetX: 0,
        //       },
        //       legend: {
        //         position: "bottom",
        //         offsetX: 0,
        //         offsetY: 0,
        //       },
        //     },
        //   },
        // ],

        // fill: {
        //   opacity: 1,
        // },

        // colors: ["#ff2c53", "#209f84", "#ff5c00"],
        // series: [71, 63, 90],
        // labels: ["New", "Recover", "In Treatment"],
        // legend: {
        //   fontSize: "16px",
        //   show: false,
        // },
      },
    };
  }

  render() {
    return (
      <>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
          height={330}
        />
      </>
    );
  }
}

export default RadialChart;
