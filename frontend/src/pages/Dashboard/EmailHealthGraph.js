import React from "react"
import Div from "../../components/Div"
import { Grid, Typography } from "@mui/material"
import moment from "moment-timezone"
import Colors from "../../utils/colors"
import { BarChart } from "../../components/Charts"
import GraphStatBox from "./GraphStatBox"
import { useSelector } from "react-redux"
import { CLEAN, QUARANTINED, SUSPICIOUS } from "../../utils/constants"

const EmailHealthGraph = () => {
  const emails = useSelector(state => state.quarantinedEmails.emails)

  if (!emails) {
    return <></>
  }

  const cleanEmails = emails.filter(email => email.emailCondition === CLEAN)
  const suspiciousEmails = emails.filter(
    email => email.emailCondition === SUSPICIOUS
  )
  const quarantinedEmails = emails.filter(
    email => email.emailCondition === QUARANTINED
  )

  const datasets = [
    {
      label: "Number of Emails",
      data: [
        quarantinedEmails.length,
        suspiciousEmails.length,
        cleanEmails.length,
      ],
      backgroundColor: [
        Colors.theme_red,
        Colors.theme_orange,
        Colors.theme_yellow,
      ],
    },
  ]
  const labels = ["Quarantined", "Suspicious", "Clean"]

  return (
    <Grid container>
      <Grid item xs>
        <Div m={24}>
          <Div mb={8}>
            <Typography variant="h6">Today's View</Typography>
            <Typography variant="body2" style={{ color: Colors.grey }}>
              {moment()
                .tz("America/Vancouver")
                .format("[as of] ddd, MMMM Do YYYY, h:mma [PT]")}
            </Typography>
          </Div>
          <BarChart
            labels={labels}
            datasets={datasets}
            plugins={{
              legend: {
                display: false,
              },
            }}
            yLabel={"Number of Emails"}
          />
        </Div>
      </Grid>
      <Grid item xs={4} container direction={"column"}>
        <GraphStatBox title={"Total Emails"} count={emails.length} />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Quarantined Emails"}
          count={quarantinedEmails.length}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Suspicious Emails"}
          count={suspiciousEmails.length}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox title={"Clean Emails"} count={cleanEmails.length} />
      </Grid>
    </Grid>
  )
}

export default EmailHealthGraph
