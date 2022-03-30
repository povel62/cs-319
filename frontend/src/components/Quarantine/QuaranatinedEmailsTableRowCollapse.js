import React from "react"
import Collapse from "@mui/material/Collapse"
import Box from "@mui/material/Box"
import { makeStyles } from "@mui/styles"
import Colors from "../../utils/colors"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import { momentFormatDate } from "../../utils/dateTimeFormat"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"

const useStyles = makeStyles({
  emailBody: {
    backgroundColor: "white",
    padding: "1rem",
    border: `1px solid ${Colors.mediumGrey}`,
    display: "flex",
    flexDirection: "column",
  },
  emailContentBox: {
    margin: "1rem 0",
    display: "flex",
  },
  emailContent: {
    display: "flex",
    flexDirection: "column",
    marginLeft: ".3rem",
  },
  emailInforamationChipBox: {
    display: "flex",
    flexDirection: "column",
  },
  emailInforamation: {
    display: "grid",
    gridTemplateColumns: "25rem 1fr",
    margin: ".6rem",
    marginBottom: "0",
  },
})
const QuaranatinedEmailsTableRowCollapse = ({ open, email }) => {
  const styles = useStyles()
  const {
    body,
    toAddress,
    fromAddress,
    subject,
    emailCondition,
    createdOn,
    emailRuleMatches,
    score,
  } = email

  const getInitials = (fromAddress) => {
    const strArr = fromAddress.split(" ")
    if (strArr.length >= 3) {
      let firstName = strArr[0]
      let lastName = strArr[1]
      return `${firstName?.substring(0, 1)}${lastName?.substring(0, 1)}`
    } else if (strArr.length === 2) {
      let name = strArr[0]
      return `${name?.substring(0, 1)}`
    }
    return ""
  }

  const chipColor = `${
    email.emailCondition === "CLEAN"
      ? Colors.theme_green
      : email.emailCondition === "SUSPICIOUS"
      ? Colors.theme_yellow
      : Colors.theme_red
  }${35}`

  return (
    <Collapse in={open} unmountOnExit>
      <Box className={styles.emailBody}>
        <Box>
          <Typography
            variant="h6"
            sx={{ margin: "0.1rem .2rem", fontSize: "1.2rem" }}
          >
            {subject}
          </Typography>
        </Box>
        <Divider />
        <Box className={styles.emailContentBox}>
          <Avatar sx={{ marginRight: ".2rem" }}>
            {getInitials(fromAddress)}
          </Avatar>
          <Box className={styles.emailContent}>
            <Typography> {fromAddress} </Typography>
            <Typography sx={{ fontSize: ".7rem" }}>
              {momentFormatDate(createdOn, "ddd YYYY-MM-DD hh:mm A")}
            </Typography>
            <Typography sx={{ fontSize: ".84rem" }}>
              To: {`${toAddress}`}
            </Typography>
            <Typography sx={{ marginTop: "1rem" }}>
              <div dangerouslySetInnerHTML={{ __html: body }}></div>
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box className={styles.emailInforamation}>
          <Box>
            <Chip
              label={`Risk Rating: ${score}`}
              sx={{
                backgroundColor: `${chipColor}`,
              }}
            />
            <Chip
              label={`Email Condition: ${emailCondition}`}
              sx={{
                marginLeft: ".5rem",
                backgroundColor: `${chipColor}`,
              }}
            />
          </Box>
          <Box>
            {emailRuleMatches.length > 0 && (
              <Typography
                sx={{ display: "inline-block", marginRight: ".4rem" }}
              >
                Rule Hit:
              </Typography>
            )}
            {emailRuleMatches.map((x, i) => (
              <Chip
                label={
                  !x.includes("SIZE") ? x : `${x.split(": ").join(": >")} Bytes`
                }
                key={`${x}-${i}-1`}
                sx={{ marginBottom: ".2rem", marginLeft: ".2rem" }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Collapse>
  )
}

export default QuaranatinedEmailsTableRowCollapse
