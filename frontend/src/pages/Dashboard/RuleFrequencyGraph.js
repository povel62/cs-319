import React, { useState } from "react"
import Colors from "../../utils/colors"
import { Div, BarChart } from "../../components"
import GraphStatBox from "./GraphStatBox"
import { useSelector } from "react-redux"
import { Autocomplete, TextField, Grid, Typography } from "@mui/material"

const RuleFrequencyGraph = () => {
  const rules = useSelector(state => state.Rules.rules)
  const ruleTypes = useSelector(state => state.Rules.ruleTypes)
  const [selectedRuleType, setSelectedRuleType] = useState(null)
  const [ruleInputValue, setRuleInputValue] = useState("")

  if (!rules || !ruleTypes) {
    return <></>
  }

  const hashedAllRuleTypesData = toString(hashCode("allRuleTypesData"))
  const ruleTypesData = {
    [hashedAllRuleTypesData]: {
      activeRules: [],
      inactiveRules: [],
      mostTriggeredRule: {
        name: rules[0].ruleType + ": " + rules[0].name ?? "No rules added",
        numberOfMatchesTriggered: rules[0].numberOfMatchesTriggered ?? 0,
      },
      leastTriggeredRule: {
        name: rules[0].ruleType + ": " + rules[0].name ?? "No rules added",
        numberOfMatchesTriggered: rules[0].numberOfMatchesTriggered ?? Infinity,
      },
      totalTimesTriggered: 0,
    },
  }

  for (const ruleType of ruleTypes) {
    ruleTypesData[ruleType.name] = {
      activeRules: [],
      inactiveRules: [],
      leastTriggeredRule: {
        name: "No rules added",
        numberOfMatchesTriggered: Infinity,
      },
      mostTriggeredRule: {
        name: "No rules added",
        numberOfMatchesTriggered: -1,
      },
      totalTimesTriggered: 0,
    }
  }

  for (const rule of rules) {
    ruleTypesData[hashedAllRuleTypesData].totalTimesTriggered +=
      rule.numberOfMatchesTriggered
    ruleTypesData[rule.ruleType].totalTimesTriggered +=
      rule.numberOfMatchesTriggered

    if (!rule.inactive) {
      ruleTypesData[hashedAllRuleTypesData].activeRules.push(rule)
      ruleTypesData[rule.ruleType].activeRules.push(rule)
    } else {
      ruleTypesData[hashedAllRuleTypesData].inactiveRules.push(rule)
      ruleTypesData[rule.ruleType].inactiveRules.push(rule)
    }

    if (
      rule.numberOfMatchesTriggered >
      ruleTypesData[rule.ruleType].mostTriggeredRule.numberOfMatchesTriggered
    ) {
      ruleTypesData[rule.ruleType].mostTriggeredRule.name = rule.name
      ruleTypesData[rule.ruleType].mostTriggeredRule.numberOfMatchesTriggered =
        rule.numberOfMatchesTriggered
    }

    if (
      rule.numberOfMatchesTriggered <
      ruleTypesData[rule.ruleType].leastTriggeredRule.numberOfMatchesTriggered
    ) {
      ruleTypesData[rule.ruleType].leastTriggeredRule.name = rule.name
      ruleTypesData[rule.ruleType].leastTriggeredRule.numberOfMatchesTriggered =
        rule.numberOfMatchesTriggered
    }

    if (
      rule.numberOfMatchesTriggered >
      ruleTypesData[hashedAllRuleTypesData].mostTriggeredRule
        .numberOfMatchesTriggered
    ) {
      ruleTypesData[hashedAllRuleTypesData].mostTriggeredRule.name =
        rule.ruleType + ": " + rule.name
      ruleTypesData[
        hashedAllRuleTypesData
      ].mostTriggeredRule.numberOfMatchesTriggered =
        rule.numberOfMatchesTriggered
    }

    if (
      rule.numberOfMatchesTriggered <
      ruleTypesData[hashedAllRuleTypesData].leastTriggeredRule
        .numberOfMatchesTriggered
    ) {
      ruleTypesData[hashedAllRuleTypesData].leastTriggeredRule.name =
        rule.ruleType + ": " + rule.name
      ruleTypesData[
        hashedAllRuleTypesData
      ].leastTriggeredRule.numberOfMatchesTriggered =
        rule.numberOfMatchesTriggered
    }
  }

  const sortedData = selectedRuleType
    ? ruleTypesData[selectedRuleType].activeRules
        .concat(ruleTypesData[selectedRuleType].inactiveRules)
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
    : Object.entries(ruleTypesData)
        .filter(a => a[0] !== hashedAllRuleTypesData)
        .sort((a, b) => (a[0] > b[0] ? 1 : -1))
  const datasets = [
    {
      data: sortedData.map(ruleType =>
        selectedRuleType
          ? ruleType.numberOfMatchesTriggered
          : ruleType[1].totalTimesTriggered
      ),
      backgroundColor: sortedData.map(ruleType =>
        selectedRuleType
          ? `hsla(${
              intToDecimal(
                hashCode(
                  ruleType.name + ruleType.numberOfMatchesTriggered + 3000
                )
              ) * 360
            }, 40%, 70%, 0.8)`
          : `hsla(${
              intToDecimal(
                hashCode(ruleType[0] + ruleType[1].totalTimesTriggered + 3000)
              ) * 360
            }, 60%, 80%, 0.8)`
      ),
    },
  ]

  return (
    <Grid container>
      <Grid item xs>
        <Div m={24}>
          <Div row justifyContentBetween>
            <Div mb={8}>
              <Typography variant="h6">Rule Type Frequency</Typography>
              <Typography variant="body2" style={{ color: Colors.grey }}>
                {selectedRuleType ?? "All Rule Types"}
              </Typography>
            </Div>
            <Div>
              <Autocomplete
                value={selectedRuleType}
                onChange={(e, value) => setSelectedRuleType(value)}
                inputValue={ruleInputValue}
                onInputChange={(e, value) => setRuleInputValue(value)}
                options={Object.keys(ruleTypesData)
                  .filter(rule => rule !== hashedAllRuleTypesData)
                  .sort()}
                sx={{ width: 344 }}
                renderInput={params => (
                  <TextField {...params} label="Rule Type" />
                )}
                disablePortal
              />
            </Div>
          </Div>
          <Div>
            <BarChart
              labels={sortedData.map(ruleType =>
                selectedRuleType ? ruleType.name : ruleType[0]
              )}
              datasets={datasets}
              xLabel={selectedRuleType ? "Name" : "Type"}
              yLabel={"Number of Times Triggered"}
              plugins={{
                legend: {
                  display: false,
                },
              }}
            />
          </Div>
        </Div>
      </Grid>
      <Grid item xs={4} container direction={"column"}>
        <GraphStatBox
          title={"Total Unique Rules"}
          count={
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .inactiveRules.length +
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .activeRules.length
          }
          caption={`(for ${selectedRuleType ?? "all rule types"})`}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Active Rules"}
          count={
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .activeRules.length
          }
          caption={`(for ${selectedRuleType ?? "all rule types"})`}
        />
        <Div h={0.5} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Inactive Rules"}
          count={
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .inactiveRules.length
          }
          caption={`(for ${selectedRuleType ?? "all rule types"})`}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Total Times Triggered"}
          count={
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .totalTimesTriggered
          }
          caption={`(for ${selectedRuleType ?? "all rule types"})`}
        />
        <Div h={0.5} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Most Triggered Rule"}
          count={
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .mostTriggeredRule.name
          }
          caption={`(triggered ${
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .mostTriggeredRule.numberOfMatchesTriggered
          } times)`}
        />
        <Div h={0.5} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Least Triggered Rule"}
          count={
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .leastTriggeredRule.name
          }
          caption={`(triggered ${
            ruleTypesData[selectedRuleType ?? hashedAllRuleTypesData]
              .leastTriggeredRule.numberOfMatchesTriggered
          } times)`}
        />
      </Grid>
    </Grid>
  )
}

const hashCode = str => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}
const intToDecimal = i => {
  return (i & 0x7fffffff) / Math.pow(2, 31)
}

export default RuleFrequencyGraph
