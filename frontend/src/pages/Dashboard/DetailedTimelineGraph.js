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

  const emails = useSelector(state => state.quarantinedEmails.emails)

  const [stats, setStats] = useState({
    totalEmails: 0,
    quarantinedEmails: 0,
    suspiciousEmails: 0,
    cleanEmails: 0,
    labels: [],
    dataset: [],
  })

  useEffect(() => {
    let rangedEmails = emails?.filter(e =>
      moment(e.dateTimeSent).isBetween(startDate, endDate)
    )

    let totalEmails = rangedEmails.length
    let quarantinedEmails = rangedEmails.filter(
      e => e.iteratedEmailCondition === QUARANTINED
    ).length
    let suspiciousEmails = rangedEmails.filter(
      e => e.iteratedEmailCondition === SUSPICIOUS
    ).length
    let cleanEmails = rangedEmails.filter(
      e => e.iteratedEmailCondition === CLEAN
    ).length

    let format =
      chartRange === DAILY
        ? "YYYY-MM-DD"
        : chartRange === WEEKLY
        ? "YYYY-MM-DD"
        : chartRange === MONTHLY
        ? "MMM yy"
        : "yyyy"

    let sortFunc =
      chartRange === DAILY
        ? (a, b) => moment(a).format("YYYYMMDD") - moment(b).format("YYYYMMDD")
        : chartRange === WEEKLY
        ? (a, b) => moment(a).format("YYYYMMDD") - moment(b).format("YYYYMMDD")
        : chartRange === MONTHLY
        ? (a, b) => moment(a).format("YYYYMMDD") - moment(b).format("YYYYMMDD")
        : (a, b) => a - b

    let groupedEmails = _.groupBy(rangedEmails, e => {
      return chartRange === WEEKLY
        ? moment(e.dateTimeSent).startOf("week").format(format)
        : moment(e.dateTimeSent).format(format)
    })

    const labels = Object.keys(groupedEmails).sort(sortFunc)

    let dataset = getDataset(labels, groupedEmails)

    setStats({
      totalEmails: totalEmails,
      quarantinedEmails: quarantinedEmails,
      suspiciousEmails: suspiciousEmails,
      cleanEmails: cleanEmails,
      labels: labels,
      dataset: dataset,
    })
  }, [startDate, endDate, chartRange, emails])

  const getDataset = (labels, groupedEmails) => {
    let quarantinedData = []
    let suspiciousData = []
    let cleanData = []

    labels.forEach(x => {
      let allEmails = groupedEmails[x]
      quarantinedData.push(
        allEmails.filter(e => e.iteratedEmailCondition === QUARANTINED).length
      )
      suspiciousData.push(
        allEmails.filter(e => e.iteratedEmailCondition === SUSPICIOUS).length
      )
      cleanData.push(
        allEmails.filter(e => e.iteratedEmailCondition === CLEAN).length
      )
    })

    return [
      {
        label: "Quarantined",
        data: quarantinedData,
        borderColor: [Colors.theme_red],
        backgroundColor: [Colors.theme_red],
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Suspicious",
        data: suspiciousData,
        borderColor: [Colors.theme_orange],
        backgroundColor: [Colors.theme_orange],
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Clean",
        data: cleanData,
        borderColor: [Colors.theme_yellow],
        backgroundColor: [Colors.theme_yellow],
        cubicInterpolationMode: "monotone",
      },
    ]
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
                  onChange={e => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Daily</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  disableRipple
                  value={WEEKLY}
                  checked={chartRange === WEEKLY}
                  size="small"
                  onChange={e => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Weekly</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  value={MONTHLY}
                  checked={chartRange === MONTHLY}
                  disableRipple
                  size="small"
                  onChange={e => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Monthly</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  value={YEARLY}
                  checked={chartRange === YEARLY}
                  disableRipple
                  size="small"
                  onChange={e => setChartRange(e.target.value)}
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
                  afterBody: tooltipItems => {
                    let totalEmails = 0
                    let avgRiskRating = 0
                    for (const tooltipItem of tooltipItems) {
                      totalEmails += tooltipItem.parsed.y
                    }
                    return [
                      `Average risk rating: ${avgRiskRating}`,
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
          isOvertimeGraph
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Quarantined Emails"}
          count={stats.quarantinedEmails}
          startDate={startDate}
          endDate={endDate}
          isOvertimeGraph
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Suspicious Emails"}
          count={stats.suspiciousEmails}
          startDate={startDate}
          endDate={endDate}
          isOvertimeGraph
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Clean Emails"}
          count={stats.cleanEmails}
          startDate={startDate}
          endDate={endDate}
          isOvertimeGraph
        />
      </Grid>
    </Grid>
  )
}

export default DetailedTimelineGraph
