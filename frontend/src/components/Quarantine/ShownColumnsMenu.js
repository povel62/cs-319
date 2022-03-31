import React from "react"
import { useSelector, useDispatch } from "react-redux"
import Colors from "../../utils/colors"
import Typography from "@mui/material/Typography"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { modifyShownColumn } from "../../redux/reducers/quarantinedEmailsSlice"

const ShownColumnsMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const dispatch = useDispatch()
  const activeOptions = useSelector(
    (state) => state.quarantinedEmails.shownColumns
  )
  const options = useSelector((state) => state.quarantinedEmails.columns)
  const ITEM_HEIGHT = 75
  const isColumnShown = (id) => activeOptions[id]

  return (
    <React.Fragment>
      <IconButton
        id="long-button"
        sx={{ marginLeft: ".1rem", color: `${Colors.theme_red}` }}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        MenuListProps={{
          style: { padding: 0 },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.4,
            width: "17rem",
          },
        }}
      >
        <Typography
          sx={{
            backgroundColor: `${Colors.theme_red}25`,
            borderBottom: `solid 1px ${Colors.theme_red}`,
            padding: "1rem",
            paddingLeft: "1.6rem",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          Show Columns
        </Typography>
        {options.map(({ label, id, disabled }) => (
          <MenuItem
            divider={true}
            disabled={disabled}
            key={id}
            onClick={() => dispatch(modifyShownColumn(id))}
            sx={{
              borderTop: `solid 1px ${Colors.theme_red_light}`,
            }}
          >
            <Checkbox
              sx={{ paddingRight: "1.7rem" }}
              color="fillColor"
              checked={isColumnShown(id)}
              disableRipple
            />
            {label}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}

export default ShownColumnsMenu
