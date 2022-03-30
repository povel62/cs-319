import React from "react"
import { useSelector } from "react-redux"
import Button from "@mui/material/Button"
import Colors from "../../utils/colors"
import Typography from "@mui/material/Typography"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableSortLabel from "@mui/material/TableSortLabel"
import Checkbox from "@mui/material/Checkbox"
import { shownColumnsSelector } from "../../redux/selectors/quarantinedEmailsSelectors"
import ShownColumnsMenu from "./ShownColumnsMenu"

const QuaratineEmailsTableColumns = ({
  onSelectAll,
  isSelectAllChecked,
  orderBy,
  order,
  onSort,
}) => {
  const columns = useSelector((state) => shownColumnsSelector(state))
  return (
    <TableRow sx={{ borderBottom: `1px solid ${Colors.theme_red}` }}>
      <TableCell
        sx={{
          borderRight: `1px solid ${Colors.theme_red_light}`,
        }}
        padding="checkbox"
      >
        {/* <Checkbox
          color="fillColor"
          checked={isSelectAllChecked}
          onChange={onSelectAll}
        /> */}
      </TableCell>
      {columns.map(({ id, label, noWrap, maxWidth }) => (
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
              sx={{ color: `${Colors.theme_red}` }}
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

export default QuaratineEmailsTableColumns
