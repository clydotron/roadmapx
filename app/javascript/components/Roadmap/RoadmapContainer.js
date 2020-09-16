import React, {useState, useEffect} from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './RoadmapContainer.css'
import WorkArea from './WorkArea/WorkArea'
import ToolArea from './ToolArea/ToolArea'
import Onboarding from './Onboarding/Onboarding'
import onboardingContent from './Onboarding/onboarding-content'

import axios from 'axios'

const RoadmapContainer = (props) => {

  const [tools,setTools] = useState([])
  const [lanes,setLanes] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState({})


  useEffect(() => {

    setTools([{id:"add_lane", title:"Add Lane", type:"lane"},{id:"add_task", title:"Add Task", type:"task"}])

    updateRoadmap()

    const onboardId = setTimeout(() => {
      setOnboardingData(onboardingContent.addLane)
      setShowOnboarding(true)
      console.log("onboarding!")
      var container = document.getElementById("tools_lane")
      if ( container) {
        console.log(container.getBoundingClientRect())
      }
      //show the onboarding
    },1000) 
    return () => { clearTimeout(onboardId) }


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
    /*
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
*/
    //do stuff here:

    //
    setOnboardingData(onboardingContent.addTask)
    setShowOnboarding(true)
    console.log("show onboarding")
  }

  const renderOnboarding = () => {
    //console.log(props)

    if (!showOnboarding) {
      return null
    }
    const pos = {x: 1200, y: 200 }
    return (
      <Onboarding
        show={showOnboarding}
        onClose={() => {setShowOnboarding(false)}}
        content={onboardingData}
        position={pos}
      />    
    )
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
        {renderOnboarding()} 
      </DragDropContext>
  )
}

export default RoadmapContainer