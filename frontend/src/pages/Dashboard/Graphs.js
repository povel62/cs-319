import React, { useState } from "react"
import Div from "../../components/Div"
import Colors from "../../utils/colors"
import GraphPicker from "./GraphPicker"
import DetailedTimelineGraph from "./DetailedTimelineGraph"
import EmailHealthGraph from "./EmailHealthGraph"
import { GRAPH1, GRAPH2, GRAPH3, GRAPH4 } from "../../utils/constants"

// TODO: add graph 3, graph 4
const Graphs = () => {
  const [selectedGraph, setSelectedGraph] = useState(GRAPH1)
  return (
    <Div>
      <GraphPicker
        selectedGraph={selectedGraph}
        setSelectedGraph={setSelectedGraph}
      />
      <Div h={8} />
      <Div
        backgroundColor="white"
        borderColor={Colors.mediumGrey}
        borderRadius={8}
        borderWidth={1}
      >
        {selectedGraph === GRAPH1 ? (
          <EmailHealthGraph />
        ) : selectedGraph === GRAPH2 ? (
          <DetailedTimelineGraph />
        ) : selectedGraph === GRAPH3 ? (
          <Div>TBA {GRAPH3}</Div>
        ) : (
          <Div>TBA {GRAPH4}</Div>
        )}
      </Div>
    </Div>
  )
}

export default Graphs
