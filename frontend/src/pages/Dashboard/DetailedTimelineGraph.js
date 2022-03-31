import GraphStatBox from "./GraphStatBox"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Div from "../../components/Div"
import Colors from "../../utils/colors"
import { Radio, Typography, Grid } from "@mui/material"
import CustomDatePicker from "../../components/CustomDatePicker"
import { LineChart } from "../../components/Charts"
import _ from "lodash"
import moment from "moment"
import { CLEAN, QUARANTINED, SUSPICIOUS } from "../../utils/constants"

const DAILY = "daily"
const WEEKLY = "weekly"
const MONTHLY = "monthly"
const YEARLY = "yearly"

const DetailedTimelineGraph = () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, "d").toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const [chartRange, setChartRange] = useState(DAILY)

  const emails = useSelector((state) => state.quarantinedEmails.emails)
  const [stats, setStats] = useState({
    totalEmails: 0,
    quarantinedEmails: 0,
    suspiciousEmails: 0,
    cleanEmails: 0,
    labels: [],
    dataset: [],
    datasetAvgRiskLevel: {},
  })

  useEffect(() => {
    const rangedEmails = emails?.filter((e) =>
      moment(e.dateTimeSent).isBetween(startDate, endDate)
    )

    const totalEmails = rangedEmails.length
    const quarantinedEmails = rangedEmails.filter(
      (e) => e.iteratedEmailCondition === QUARANTINED
    ).length
    const suspiciousEmails = rangedEmails.filter(
      (e) => e.iteratedEmailCondition === SUSPICIOUS
    ).length
    const cleanEmails = rangedEmails.filter(
      (e) => e.iteratedEmailCondition === CLEAN
    ).length

    const format =
      chartRange === DAILY
        ? "YYYY-MM-DD"
        : chartRange === WEEKLY
        ? "YYYY-MM-DD"
        : chartRange === MONTHLY
        ? "MMM yy"
        : "yyyy"

    const sortFunc =
      chartRange === DAILY
        ? (a, b) => moment(a).format("YYYYMMDD") - moment(b).format("YYYYMMDD")
        : chartRange === WEEKLY
        ? (a, b) => moment(a).format("YYYYMMDD") - moment(b).format("YYYYMMDD")
        : chartRange === MONTHLY
        ? (a, b) => moment(a).format("YYYYMMDD") - moment(b).format("YYYYMMDD")
        : (a, b) => a - b

    const groupedEmails = _.groupBy(rangedEmails, (e) => {
      return chartRange === WEEKLY
        ? moment(e.dateTimeSent).startOf("week").format(format)
        : moment(e.dateTimeSent).format(format)
    })

    const labels = Object.keys(groupedEmails).sort(sortFunc)
    const datasetData = getDataset(labels, groupedEmails)

    setStats({
      totalEmails,
      quarantinedEmails,
      suspiciousEmails,
      cleanEmails,
      labels,
      dataset: datasetData.dataset,
      datasetAvgRiskLevel: datasetData.datasetAvgRiskLevel,
    })
  }, [startDate, endDate, chartRange, emails])

  if (!emails) {
    return <></>
  }

  const formattedCaption = `(${moment(startDate).format(
    "MMM D, YYYY"
  )} - ${moment(endDate).format("MMM D, YYYY")})`

  const getDataset = (labels, groupedEmails) => {
    const quarantinedData = []
    const suspiciousData = []
    const cleanData = []

    const datasetAvgRiskLevel = {}

    labels.forEach((label) => {
      const allLabelEmails = groupedEmails[label]
      quarantinedData.push(
        allLabelEmails.filter((e) => e.iteratedEmailCondition === QUARANTINED)
          .length
      )
      suspiciousData.push(
        allLabelEmails.filter((e) => e.iteratedEmailCondition === SUSPICIOUS)
          .length
      )
      cleanData.push(
        allLabelEmails.filter((e) => e.iteratedEmailCondition === CLEAN).length
      )
      datasetAvgRiskLevel[label] =
        allLabelEmails.reduce((prev, curr) => prev + curr.score, 0) /
        allLabelEmails.length
    })

    return {
      datasetAvgRiskLevel,
      dataset: [
        {
          label: "Clean",
          data: cleanData,
          borderColor: [Colors.theme_green_fill],
          backgroundColor: [Colors.theme_green_fill],
          cubicInterpolationMode: "monotone",
        },
        {
          label: "Suspicious",
          data: suspiciousData,
          borderColor: [Colors.theme_orange_fill],
          backgroundColor: [Colors.theme_orange_fill],
          cubicInterpolationMode: "monotone",
        },
        {
          label: "Quarantined",
          data: quarantinedData,
          borderColor: [Colors.theme_red_fill],
          backgroundColor: [Colors.theme_red_fill],
          cubicInterpolationMode: "monotone",
        },
      ],
    }
  }

  return (
    <Grid container>
      <Grid item xs>
        <Div m={24}>
          <Div row justifyContentBetween>
            <Typography variant="h6">Trends</Typography>
            <Div row>
              <Div row alignItemsCenter>
                <Typography variant="body2">Start:</Typography>
                <Div w={4} />
                <CustomDatePicker date={startDate} setDate={setStartDate} />
              </Div>
              <Div w={8} />
              <Div row alignItemsCenter>
                <Typography variant="body2">End:</Typography>
                <Div w={4} />
                <CustomDatePicker date={endDate} setDate={setEndDate} />
              </Div>
            </Div>
          </Div>
          <Div row justifyContentBetween>
            <Div />
            <Div row alignItemsCenter>
              <Div row alignItemsCenter>
                <Radio
                  disableRipple
                  value={DAILY}
                  checked={chartRange === DAILY}
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Daily</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  disableRipple
                  value={WEEKLY}
                  checked={chartRange === WEEKLY}
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Weekly</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  value={MONTHLY}
                  checked={chartRange === MONTHLY}
                  disableRipple
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Monthly</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  value={YEARLY}
                  checked={chartRange === YEARLY}
                  disableRipple
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Yearly</Typography>
              </Div>
            </Div>
          </Div>
          <LineChart
            labels={stats.labels}
            datasets={stats.dataset}
            xLabel={
              chartRange === DAILY
                ? "Day"
                : chartRange === WEEKLY
                ? "Week"
                : chartRange === MONTHLY
                ? "Month"
                : "Year"
            }
            yLabel={"Number of Emails"}
            dateRange={chartRange}
            plugins={{
              tooltip: {
                callbacks: {
                  afterBody: (tooltipItems) => {
                    let totalEmails = 0
                    let avgRiskRating =
                      stats.datasetAvgRiskLevel[
                        tooltipItems?.[0].label
                      ]?.toFixed(2) ?? 0
                    for (const tooltipItem of tooltipItems) {
                      totalEmails += tooltipItem.parsed.y
                    }
                    return [
                      `Average risk level: ${avgRiskRating}`,
                      `Total emails: ${totalEmails}`,
                    ]
                  },
                },
              },
            }}
          />
        </Div>
      </Grid>
      <Grid item xs={4} container direction={"column"}>
        <GraphStatBox
          title={"Total Emails"}
          count={stats.totalEmails}
          startDate={startDate}
          endDate={endDate}
          caption={formattedCaption}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        
          <GraphStatBox
          title={"Clean Emails"}
          count={stats.cleanEmails}
          startDate={startDate}
          endDate={endDate}
          caption={formattedCaption}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Suspicious Emails"}
          count={stats.suspiciousEmails}
          startDate={startDate}
          endDate={endDate}
          caption={formattedCaption}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Quarantined Emails"}
          count={stats.quarantinedEmails}
          startDate={startDate}
          endDate={endDate}
          caption={formattedCaption}
        />
      </Grid>
    </Grid>
  )
}

export default DetailedTimelineGraph
