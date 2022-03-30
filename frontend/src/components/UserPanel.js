import React from "react"
import Div from "./Div"
import Colors from "../utils/colors"
import ToggleButton from "@mui/material/ToggleButton"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import SystemStatus from "./SystemStatus"

const UserPanel = (props) => {
  return (
    <Div
      style={{
        backgroundColor: "#fff",
        borderTopRightRadius: "5px",
        borderBottom: "solid 3px",
        borderColor: Colors.lightGrey,
        display: "grid",
        gridTemplateColumns: "1% 101% 5%",
      }}
    >
      <Div
        row
        justifyContentBetween
        alignItemsCenter
        style={{ gridColumn: 2, height: "100%" }}
      >
        <Div>
          <SystemStatus
            openSnackbarWithMessage={props.openSnackbarWithMessage}
            setIsLoading={props.setIsLoading}
            setIsServiceRunning={props.setIsServiceRunning}
            isServiceRunning={props.isServiceRunning}
          />
        </Div>

        <Div />
        <ToggleButton
          value="Admin"
          sx={{
            border: "none",
            pt: 1.8,
            mr: 4,
            pr: 2,
            pl: 2,
            pb: 1.3,
            "&:hover": {
              backgroundColor: "white",
            },
          }}
          disableRipple
        >
          <AccountCircleIcon fontSize="medium" sx={{ mr: 1, border: "none" }} />
          Admin
          {/* <ArrowDropDownIcon /> */}
        </ToggleButton>
      </Div>
    </Div>
  )
}

export default UserPanel
