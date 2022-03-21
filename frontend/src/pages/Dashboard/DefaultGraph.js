import React, { useState, useEffect } from "react";
import Div from "../../components/Div";
import { Grid, Typography } from "@mui/material";
import Colors from "../../utils/colors";
import { mockData1 } from "../../MockData";
import { BarChart } from "../../components/Charts";
import StatBox from "./StatBox";
import _ from "lodash";
import moment from "moment";

const DefaultGraph = (props) => {
  const [stats, setStats] = useState({
    totalEmails: 0,
    quarantinedEmails: 0,
    suspiciousEMails: 0,
    cleanEmails: 0,
    dataset: [],
  });

  useEffect(() => {
    let totalEmails = props.emails.length;
    let quarantinedEmails = props.emails.filter(
      (e) => e.iteratedEmailCondition === "SPAM"
    ).length;
    let suspiciousEMails = props.emails.filter(
      (e) => e.iteratedEmailCondition === "SUSPICIOUS"
    ).length;
    let cleanEmails = props.emails.filter(
      (e) => e.iteratedEmailCondition === "OK"
    ).length;

    setStats({
      totalEmails: totalEmails,
      quarantinedEmails: quarantinedEmails,
      suspiciousEMails: suspiciousEMails,
      cleanEmails: cleanEmails,
      dataset: [
        {
          label: "Email Health Trend",
          data: [quarantinedEmails, suspiciousEMails, cleanEmails],
          backgroundColor: [
            Colors.theme_red,
            Colors.theme_orange,
            Colors.theme_yellow,
          ],
        },
      ],
    });
  }, [props]);

  return (
    <Grid container>
      <Grid item xs>
        <Div m={24}>
          <Div>
            <Typography variant="h6">Trends</Typography>
            <Typography variant="body2" style={{ color: Colors.grey }}>
              {moment()
                .tz("America/Vancouver")
                .format("[as of] ddd, MMMM Do YYYY, h:mma [PT]")}
            </Typography>
          </Div>
          <BarChart
            labels={["Quarantined", "Suspicious", "Clean"]}
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

export default DefaultGraph;
