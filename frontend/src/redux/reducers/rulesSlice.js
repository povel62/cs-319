import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const rulesSlice = createSlice({
  name: "Rules",
  initialState: {},
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRules.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.rules = action.payload
        state.isLoading = false
      })
  },
})

export const fetchRules = createAsyncThunk("fetchRules", async () => {
  return await axios
    .get(`/api/rule`)
    .then(response => {
      return response.data
    })
    .catch(error => {})
})

export default rulesSlice.reducer
