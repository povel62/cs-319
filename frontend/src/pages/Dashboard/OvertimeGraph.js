import React, { useState, useEffect } from "react";
import Div from "../../components/Div";
import Colors from "../../utils/colors";
import { Radio, Typography, Grid } from "@mui/material";
import StatBox from "./StatBox";
import CustomDatePicker from "../../components/CustomDatePicker";
import { LineChart } from "../../components/Charts";
import _ from "lodash";
import moment from "moment";

const OvertimeGraph = (props) => {
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "d").toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [chartRange, setChartRange] = useState("Daily");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [stats, setStats] = useState({
    totalEmails: 0,
    quarantinedEmails: 0,
    suspiciousEMails: 0,
    cleanEmails: 0,
    labels: [],
    dataset: [],
  });

  useEffect(() => {
    let rangedEmails = props.emails.filter((e) =>
      moment(e.dateTimeSent).isBetween(startDate, endDate)
    );

    let totalEmails = rangedEmails.length;
    let quarantinedEmails = rangedEmails.filter(
      (e) => e.iteratedEmailCondition === "SPAM"
    ).length;
    let suspiciousEMails = rangedEmails.filter(
      (e) => e.iteratedEmailCondition === "SUSPICIOUS"
    ).length;
    let cleanEmails = rangedEmails.filter(
      (e) => e.iteratedEmailCondition === "OK"
    ).length;

    let format =
      chartRange === "Daily"
        ? "YYYY-MM-DD"
        : chartRange === "Weekly"
        ? "ddd"
        : chartRange === "Monthly"
        ? "MMM"
        : "yyyy";

    let sortFunc =
      chartRange === "Daily"
        ? (a, b) => moment(a).format("YYYYMMDD") - moment(b).format("YYYYMMDD")
        : chartRange === "Weekly"
        ? (a, b) => days.indexOf(a) - days.indexOf(b)
        : chartRange === "Monthly"
        ? (a, b) => months.indexOf(a) - months.indexOf(b)
        : (a, b) => a - b;

    let groupedEmails = _.groupBy(rangedEmails, (e) => {
      return moment(e.dateTimeSent).format(format);
    });

    const labels = Object.keys(groupedEmails).sort(sortFunc);

    let dataset = getDataset(labels, groupedEmails);

    setStats({
      totalEmails: totalEmails,
      quarantinedEmails: quarantinedEmails,
      suspiciousEMails: suspiciousEMails,
      cleanEmails: cleanEmails,
      labels: labels,
      dataset: dataset,
    });
  }, [props, startDate, endDate, chartRange]);

  const getDataset = (labels, groupedEmails) => {
    let quarantinedData = [];
    let suspiciousData = [];
    let cleanData = [];

    labels.forEach((x) => {
      let allEmails = groupedEmails[x];
      quarantinedData.push(
        allEmails.filter((e) => e.iteratedEmailCondition === "SPAM").length
      );
      suspiciousData.push(
        allEmails.filter((e) => e.iteratedEmailCondition === "SUSPICIOUS")
          .length
      );
      cleanData.push(
        allEmails.filter((e) => e.iteratedEmailCondition === "OK").length
      );
    });

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
    ];
  };

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
                  value="Daily"
                  checked={chartRange === "Daily"}
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Daily</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  disableRipple
                  value="Weekly"
                  checked={chartRange === "Weekly"}
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Weekly</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  value="Monthly"
                  checked={chartRange === "Monthly"}
                  disableRipple
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Monthly</Typography>
              </Div>
              <Div row alignItemsCenter>
                <Radio
                  value="Yearly"
                  checked={chartRange === "Yearly"}
                  disableRipple
                  size="small"
                  onChange={(e) => setChartRange(e.target.value)}
                />
                <Typography variant="body2">Yearly</Typography>
              </Div>
            </Div>
          </Div>
          <LineChart
            label={chartRange}
            labels={stats.labels}
            datasets={stats.dataset}
          />
        </Div>
      </Grid>
      <Grid item xs={4} container direction={"column"}>
        <StatBox title={"Total Emails"} count={stats.totalEmails} />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <StatBox title={"Quarantined Emails"} count={stats.quarantinedEmails} />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <StatBox title={"Suspicious Emails"} count={stats.suspiciousEMails} />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <StatBox title={"Clean Emails"} count={stats.cleanEmails} />
      </Grid>
    </Grid>
  );
};

export default OvertimeGraph;
