import React from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

const BarChart = ({ labels, datasets, xLabel, yLabel, plugins }) => {
  return (
    <Bar
      data={{
        labels,
        datasets,
      }}
      options={{
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

export default BarChart
