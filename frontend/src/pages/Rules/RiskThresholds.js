import React, { useEffect, useState } from "react"
import { Typography, Grid, Button, Paper, Slider } from "@mui/material"

import Colors from "../../utils/colors"

import Divider from "@mui/material/Divider"

import { Div } from "../../components"

const RiskThresholds = ({ thresholdsParent, saveThresholds }) => {
  const [thresholds, setThresholds] = useState(thresholdsParent)

  useEffect(() => {
    setThresholds(thresholdsParent)
  }, [thresholdsParent])

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
  ]

  return (
    <Paper variant="outlined">
      <Div m={24}>
        <Typography variant="h6" sx={{ paddingBottom: ".5rem" }}>
          Risk Thresholds
        </Typography>
        <Divider />
        <Div h={32} />
        <Div ph={8}>
          <Div pb={16}>
            <Slider
              value={thresholds}
              onChange={(event, newThresholds, activeThumb) => {
                if (!Array.isArray(newThresholds)) {
                  return
                }

                const minDistance = 0.01

                if (activeThumb === 0) {
                  setThresholds([
                    Math.min(newThresholds[0], thresholds[1] - minDistance),
                    thresholds[1],
                  ])
                } else {
                  setThresholds([
                    thresholds[0],
                    Math.max(newThresholds[1], thresholds[0] + minDistance),
                  ])
                }
              }}
              marks={marks}
              min={0}
              max={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => {
                let level = ""
                if (value === thresholds[0]) {
                  level = "Suspicious"
                } else {
                  level = "Quarantine"
                }
                return level + " If Risk > " + value
              }}
              step={0.01}
              disableSwap
              track={false}
              sx={{
                ".MuiSlider-markLabel": {
                  paddingTop: "1vh",
                },
                ".MuiSlider-mark": {
                  background: `rgba(0,0,0,0)`,
                },
                ".MuiSlider-rail": {
                  height: "1vh",
                  background: `linear-gradient(to right, ${
                    Colors.theme_green
                  } ${thresholds[0] * 100}%, ${Colors.theme_orange}99 ${
                    thresholds[0] * 100
                  }% ${thresholds[1] * 100}%, ${Colors.theme_red}99 ${
                    thresholds[1] * 100
                  }%);`,
                },
                ".MuiSlider-thumb": {
                  height: "4vh",
                  width: "2px",
                  borderRadius: "0px",
                  background: `grey`,
                },
              }}
            />
          </Div>
          <Grid container>
            <Grid item xs={4}>
              <Typography>{`Clean: 0 - ${thresholds[0].toFixed(
                2
              )}`}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography textAlign="center">
                {`Suspicious: ${thresholds[0].toFixed(
                  2
                )} - ${thresholds[1].toFixed(2)} `}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography textAlign="right">
                {`Quarantined: ${thresholds[1].toFixed(2)} - 1`}
              </Typography>
            </Grid>
          </Grid>
        </Div>
        <Div h="2vh" />
        <Div center>
          <Button
            variant="contained"
            onClick={() => saveThresholds(thresholds)}
            size="small"
          >
            Save
          </Button>
        </Div>
      </Div>
    </Paper>
  )
}

export default RiskThresholds
