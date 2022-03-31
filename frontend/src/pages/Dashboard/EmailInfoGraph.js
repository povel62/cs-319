import React, { useState } from "react"
import { Grid, Typography } from "@mui/material"
import Colors from "../../utils/colors"
import { DoughnutChart, Div } from "../../components"
import GraphStatBox from "./GraphStatBox"
import { useSelector } from "react-redux"
import { CLEAN, SUSPICIOUS } from "../../utils/constants"
import { Autocomplete, TextField } from "@mui/material"

const labels = ["Quarantined", "Suspicious", "Clean"]

const EmailInfoGraph = () => {
  const emails = useSelector((state) => state.quarantinedEmails.emails)
  const groupedEmails = {}

  for (const email of emails) {
    const toEmails = email.toAddress.split(",")
    for (const _email of toEmails) {
      const parsedEmail = _email.trim()
      if (!(parsedEmail in groupedEmails)) {
        groupedEmails[parsedEmail] = {
          emails: [],
          avgRiskLevel: 0,
          quarantinedEmails: 0,
          suspiciousEmails: 0,
          cleanEmails: 0,
        }
      }

      groupedEmails[parsedEmail].emails.push(email)
      groupedEmails[parsedEmail].avgRiskLevel += email.score

      if (email.emailCondition === CLEAN) {
        groupedEmails[parsedEmail].cleanEmails += 1
      } else if (email.emailCondition === SUSPICIOUS) {
        groupedEmails[parsedEmail].suspiciousEmails += 1
      } else {
        groupedEmails[parsedEmail].quarantinedEmails += 1
      }
    }
  }

  for (const email in groupedEmails) {
    groupedEmails[email].avgRiskLevel /= groupedEmails[email].emails.length ?? 1
  }

  const emailList = Object.keys(groupedEmails).sort(
    (a, b) => a.toLowerCase() - b.toLowerCase()
  )

  const [selectedEmail, setSelectedEmail] = useState(emailList[0] ?? null)
  const [inputValue, setInputValue] = useState("")

  const datasets = [
    {
      label: "Email",
      data: [
        groupedEmails[selectedEmail]?.quarantinedEmails ?? 1,
        groupedEmails[selectedEmail]?.suspiciousEmails ?? 1,
        groupedEmails[selectedEmail]?.cleanEmails ?? 1,
      ],
      borderColor: [
        Colors.theme_red_fill,
        Colors.theme_orange_fill,
        Colors.theme_green_fill,
      ],
      backgroundColor: [
        Colors.theme_red_fill,
        Colors.theme_orange_fill,
        Colors.theme_green_fill,
      ],
    },
  ]

  return (
    <Grid container>
      <Grid item xs>
        <Div m={24}>
          <Div row justifyContentBetween>
            <Div mb={8} maxWidth={504}>
              <Typography variant="h6">Email Risk Info</Typography>
              <Typography variant="body2" style={{ color: Colors.grey }}>
                {selectedEmail ?? ""}
              </Typography>
            </Div>
            <Div>
              <Autocomplete
                value={selectedEmail}
                onChange={(e, value) => setSelectedEmail(value)}
                inputValue={inputValue}
                onInputChange={(e, value) => setInputValue(value)}
                options={emailList}
                sx={{ width: 344 }}
                renderInput={(params) => (
                  <TextField {...params} label="Email" />
                )}
                disableClearable
                disablePortal
              />
            </Div>
          </Div>
          <Div w={464} h={464} alignSelfCenter>
            <DoughnutChart labels={labels} datasets={datasets} />
          </Div>
        </Div>
      </Grid>
      <Grid item xs={4} container direction={"column"}>
        <GraphStatBox
          title={"Total Emails"}
          count={groupedEmails?.[selectedEmail]?.emails.length}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Quarantined Emails"}
          count={groupedEmails?.[selectedEmail]?.quarantinedEmails}
          caption={`(${Math.round(
            (groupedEmails?.[selectedEmail]?.quarantinedEmails /
              groupedEmails?.[selectedEmail]?.emails.length) *
              100
          )}%)`}
        />
        <Div h={0.5} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Suspicious Emails"}
          count={groupedEmails?.[selectedEmail]?.suspiciousEmails}
          caption={`(${Math.round(
            (groupedEmails?.[selectedEmail]?.suspiciousEmails /
              groupedEmails?.[selectedEmail]?.emails.length) *
              100
          )}%)`}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Clean Emails"}
          count={groupedEmails?.[selectedEmail]?.cleanEmails}
          caption={`(${Math.round(
            (groupedEmails?.[selectedEmail]?.cleanEmails /
              groupedEmails?.[selectedEmail]?.emails.length) *
              100
          )}%)`}
        />
        <Div h={1} backgroundColor={Colors.lightGrey} />
        <GraphStatBox
          title={"Average Risk Level"}
          count={groupedEmails?.[selectedEmail]?.avgRiskLevel?.toFixed(2) ?? 0}
        />
      </Grid>
    </Grid>
  )
}

export default EmailInfoGraph
