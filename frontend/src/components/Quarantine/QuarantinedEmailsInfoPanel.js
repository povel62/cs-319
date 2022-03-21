import React from "react"
import { useSelector, useDispatch } from "react-redux"
import Div from "../Div"
import ToggleButton from "@mui/material/ToggleButton"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import ToggleButtonGroup from "@mui/material/ButtonGroup"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import ShortcutOutlinedIcon from "@mui/icons-material/ShortcutOutlined"
import Tooltip from "@mui/material/Tooltip"
import Colors from "../../utils/colors"
import { modifySelected } from "../../redux/reducers/quarantinedEmailsSlice"

const QuarantinedEmailsInfoPanel = () => {
  // const deleteEmail = (id) => {
  //   setIsLoading(true);
  //   axios
  //     .delete(`/api/email/${id}`)
  //     .then((response) => {
  //       getEmails();
  //     })
  //     .catch((error) => {
  //       setIsLoading(false);
  //     });
  // };

  const dispatch = useDispatch()
  const buttonStyling = { border: "none", padding: "10px 17px", margin: "5px" }
  const alphaHex = "45"
  const alphaHexHover = "60"
  const emailModifyButtonsList = [
    {
      value: "forward",
      title: "Forward Emails",
      icon: <ShortcutOutlinedIcon />,
      color: `${Colors.theme_orange}${alphaHex}`,
      hoverColor: `${Colors.theme_orange}${alphaHexHover}`,
    },
    {
      value: "delete",
      title: "Delete Emails",
      icon: <DeleteOutlineIcon />,
      color: `${Colors.theme_red}${alphaHex}`,
      hoverColor: `${Colors.theme_red}${alphaHexHover}`,
    },
  ]

  const selectedItems = useSelector((state) => state.quarantinedEmails.selected)
  const selectedItemsLength = selectedItems.length
  const isDisabled = selectedItems.length === 0
  const onClearSelected = () => {
    dispatch(modifySelected([]))
  }

  const emailModifyButtons = emailModifyButtonsList.map((btn, i) => {
    const { value, icon, color, hoverColor, title } = btn
    let divider
    if (i !== emailModifyButtonsList.length - 1) {
      divider = <Divider orientation="vertical" />
    }
    const buttonStyle = Object.assign({}, buttonStyling)
    if (!isDisabled) {
      buttonStyle["backgroundColor"] = color
      buttonStyle["&:hover"] = {
        backgroundColor: hoverColor,
      }
    } else {
      buttonStyle["backgroundColor"] = `${Colors.mediumGrey}50`
      buttonStyle["&:hover"] = {
        backgroundColor: `${Colors.mediumGrey}50`,
      }
    }

    return (
      <React.Fragment key={i}>
        <Tooltip title={title} arrow placement="top">
          <ToggleButton
            value={value}
            sx={buttonStyle}
            size="large"
            disableRipple={isDisabled}
          >
            {icon}
          </ToggleButton>
        </Tooltip>
        {divider}
      </React.Fragment>
    )
  })

  return (
    <Div row maxHeight={70} minWidth="100%" justifyContentBetween>
      {isDisabled ? (
        <Grid />
      ) : (
        <Grid>
          <Typography
            variant="h6"
            sx={{
              display: "inline-block",
              padding: "1rem .5rem",
              paddingBottom: "0",
            }}
          >
            {selectedItemsLength} Emails Selected
          </Typography>
          <Typography
            sx={{
              display: "inline-block",
              textDecoration: "underline",
              cursor: "pointer",
              color: `${Colors.theme_red}`,
            }}
            onClick={onClearSelected}
          >
            clear selection
          </Typography>
        </Grid>
      )}
      <ToggleButtonGroup>{emailModifyButtons}</ToggleButtonGroup>
    </Div>
  )
}

export default QuarantinedEmailsInfoPanel
