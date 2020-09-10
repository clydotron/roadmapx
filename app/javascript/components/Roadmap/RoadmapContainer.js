import React, {useState, useEffect} from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './RoadmapContainer.css'
import WorkArea from './WorkArea/WorkArea'
import ToolArea from './ToolArea/ToolArea'
import axios from 'axios'

const RoadmapContainer = (props) => {

  const [tools,setTools] = useState([])
  const [lanes,setLanes] = useState([])

  useEffect(() => {

    setTools([{id:"add_lane", title:"Add Lane", type:"lane"},{id:"add_task", title:"Add Task", type:"task"}])

    updateRoadmap()

  },[])

  const updateRoadmap = () => {

    axios.get("/api/v1/roadmaps/1") //use the roadmap id
    .then( resp => { 
      const payload = resp.data.data  
      //setTitle(payload.attributes.title)
      console.log(resp.data)
      const lanes = []
      resp.data.included.map( lane => {   
        if( lane.type === "lane" ) {
          const data = lane.attributes
          data.id = lane.id
          lanes.push(data)
        }
      })

      setLanes(lanes)
      //setHasData(true)
    })
    .catch( resp => { console.log(resp)})
  }

  const onDragEnd = (result) => {
    console.log(result)
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    //do stuff here:


  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container">
        <div className="work-area">
          <WorkArea lanes={lanes}/>
        </div>
        <div className="tool-area">
          <ToolArea tools={tools}/>
        </div>
      </div>
    </DragDropContext>
  )
}

export default RoadmapContainer