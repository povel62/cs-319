import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Colors from "../../utils/colors";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import { getEmailDateString } from "../../utils/dateTimeFormat";

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
});

const EmailTableComponent = ({
  email,
  seen,
  handleClick,
  order,
  orderBy,
  isSelected,
}) => {
  const {
    fromAddress,
    toAddress,
    subject,
    emailRuleMatches,
    createdOn,
    body,
    riskRating = "1.0",
    emailCondition,
    id,
  } = email;
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  let typographyType = seen ? "seenEmail" : "newEmail";

  const shownColumns = useSelector(
    (state) => state.quarantinedEmails.shownColumns
  );
  useEffect(() => {
    setOpen(false);
  }, [order, orderBy]);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: `${
            email.emailCondition === "OK"
              ? Colors.theme_green
              : email.emailCondition === "SUSPICIOUS"
              ? Colors.theme_yellow
              : Colors.theme_red
          }${20}`,
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="fillColor"
            onClick={(e) => handleClick(e, id)}
            checked={isSelected}
          ></Checkbox>
        </TableCell>
        {shownColumns["fromAddress"] && (
          <TextTableCell typographyType={typographyType} text={fromAddress} />
        )}
        {shownColumns["toAddress"] && (
          <TextTableCell typographyType={typographyType} text={toAddress} />
        )}
        {shownColumns["subject"] && (
          <TextTableCell typographyType={typographyType} text={subject} />
        )}
        {shownColumns["riskRating"] && (
          <TextTableCell typographyType={typographyType} text={riskRating} />
        )}
        {shownColumns["emailRuleMatches"] && (
          <TableCell className={styles.tableCell} direction="row" spacing={1}>
            {emailRuleMatches.map((x, i) => (
              <Chip
                label={x}
                key={`${x}-${i}`}
                sx={{ marginTop: ".2rem", marginRight: ".2rem" }}
              />
            ))}
          </TableCell>
        )}
        {shownColumns["emailCondition"] && (
          <TextTableCell
            typographyType={typographyType}
            text={emailCondition}
          />
        )}
        {shownColumns["createdOn"] && (
          <TextTableCell
            typographyType={typographyType}
            text={getEmailDateString(createdOn)}
          />
        )}
        <TableCell align={"right"}>
          <IconButton aria-label="expand row" size="small" disableRipple>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          padding="none"
          colSpan={Object.keys(shownColumns).length + 2}
        >
          <Collapse in={open} unmountOnExit>
            <Box className={styles.emailBody}>
              <div dangerouslySetInnerHTML={{ __html: body }} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const TextTableCell = ({ typographyType, text }) => {
  return (
    <TableCell>
      <Typography noWrap={true} variant={typographyType}>
        {text}
      </Typography>
    </TableCell>
  );
};

export default EmailTableComponent;
