import React from "react"
import Div from "./Div"
import Colors from "../utils/colors"

const PageWrapper = (props) => {
  return (
    <Div
      backgroundColor={Colors.pageColor}
      fill
      style={{
        gridColumn: 2,
        overflowY: "scroll",
        height: "100%",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        boxShadow: `20px 20px 20px rgba(0,0,0, 0.15)`,
      }}
    >
      {props.children}
    </Div>
  )
}

export default PageWrapper
