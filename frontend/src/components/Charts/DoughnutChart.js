import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

const DoughnutChart = ({ labels, datasets, xLabel, yLabel }) => {
  return (
    <Doughnut
      data={{
        labels,
        datasets,
      }}
    />
  )
}

export default DoughnutChart
