import React from "react"
import InputAdornment from "@mui/material/InputAdornment"
import FilledInput from "@mui/material/FilledInput"
import SearchIcon from "@mui/icons-material/Search"

const SearchBar = ({ searchQuery, handleSearchQuery }) => {
  return (
    <FilledInput
      placeholder="Search"
      size="small"
      sx={{
        "#email-search-input": {
          padding: "8px 16px",
        },
        width: "100%",
        maxWidth: 400,
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
  )
}

export default SearchBar
