import { createSelector } from "@reduxjs/toolkit"
import moment from "moment"

export const quarantinedEmailsSelector = createSelector(
  (state) => state.quarantinedEmails.emails,
  (emails) =>
    (emails || []).map((e) => {
      const modifiedEmail = Object.assign({}, e)
      modifiedEmail.createdOn = moment(e.createdOn).toDate().getTime()
      modifiedEmail.score = Math.round(e.score * 100) / 100
      if (e.emailCondition === "OK") {
        modifiedEmail.emailCondition = "CLEAN"
      }
      if (e.emailCondition === "SPAM") {
        modifiedEmail.emailCondition = "QUARANTINED"
      }
      return modifiedEmail
    })
)

export const shownColumnsSelector = createSelector(
  (state) => state.quarantinedEmails.shownColumns,
  (state) => state.quarantinedEmails.columns,
  (shownColumns, columnDetails) => {
    const returnedColumns = []
    columnDetails.forEach((column) => {
      if (shownColumns[column.id]) returnedColumns.push(column)
    })
    return returnedColumns
  }
)
