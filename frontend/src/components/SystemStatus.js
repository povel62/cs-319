import React, { useState, useEffect } from "react"
import PageWrapper from "../components/PageWrapper"
import axios from "axios"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import StopCircleIcon from "@mui/icons-material/StopCircle"
import Fab from "@mui/material/Fab"
import Grid from "@mui/material/Grid"
import Tooltip from "@mui/material/Tooltip"
import Colors from "../utils/colors"

const SystemStatus = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getIsServiceRunning()
  }, [props.isServiceRunning])

  const getIsServiceRunning = () => {
    setIsLoading(true)
    axios
      .get(`/api/pull/status`)
      .then((response) => {
        props.setIsServiceRunning(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: `Service status could not be retrieved`,
        })
        setIsLoading(false)
        // error
      })
  }

  const startOrStopService = () => {
    setIsLoading(true)
    axios
      .get(`/api/pull/${props.isServiceRunning ? "stop" : "start"}`)
      .then((response) => {
        props.openSnackbarWithMessage({
          status: true,
          response: response.data,
        })
        props.setIsServiceRunning(!props.isServiceRunning)
        setIsLoading(false)
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: `Service could not be ${
            props.isServiceRunning ? "stopped" : "started"
          }`,
        })
        setIsLoading(false)
        // error
      })
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
      >
        <Tooltip
          title={
            props.isServiceRunning
              ? "Stop Email Fetching Service"
              : "Start Email Fetching Service"
          }
        >
          <Fab
            size="small"
            variant="extended"
            onClick={startOrStopService}
            style={{
              backgroundColor: props.isServiceRunning
                ? Colors.theme_red_light
                : Colors.theme_green,
              paddingRight: "1rem",
            }}
          >
            {props.isServiceRunning ? (
              <StopCircleIcon sx={{ mr: 1 }} />
            ) : (
              <PlayCircleIcon sx={{ mr: 1 }} />
            )}
            {"Email Fetch"}
          </Fab>
        </Tooltip>
      </Grid>
    </>
  )
}

export default SystemStatus
