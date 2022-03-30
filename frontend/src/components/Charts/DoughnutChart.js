import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"

const DoughnutChart = ({ labels, datasets, plugins }) => {
  return (
    <Doughnut
      data={{
        labels,
        datasets,
      }}
      options={{
        plugins,
      }}
    />
  )
}

export default DoughnutChart
