import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import EmailTableComponent from "./EmailTableComponent"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Colors from "../../utils/colors"
import { makeStyles } from "@mui/styles"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import TableSortLabel from "@mui/material/TableSortLabel"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import {
  quarantinedEmailsSelector,
  shownColumnsSelector,
} from "../../redux/selectors/quarantinedEmailsSelectors"
import {
  modifyShownColumn,
  modifySelected,
} from "../../redux/reducers/quarantinedEmailsSlice"

const useStyles = makeStyles({
  tableHeaderCellText: {
    color: Colors.theme_red,
  },
  tableHead: {
    "& .MuiTableCell-root": {
      borderBottom: `1px solid ${Colors.theme_red_light}`,
    },
  },
})

const descendingComparator = (a, b, orderBy) => {
  let aValue = a[orderBy]
  let bValue = b[orderBy]

  if (Array.isArray(aValue)) {
    aValue = aValue.length
    bValue = bValue.length
  }
  if (aValue > bValue) {
    return -1
  }
  if (aValue < bValue) {
    return 1
  }
  return 0
}

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const QuarantinedEmailsTable = ({ searchQuery }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [order, setOrder] = useState("desc")
  const [orderBy, setOrderBy] = useState("createdOn")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const sortOrder = localStorage.getItem("sortOrder")
    const sortProperty = localStorage.getItem("sortProperty")
    const rowsPerPage = localStorage.getItem("rowsPerPage")
    sortOrder && setOrder(sortOrder)
    sortProperty && setOrderBy(sortProperty)
    rowsPerPage !== null && setRowsPerPage(parseInt(rowsPerPage, 10))
  }, [])

  const shownColumns = useSelector(
    (state) => state.quarantinedEmails.shownColumns
  )

  const selectedRows = useSelector((state) => state.quarantinedEmails.selected)

  const checkEmailContainsString = (email, str) => {
    if (str === "") return true
    for (let key in email) {
      if (!shownColumns[key] || key === "createdOn") continue
      let valueToCheck = email[key]
      if (Array.isArray(valueToCheck)) {
        valueToCheck = valueToCheck.join(" ")
      }
      if (valueToCheck.toLowerCase().includes(str.toLowerCase())) return true
    }
    return false
  }

  const emails = useSelector((state) =>
    quarantinedEmailsSelector(state)
  ).filter((e) => checkEmailContainsString(e, searchQuery))

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    const newOrder = isAsc ? "desc" : "asc"
    setOrder(newOrder)
    setOrderBy(property)
    localStorage.setItem("sortOrder", newOrder)
    localStorage.setItem("sortProperty", property)
  }

  const handleChangePage = (e, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    const rowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(rowsPerPage)
    localStorage.setItem("rowsPerPage", rowsPerPage)
    setPage(0)
  }

  const handleSelectAllClick = (event) => {
    const currIdsDisplayed = emails.map((e) => e.id)
    let newSelected
    if (event.target.checked) {
      newSelected = [...selectedRows]
      currIdsDisplayed.forEach((id) => {
        if (selectedRows.indexOf(id) === -1) {
          newSelected.push(id)
        }
      })
    } else {
      newSelected = selectedRows.filter(
        (id) => currIdsDisplayed.indexOf(id) === -1
      )
    }
    dispatch(modifySelected(newSelected))
  }

  const isSelectAllChecked = () => {
    if (emails.length === 0) return false
    for (let email of emails) {
      if (selectedRows.indexOf(email.id) === -1) {
        return false
      }
    }
    return true
  }

  const handleClick = (e, id) => {
    e.stopPropagation()
    const selectedIndex = selectedRows.indexOf(id)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1))
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      )
    }

    dispatch(modifySelected(newSelected))
  }

  const isSelected = (id) => selectedRows.indexOf(id) !== -1

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - emails.length) : 0

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableHeaderContent
              onSelectAll={handleSelectAllClick}
              isSelectAllChecked={isSelectAllChecked()}
              onSort={handleRequestSort}
              order={order}
              orderBy={orderBy}
            />
          </TableHead>
          <TableBody className={classes.tableBody}>
            {stableSort(emails, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((e, index) => (
                <EmailTableComponent
                  key={index}
                  email={e}
                  seen={false}
                  handleClick={handleClick}
                  order={order}
                  isSelected={isSelected(e.id)}
                  orderBy={orderBy}
                />
              ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 68 * emptyRows,
                }}
              >
                <TableCell colSpan={Object.keys(shownColumns).length + 2} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 5, 10, 25, 50]}
        component={Paper}
        count={emails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        sx={{ color: `${Colors.theme_red}` }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}

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
        sx={{ paddingLeft: "1.1rem", color: `${Colors.theme_red}` }}
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
            backgroundColor: `${Colors.theme_red}30`,
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

const TableHeaderContent = ({
  onSelectAll,
  isSelectAllChecked,
  orderBy,
  order,
  onSort,
}) => {
  const classes = useStyles()
  const columns = useSelector((state) => shownColumnsSelector(state))
  return (
    <TableRow sx={{ borderBottom: `1.2px solid ${Colors.theme_red}` }}>
      <TableCell
        sx={{ borderRight: `1px solid ${Colors.theme_red_light}` }}
        padding="checkbox"
      >
        <Checkbox
          color="fillColor"
          checked={isSelectAllChecked}
          onChange={onSelectAll}
        />
      </TableCell>
      {columns.map(({ id, label, noWrap }) => (
        <TableCell key={id} padding="none">
          <TableSortLabel
            component={Button}
            active={orderBy === id}
            sx={{
              height: "100%",
              width: "100%",
              padding: "16px",
              textTransform: "none",
              fontSize: "1rem",
              borderRight: `1px solid ${Colors.theme_red_light}`,
            }}
            direction={orderBy === id ? order : "asc"}
            onClick={() => onSort(id)}
          >
            <Typography
              key={id}
              align="left"
              className={classes.tableHeaderCellText}
              noWrap={noWrap}
            >
              {label}
            </Typography>
          </TableSortLabel>
        </TableCell>
      ))}
      <TableCell padding="checkbox">
        <ShownColumnsMenu />
      </TableCell>
    </TableRow>
  )
}

export default QuarantinedEmailsTable
