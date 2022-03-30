import moment from "moment"

const isSameDay = (d1, d2) => {
  return moment(d1).isSame(d2, "day")
}
const isWithinAWeek = (date) => {
  const oneWeekAgo = moment(new Date()).subtract(7, "days").startOf("day")
  return moment(date).isAfter(oneWeekAgo)
}
const isSameYear = (d1, d2) => {
  return moment(d1).isSame(d2, "year")
}
export const getEmailDateString = (date) => {
  const formattedCurrDate = moment(new Date()).format()
  const formattedInputDate = moment(new Date(date)).format()
  let outputDate = ""
  if (isSameDay(formattedCurrDate, formattedInputDate)) {
    outputDate = momentFormatDate(date, "h:mm A")
  } else if (isWithinAWeek(formattedInputDate)) {
    outputDate = momentFormatDate(date, "ddd h:mm A")
  } else if (!isSameYear(formattedCurrDate, formattedInputDate)) {
    outputDate = momentFormatDate(date, "YYYY-MM-DD")
  } else {
    outputDate = momentFormatDate(date, "ddd MM-DD")
  }
  return outputDate
}

export const momentFormatDate = (date, format) => {
  return moment(new Date(date)).format(format)
}
