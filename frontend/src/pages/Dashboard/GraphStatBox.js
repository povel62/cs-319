import Div from "../../components/Div"
import { Typography } from "@mui/material"
import Colors from "../../utils/colors"

const GraphStatBox = ({ title, count, caption }) => {
  return (
    <Div fill row>
      <Div w={1} backgroundColor={Colors.lightGrey} />
      <Div center fill m={8}>
        <Typography style={{ color: Colors.grey }}>{title}</Typography>
        {caption && <Typography variant="caption">{caption}</Typography>}
        <Div maxWidth={352}>
          <Typography noWrap variant="h5">
            {count}
          </Typography>
        </Div>
      </Div>
    </Div>
  )
}

export default GraphStatBox
