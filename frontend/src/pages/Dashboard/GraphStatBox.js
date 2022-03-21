import Div from "../../components/Div"
import { Typography } from "@mui/material"
import Colors from "../../utils/colors"
import moment from "moment"

const GraphStatBox = ({
  title,
  count,
  startDate,
  endDate,
  isOvertimeGraph = false,
}) => {
  return (
    <Div fill row>
      <Div w={1} backgroundColor={Colors.lightGrey} />
      <Div center fill m={8}>
        <Typography style={{ color: Colors.grey }}>{title}</Typography>
        {isOvertimeGraph && (
          <Typography variant="caption">{`(${moment(startDate).format(
            "MMM D, YYYY"
          )} - ${moment(endDate).format("MMM D, YYYY")})`}</Typography>
        )}
        <Typography variant="h5">{count}</Typography>
      </Div>
    </Div>
  )
}

export default GraphStatBox
