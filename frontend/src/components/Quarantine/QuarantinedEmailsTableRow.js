import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Typography from "@mui/material/Typography"
import Checkbox from "@mui/material/Checkbox"
import Chip from "@mui/material/Chip"
import Colors from "../../utils/colors"
import { makeStyles } from "@mui/styles"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import IconButton from "@mui/material/IconButton"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { getEmailDateString } from "../../utils/dateTimeFormat"
import QuaranatinedEmailsTableRowCollapse from "./QuaranatinedEmailsTableRowCollapse"
import Tooltip from "@mui/material/Tooltip"

const useStyles = makeStyles({
  emailBody: {
    backgroundColor: "white",
    padding: "2rem",
    border: `1px solid ${Colors.mediumGrey}`,
  },
  emailBodyTableCell: {
    paddingBottom: 0,
    paddingTop: 0,
  },
})

const QuarantinedEmailsTableRow = ({
  email,
  seen,
  handleClick,
  order,
  orderBy,
  isSelected,
  page,
}) => {
  const {
    fromAddress,
    toAddress,
    subject,
    emailRuleMatches,
    createdOn,
    body,
    score,
    emailCondition,
    id,
  } = email
  const [open, setOpen] = useState(false)

  let typographyType = seen ? "seenEmail" : "newEmail"

  const shownColumns = useSelector(
    (state) => state.quarantinedEmails.shownColumns
  )

  const columnMaxWidthMap = {}
  const columnDetails = useSelector((state) => state.quarantinedEmails.columns)
  columnDetails.forEach((c) => {
    if (c["maxWidth"]) columnMaxWidthMap[c["id"]] = c["maxWidth"]
  })

  useEffect(() => {
    setOpen(false)
  }, [order, orderBy, page, shownColumns])

  const getNameFromEmailAddressString = (emailAddrString) => {
    if (emailAddrString === "") return ""
    const strArr = emailAddrString.split(" ")
    const outputStrArr = []
    for (let str of strArr) {
      if (!str.startsWith("<") && !str.endsWith(">")) {
        outputStrArr.push(str)
      }
      if (str.endsWith(",")) {
        outputStrArr.push(",")
      }
    }
    return outputStrArr.join(" ")
  }

  const rowValuesMap = {
    fromAddress: getNameFromEmailAddressString(fromAddress),
    toAddress: getNameFromEmailAddressString(toAddress),
    subject,
    emailRuleMatches,
    createdOn: getEmailDateString(createdOn),
    score,
    emailCondition,
  }
  const rowComponents = columnDetails
    .filter(({ id }) => shownColumns[id])
    .map(({ id, maxWidth }) => {
      if (id === "emailRuleMatches") {
        return (
          <TableCell sx={{ maxWidth: { maxWidth } }}>
            {emailRuleMatches.map((x, i) => (
              <Chip
                label={
                  !x.includes("SIZE") ? x : `${x.split(": ").join(": ")} Bytes`
                }
                key={`${x}-${i}`}
                sx={{
                  marginTop: ".2rem",
                  marginRight: ".2rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "13.5rem",
                }}
              />
            ))}
          </TableCell>
        )
      } else {
        return (
          <TextTableCell
            maxWidth={maxWidth}
            typographyType={typographyType}
            text={rowValuesMap[id]}
          />
        )
      }
    })

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: `${
            email.emailCondition === "CLEAN"
              ? Colors.theme_green
              : email.emailCondition === "SUSPICIOUS"
              ? Colors.theme_yellow
              : Colors.theme_red
          }${20}`,
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            disableRipple
            sx={{ marginLeft: "7px" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {/* <Checkbox
            color="fillColor"
            onClick={(e) => handleClick(e, id)}
            checked={isSelected}
          ></Checkbox> */}
        </TableCell>
        {rowComponents}
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell
          padding="none"
          colSpan={Object.keys(shownColumns).length + 2}
        >
          <QuaranatinedEmailsTableRowCollapse open={open} email={email} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export const TextTableCell = ({ typographyType, text, maxWidth = "unset" }) => {
  return (
    <TableCell
      sx={{
        maxWidth: `${maxWidth}`,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <Tooltip title={text} placement="bottom-start">
        <Typography
          noWrap={true}
          variant={typographyType}
          sx={{ cursor: "pointer" }}
        >
          {text}
        </Typography>
      </Tooltip>
    </TableCell>
  )
}

export default QuarantinedEmailsTableRow
