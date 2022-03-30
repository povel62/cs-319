import React, { useState, useEffect, useRef } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { Router } from "./routes"
import { theme } from "./theme"
import SideNav from "./components/SideNav"
import UserPanel from "./components/UserPanel"
import Snackbar from "@mui/material/Snackbar"
import Colors from "./utils/colors"
import MuiAlert from "@mui/material/Alert"
import Slide from "@mui/material/Slide"
import axios from "axios"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})
const slideTransition = (props) => {
  return <Slide {...props} direction="up" />
}

function App() {
  const [emailCount, setEmailCount] = useState(-1)
  const [open, setOpen] = useState(false)
  const [responseStatusMessage, setResponseStatusMessage] = useState({
    status: false,
    response: "",
    isEmailSnack: false,
  })
  const [isServiceRunning, setIsServiceRunning] = useState(false)

  useEffect(() => {
    if (isServiceRunning) {
      const interval = setInterval(() => {
        loopFetchEmailCount()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [emailCount, isServiceRunning])

  const loopFetchEmailCount = async () => {
    await axios
      .get(`/api/email/count`)
      .then((response) => {
        if (emailCount != -1 && emailCount != response.data) {
          openSnackbarWithMessage({
            status: true,
            response: "Fresh new 📥 came in, checkout the emails tab ✨",
            isEmailSnack: true,
          })
          setEmailCount(response.data)
        } else if (emailCount == -1) {
          setEmailCount(response.data)
        }
      })
      .catch((error) => {})
  }
  const openSnackbarWithMessage = (message) => {
    setResponseStatusMessage(message)
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="Layout">
        <Snackbar
          open={open}
          autoHideDuration={responseStatusMessage.isEmailSnack ? 30000 : 7500}
          onClose={handleClose}
          TransitionComponent={slideTransition}
          sx={{ minWidth: "350px" }}
        >
          <Alert
            onClose={handleClose}
            severity="info"
            color="secondary"
            sx={
              responseStatusMessage.isEmailSnack
                ? {
                    width: "100%",
                    backgroundImage:
                      "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)",
                  }
                : {
                    width: "100%",
                    backgroundColor: responseStatusMessage.status
                      ? Colors.theme_green_a_bit_darker
                      : Colors.theme_red,
                  }
            }
          >
            {responseStatusMessage.response}
          </Alert>
        </Snackbar>
        <SideNav />
        <UserPanel
          openSnackbarWithMessage={openSnackbarWithMessage}
          setIsServiceRunning={setIsServiceRunning}
          isServiceRunning={isServiceRunning}
        />
        <Router
          openSnackbarWithMessage={openSnackbarWithMessage}
          isNewEmail={responseStatusMessage.isEmailSnack}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
