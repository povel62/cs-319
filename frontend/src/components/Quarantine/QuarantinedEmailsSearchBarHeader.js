import React from "react"
import Typography from "@mui/material/Typography"
import InputAdornment from "@mui/material/InputAdornment"
import FilledInput from "@mui/material/FilledInput"
import SearchIcon from "@mui/icons-material/Search"
import Div from "../Div"

const QuarantinedEmailsSearchBarHeader = ({
  searchQuery,
  handleSearchQuery,
}) => {
  return (
    <Div
      row
      minWidth={"100%"}
      justifyContentBetween
      mt={16}
      mb={16}
      pr={30}
      style={{ boxSizing: "border-box" }}
    >
      <Typography variant="h6">Quarantined Emails</Typography>
      <FilledInput
        color="fillColor"
        placeholder="Search"
        size="small"
        sx={{
          "#email-search-input": {
            padding: "8px 15px",
          },
          width: "40%",
        }}
        id="email-search-input"
        value={searchQuery}
        onChange={handleSearchQuery}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        }
      />
    </Div>
  )
}

export default QuarantinedEmailsSearchBarHeader
