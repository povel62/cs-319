import React from "react"
import Div from "../../components/Div"
import { Button } from "@mui/material"
import { GRAPH1, GRAPH2, GRAPH3, GRAPH4 } from "../../utils/constants"

const GraphPicker = ({ selectedGraph, setSelectedGraph }) => {
  return (
    <Div row alignItemsCenter>
      <GraphButton
        selectedGraph={selectedGraph}
        setSelectedGraph={setSelectedGraph}
        graphName={GRAPH1}
      />
      <Div w={16} />
      <GraphButton
        selectedGraph={selectedGraph}
        setSelectedGraph={setSelectedGraph}
        graphName={GRAPH2}
      />
      <Div w={16} />
      <GraphButton
        selectedGraph={selectedGraph}
        setSelectedGraph={setSelectedGraph}
        graphName={GRAPH3}
      />
      <Div w={16} />
      <GraphButton
        selectedGraph={selectedGraph}
        setSelectedGraph={setSelectedGraph}
        graphName={GRAPH4}
      />
    </Div>
  )
}

const GraphButton = ({ selectedGraph, setSelectedGraph, graphName }) => {
  return (
    <Div backgroundColor="white" mb={12}>
      <Button
        variant={selectedGraph === graphName ? "contained" : "outlined"}
        onClick={() => setSelectedGraph(graphName)}
        color={selectedGraph === graphName ? "fillColor" : "primary"}
        sx={
          selectedGraph === graphName && {
            color: "white",
          }
        }
        disableRipple
      >
        {graphName}
      </Button>
    </Div>
  )
}

export default GraphPicker
