import React from "react"
import { useSelector } from "react-redux"
import Div from "../../components/Div"
import { Grid, Typography } from "@mui/material"
import Colors from "../../utils/colors"
import _ from "lodash"

// TODO: avg daily emails, avg risk level
const TopStats = () => {
  const emails = useSelector(state => state.quarantinedEmails.emails)
  const rules = useSelector(state => state.Rules.rules)

  const filteredActiveRules = [...(rules ?? [])].filter(rule => !rule.inactive)

  // const [stats, setStats] = useState({
  //   totalEmails: 0,
  //   totalRulesTriggered: 0,
  //   averageDailyEmails: 0,
  //   averageRiskLevel: 0,
  // })

  // useEffect(() => {
  //   let totalEmails = props.emails.length;
  //   let totalRulesTriggered = 0;
  //   let totalRiskLevel = 0.0;
  //   let averageRiskLevel = 0;
  //   let ruleGrouped = _.mapValues(_.keyBy(props.rules, "name"), "riskLevel");

  //   props.emails.forEach((e) => {
  //     totalRulesTriggered += e.emailRuleMatches.length;
  //     e.emailRuleMatches.forEach((r) => {
  //       totalRiskLevel += ruleGrouped[r.split(": ")[1]];
  //     });
  //   });
  //   averageRiskLevel = totalRiskLevel / totalRulesTriggered;

  //   let dailyEmailGroups = _.groupBy(props.emails, (e) => {
  //     return moment(e.dateTimeSent).startOf("day").format();
  //   });

  //   let averageDailyEmails = totalEmails / Object.keys(dailyEmailGroups).length;

  //   setStats({
  //     totalEmails: totalEmails,
  //     totalRulesTriggered: totalRulesTriggered,
  //     averageRiskLevel: averageRiskLevel,
  //     averageDailyEmails: averageDailyEmails,
  //   });
  // }, [props]);

  return (
    <Div>
      <Div fill>
        <Grid container spacing={2}>
          <StatBox title={"Total Emails"} count={emails.length} />
          <StatBox
            title={"Active Unique Rules Triggered"}
            count={filteredActiveRules.length}
          />
          <StatBox title={"Average Daily Emails"} count={4} />
          <StatBox title={"Average Risk Level"} count={0.63} />
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
