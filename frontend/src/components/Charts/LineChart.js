import React from "react"
import { Chart as ChartJS } from "chart.js/auto"
import { Line } from "react-chartjs-2"

const LineChart = ({ labels, datasets, xLabel, yLabel, plugins }) => {
  return (
    <Line
      data={{
        labels,
        datasets,
      }}
      options={{
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins,
        scales: {
          x: {
            title: {
              display: xLabel,
              text: xLabel,
            },
          },
          y: {
            title: {
              display: yLabel,
              text: yLabel,
            },
            ticks: {
              beginAtZero: true,
            },
          },
        },
      }}
    />
  )
}

export default LineChart
