import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const shownColumns = {
  fromAddress: true,
  toAddress: true,
  subject: true,
  riskRating: true,
  emailRuleMatches: true,
  emailCondition: true,
  createdOn: true,
}

const columnsList = [
  { id: "fromAddress", label: "From", disabled: true },
  { id: "toAddress", label: "To" },
  { id: "subject", label: "Subject" },
  { id: "riskRating", label: "Risk Rating", noWrap: true },
  { id: "emailRuleMatches", label: "Rule Hit", noWrap: true },
  { id: "emailCondition", label: "Condition" },
  { id: "createdOn", label: "Recieved" },
]

const quarantinedEmailsSlice = createSlice({
  name: "quarantinedEmails",
  initialState: {
    emails: [],
    order: "desc",
    orderBy: "",
    selected: [],
    isLoading: false,
    searchQuery: "",
    shownColumns:
      JSON.parse(localStorage.getItem("shownColumns")) || shownColumns,
    columns: columnsList,
  },
  reducers: {
    modifyColumnSort(state, action) {
      state.order = action.order
      state.orderBy = action.orderBy
    },
    modifySelected(state, { payload }) {
      state.selected = payload
    },
    modifyShownColumn(state, { payload }) {
      state.shownColumns[payload] = !state.shownColumns[payload]
      localStorage.setItem("shownColumns", JSON.stringify(state.shownColumns))
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEmails.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.emails = action.payload
        state.isLoading = false
      })
  },
})

export const fetchEmails = createAsyncThunk("fetchEmails", async () => {
  return await axios
    .get(`/api/email`)
    .then(response => {
      return response.data
    })
    .catch(error => {})
})

export const { modifyColumnSort, modifySelected, modifyShownColumn } =
  quarantinedEmailsSlice.actions
export default quarantinedEmailsSlice.reducer
