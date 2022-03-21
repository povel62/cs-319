import React from "react"
import { makeStyles, withStyles } from "@mui/styles"
import { useNavigate, useLocation } from "react-router-dom"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import MuiListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import HomeIcon from "@mui/icons-material/Home"
import MailIcon from "@mui/icons-material/Mail"
import ClipboardIcon from "@mui/icons-material/Assignment"
import Colors from "../utils/colors"
import Div from "./Div"
import PWCLogo from "../images/pwcIcon.png"

const drawerWidth = "230px"
const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
    gridColumn: 1,
    gridRow: "span 2",
    boxShadow: `18px 20px 20px rgba(0,0,0, 0.2)`,
  },
})

const ListItem = withStyles({
  root: {
    "&.logo": {
      "&:hover": {
        backgroundColor: `${Colors.theme_grey} !important`,
      },
    },
    padding: "25px 30px !important",
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "rgba(217, 57, 84, .2) !important",
    },

    "&:hover": {
      backgroundColor: "rgba(232, 141, 20, .1) !important",
    },
  },
  selected: {},
})(MuiListItem)

const pathNameMap = {
  home: "/",
  rules: "/rules",
  quarantine: "/quarantine",
  logout: "/logout",
}

const SideNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const classes = useStyles()

  const navigateHandler = path => {
    navigate(`${path}`, { replace: true })
  }

  const itemsList = [
    {
      text: (
        <Typography type="body1" style={{ fontWeight: 700 }}>
          Email Analyzer
        </Typography>
      ),
      icon: (
        <Div borderRadius="50%" size={40} p={4} backgroundColor="white">
          <img alt="pwcLogo" src={PWCLogo}></img>
        </Div>
      ),
      styles: {
        marginBottom: "25px",
        fontSize: "0px",
      },
      customClassName: "logo",
    },
    {
      text: <Typography variant="body2">Dashboard</Typography>,
      icon: <HomeIcon fontSize="small" color="text" />,
      onClick: () => navigateHandler(pathNameMap["home"]),
      selected: location.pathname === pathNameMap["home"],
    },
    {
      text: <Typography variant="body2">Manage Rules</Typography>,
      icon: <ClipboardIcon fontSize="small" color="text" />,
      onClick: () => navigateHandler(pathNameMap["rules"]),
      selected: location.pathname === pathNameMap["rules"],
    },
    {
      text: <Typography variant="body2">Quaratined Emails</Typography>,
      icon: <MailIcon fontSize="small" color="text" />,
      onClick: () => navigateHandler(pathNameMap["quarantine"]),
      selected: location.pathname === pathNameMap["quarantine"],
    },
  ]

  const navItems = itemsList.map((item, index) => {
    const { text, icon, onClick, selected, styles, customClassName = "" } = item
    return (
      <ListItem
        className={customClassName}
        button
        selected={selected}
        onClick={onClick}
        key={`text-${index}`}
        sx={styles}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} sx={{ color: Colors.theme_text }} />
      </ListItem>
    )
  })

  return (
    <Drawer
      className={classes.drawer}
      anchor="left"
      variant="permanent"
      open={true}
      sx={{
        ".MuiDrawer-paper": {
          top: "unset",
          left: "unset",
          position: "relative",
          backgroundColor: Colors.theme_grey,
        },
      }}
    >
      <List>{navItems}</List>
    </Drawer>
  )
}

export default SideNav
