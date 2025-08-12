import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

{
  /* Recovered Chart Start */
}
class RecoveredChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          name: "New",
          data: [20, 40, 60, 35, 50, 70, 30],
        },
        {
          name: "Recovered",
          data: [-28, -32, -12, -24, -35, -18, -30],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 300,
          stacked: true,
          toolbar: {
            show: false,
          },
          sparkline: {
            //enabled: true
          },
          offsetX: 0,
        },
        plotOptions: {
          bar: {
            columnWidth: "30%",
            // endingShape: "rounded",
            colors: {
              backgroundBarColors: ['#F0F0F0', '#F0F0F0', '#F0F0F0', '#F0F0F0', '#F0F0F0', '#F0F0F0', '#F0F0F0'],
              backgroundBarOpacity: 1,
              // backgroundBarRadius: 5,
              opacity:0
            },
          },
          distributed: true,
        },
        colors:['#BDA25C', '#209F84'],
        grid: {
          show: false,
        },
        legend: {
          show: false,
        },
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: false,
          colors:['#BDA25C', '#209F84'],
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            opacity: 1,
          },
        },
        xaxis: {
          categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          labels: {
            style: {
              colors: "#787878",
              fontSize: "13px",
              fontFamily: "poppins",
              fontWeight: 400,
              // cssClass: "apexcharts-xaxis-label",
            },
          },
          crosshairs: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },

        yaxis: {
          show: false,
        },

        tooltip: {
          x: {
            show: true,
          },
        },
      },
    };
  }
  render() {
    return (
      <>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={300}
        />
      </>
    );
  }
}

export default RecoveredChart;
