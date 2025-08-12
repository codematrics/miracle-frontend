import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

{
  /** Patients Status Chart Start */
}
class VisitorsChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62]
        },
      ],
      options: {
        chart: {
            height: 250,
            toolbar: {
                show: false,
            },          
            type: "line",
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
          width: 4,
          curve: "smooth",
        //   colors: ["#23a287"],
        },

        // legend: {
        //   show: false,
        // },
        // tooltip: {
        //   enabled: true,
        // },

        // grid: {
        //   show: false,
        // },

        title: {
			show:false,
            align: 'left'
        },
        grid: {
			show:false,
        },
		colors:['#007A64'],
		yaxis: {
			show:false,
		},
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        }
      },
    };
  }
  render() {
    return (
      <>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={250}
        />
      </>
    );
  }
}

export default VisitorsChart;
