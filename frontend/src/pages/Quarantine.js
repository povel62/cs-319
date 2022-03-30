import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEmails } from "../redux/reducers/quarantinedEmailsSlice"
import Div from "../components/Div"
import PageWrapper from "../components/PageWrapper"
import {
  QuarantinedEmailsSearchBarHeader,
  QuarantinedEmailsInfoPanel,
  QuarantinedEmailsTable,
} from "../components"
import Divider from "@mui/material/Divider"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"

const Quarantine = (props) => {
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.quarantinedEmails.isLoading)
  useEffect(() => {
    dispatch(fetchEmails())
  }, [props.isNewEmail])

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value)
  }
  return (
    <PageWrapper>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Div ph={24} fill mb={24}>
        <Div row>
          <QuarantinedEmailsSearchBarHeader
            handleSearchQuery={handleSearchQuery}
            searchQuery={searchQuery}
          />
        </Div>
        <Divider />
        <Div row m={8}>
          <QuarantinedEmailsInfoPanel />
        </Div>
        <Divider />
        <QuarantinedEmailsTable searchQuery={searchQuery} />
      </Div>
    </PageWrapper>
  )
}

export default Quarantine
