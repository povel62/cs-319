import React from "react"
import { useSelector } from "react-redux"
import Div from "../../components/Div"
import { Grid, Typography } from "@mui/material"
import Colors from "../../utils/colors"
import _ from "lodash"
import moment from "moment"

const TopStats = () => {
  const emails = useSelector(state => state.quarantinedEmails.emails)
  const rules = useSelector(state => state.Rules.rules)

  if (!emails || !rules) {
    return <></>
  }

  const filteredActiveRules = [...(rules ?? [])].filter(rule => !rule.inactive)
  let totalRiskLevel = 0
  let totalRulesTriggered = 0
  rules?.forEach(rule => {
    totalRiskLevel += rule.riskLevel * rule.numberOfMatchesTriggered
    totalRulesTriggered += rule.numberOfMatchesTriggered
  })
  const avgRiskLevel = totalRiskLevel / (totalRulesTriggered ?? 1)

  const dailyEmailGroups = _.groupBy(emails, email => {
    return moment(email.dateTimeSent).startOf("day").format()
  })
  const avgDailyEmails =
    emails?.length / (Object.keys(dailyEmailGroups).length ?? 1)

  return (
    <Div>
      <Div fill>
        <Grid container spacing={2}>
          <StatBox title={"Total Emails"} count={emails.length} />
          <StatBox
            title={"Active Unique Rules Triggered"}
            count={filteredActiveRules.length}
          />
          <StatBox
            title={"Average Daily Emails"}
            count={avgDailyEmails.toFixed(0)}
          />
          <StatBox
            title={"Average Risk Level"}
            count={avgRiskLevel.toFixed(2)}
          />
        </Grid>
      </Div>
    </Div>
  )
}

const StatBox = ({ title, count }) => {
  return (
    <Grid item xs>
      <Div
        h={100}
        center
        backgroundColor="white"
        borderColor={Colors.mediumGrey}
        borderRadius={8}
        borderWidth={0.5}
      >
        <Typography style={{ color: Colors.grey }}>{title}</Typography>
        <Typography variant="h5">{count}</Typography>
      </Div>
    </Grid>
  )
}

export default TopStats
