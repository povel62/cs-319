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
    outputDate = getTime(date)
  } else if (isWithinAWeek(formattedInputDate)) {
    outputDate = getDayOfWeekAndTime(date)
  } else if (!isSameYear(formattedCurrDate, formattedInputDate)) {
    outputDate = getNumericalDateFormat(date)
  } else {
    outputDate = getDayOfWeekAndDate(date)
  }
  return outputDate
}

export const getTime = (date) => {
  return moment(new Date(date)).format("h:mm A")
}

export const getDayOfWeekAndTime = (date) => {
  return moment(new Date(date)).format("ddd h:mm A")
}

export const getDayOfWeekAndDate = (date) => {
  return moment(new Date(date)).format("ddd MM-DD")
}

export const getNumericalDateFormat = (date) => {
  return moment(new Date(date)).format("YYYY-MM-DD")
}
