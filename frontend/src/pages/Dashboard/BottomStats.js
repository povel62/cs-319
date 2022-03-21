import React from "react"
import { useSelector } from "react-redux"
import Div from "../../components/Div"
import { Typography } from "@mui/material"
import Colors from "../../utils/colors"
import moment from "moment-timezone"

// TODO: if rule too long, add dots
const BottomStats = () => {
  const rules = useSelector(state => state.Rules.rules)
  const rulesList = [...(rules ?? [])]
  const sortedTriggeredRules = rulesList
    .sort((a, b) => b.numberOfMatchesTriggered - a.numberOfMatchesTriggered)
    .slice(0, 4)

  return (
    <Div row fill minHeight={320}>
      <StatBox>
        <Div m={24}>
          <Typography variant="h6">Top 4 Triggered Rules</Typography>
          <Typography variant="body2" style={{ color: Colors.grey }}>
            {moment()
              .tz("America/Vancouver")
              .format("[as of] ddd, MMMM Do YYYY, h:mma [PT]")}
          </Typography>
        </Div>
        {sortedTriggeredRules?.length > 0 ? (
          sortedTriggeredRules?.map(rule => {
            return (
              <Div key={rule.id} fill>
                <Div h={1} backgroundColor={Colors.lightGrey} />
                <Div mh={24} fill>
                  <Div fill row center>
                    <Div>
                      <Typography>{`${rule.ruleType}: ${rule.name}`}</Typography>
                    </Div>
                    <Div fill />
                    <Div>
                      <Typography>{rule.numberOfMatchesTriggered}</Typography>
                    </Div>
                  </Div>
                </Div>
              </Div>
            )
          })
        ) : (
          <Div fill>
            <Div h={1} backgroundColor={Colors.lightGrey} />
            <Div mh={24} fill>
              <Div fill row center>
                <Typography>No rules have been triggered</Typography>
              </Div>
            </Div>
          </Div>
        )}
      </StatBox>
      <Div w={24} />
      <StatBox>
        <Div m={24}>
          <Typography variant="h6">TBA</Typography>
        </Div>
      </StatBox>
    </Div>
  )
}

const StatBox = ({ children }) => {
  return (
    <Div
      fill
      backgroundColor="white"
      borderColor={Colors.mediumGrey}
      borderRadius={8}
      borderWidth={0.5}
    >
      {children}
    </Div>
  )
}

export default BottomStats
