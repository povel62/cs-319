import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import QuarantinedEmailsTableRow from "./QuarantinedEmailsTableRow"
import Box from "@mui/material/Box"
import Colors from "../../utils/colors"
import { makeStyles } from "@mui/styles"
import Table from "@mui/material/Table"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import Paper from "@mui/material/Paper"
import { quarantinedEmailsSelector } from "../../redux/selectors/quarantinedEmailsSelectors"
import { modifySelected } from "../../redux/reducers/quarantinedEmailsSlice"
import NoEmailsTableCell from "./NoEmailsTableCell"
import QuaratineEmailsTableColumns from "./QuarantinedEmailsTableColumns"

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

  useEffect(() => {
    setPage(0)
  }, [searchQuery])

  const selectedRows = useSelector((state) => state.quarantinedEmails.selected)

  const checkEmailContainsString = (email, str) => {
    if (str === "") return true
    for (let key in email) {
      if (!shownColumns[key] || key === "createdOn") continue
      let valueToCheck = email[key]
      if (Array.isArray(valueToCheck)) {
        valueToCheck = valueToCheck.join(" ")
      }
      valueToCheck = String(valueToCheck)
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
    setPage(0)
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

  const tableRows =
    emails.length !== 0 ? (
      stableSort(emails, getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((e, index) => (
          <QuarantinedEmailsTableRow
            key={index}
            email={e}
            seen={false}
            handleClick={handleClick}
            order={order}
            isSelected={isSelected(e.id)}
            orderBy={orderBy}
            page={page}
          />
        ))
    ) : (
      <NoEmailsTableCell />
    )

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className={classes.tableHead}>
            <QuaratineEmailsTableColumns
              onSelectAll={handleSelectAllClick}
              isSelectAllChecked={isSelectAllChecked()}
              onSort={handleRequestSort}
              order={order}
              orderBy={orderBy}
            />
          </TableHead>
          <TableBody className={classes.tableBody}>{tableRows}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
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

export default QuarantinedEmailsTable
