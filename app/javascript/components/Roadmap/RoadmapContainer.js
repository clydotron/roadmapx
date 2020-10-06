import React, {useState, useEffect, Fragment, useLayoutEffect} from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './RoadmapContainer.css'
import WorkArea from './WorkArea/WorkArea'
import ToolArea from './ToolArea/ToolArea'
import Onboarding from './Onboarding/Onboarding'
import onboardingContent from './Onboarding/onboarding-content'
import _ from "lodash"
import axios from 'axios'

const RoadmapContainer = (props) => {

  const [tools,setTools] = useState([])
  const [hasData,setHasData] = useState(false)
  const [roadmap,setRoadmap] = useState({})
  const [nextLaneId,setNextLaneId] = useState(5) //move to roadmap
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState({})

  // data structures:
  // do we want to have a roadmap object that contains everything, or lanes and ordereds lanes?

  useEffect(() => {

    setTools([{id:"add_lane", title:"Add Lane", type:"lane"},{id:"add_task", title:"Add Task", type:"task"}])

    updateRoadmap()
  },[])

  useLayoutEffect(() => {
    console.log("layoutEffect: ",roadmap)
    if (!hasData) {
      return
    }

    //console.log("numLanes: ",roadmap.lanes.length)
    if (roadmap.lanes.length === 0) {
      //if first time, show onboarding
      ///console.log("show onboarding:")
    }
  },[roadmap])

  const showOnboardingDialog = (content) => {
    setOnboardingData(content)
    setShowOnboarding(true)
  }

  const updateRoadmap = async () => {

    try {
      const resp = await axios.get("/api/v1/roadmaps/1") //use the roadmap id
      
      const payload = resp.data.data  
      //setTitle(payload.attributes.title)
      //console.log("roadmap: ",resp.data)

      const newLanes = []
      const newOrderedLanes = []

      resp.data.included.map( lane => {   
        if( lane.type === "lane" ) {
          const data = lane.attributes
          data.id = lane.id
          const laneIndex = `lane-${lane.id}`
          //console.log(laneIndex)
          newLanes[laneIndex] = data
          newOrderedLanes.push(lane.id)
        }
      })
      const newRoadmap = {
        lanes: newLanes,
        orderedLanes: newOrderedLanes
      }
      setRoadmap(newRoadmap) 
      setHasData(true)
    }
    catch(err) {
      console.log(err)
    }
  }
  
  const getNextLaneName = () => {
    const ttitle = `Lane ${nextLaneId}`
    setNextLaneId(nextLaneId + 1)
    return ttitle;
  }

  // return these together?
  const getNextLaneColor = () => {
    //allow for color scheme:
    //have 4 colors, cycle thru them
    const colors =[ "orange","red","purple","tomato"]
    return colors[nextLaneId % colors.length]
  }

  const createLane = async (sortKey) => {
 
    const newLane = {
      title: getNextLaneName(),
      color: getNextLaneColor(),
      roadmap_id: "1",
      collapsed:"false",
      sort_key: sortKey
    }   

    try {
      const resp = await axios.post('/api/v1/lanes',newLane)
      console.log("success: ", resp);
    }
    catch(err) {
      console.log("failure: ", err)
    }

    return newLane;
  }

  const createTask = () => {

  }

  const createTaskLane = () => {
    //maybe?
  }

const updateLaneSortOrder = async (sortedLanes) => {

  console.log("start updateLaneSortOrder")
  console.log(sortedLanes)

  const reqs = []

  sortedLanes.map((lane, index) => {
    console.log(lane)
    if (typeof lane === 'undefined' || typeof lane.id === 'undefined') {
      console.log("undefined")
    }
    else {
      reqs.push({url:`/api/v1/lanes/${lane.id}`,sort_key:index})
    }
  })

  //blocking - for now
  try {
    const response = await axios.all(reqs.map(info => {
      const data = {
        "sort_key": info.sort_key
      }
      axios.patch(info.url,data)
    }))
    console.log("updated sort order:", response)
    //request new roadmap
  }
  catch(err) {
    console.log(err)
  }
    
}

const updateLaneSortOrderNB = (sortedLanes) => {
  const reqs = []
  sortedLanes.map((lane, index) => {
    //console.log(lane)
    if (typeof lane === 'undefined' || typeof lane.id === 'undefined') {
      console.log("undefined")
    }
    else {
      reqs.push({url:`/api/v1/lanes/${lane.id}`,sort_key:index})
    }
  })

  console.log(reqs)

  // one works, but n doesnt...
  const req = reqs[0]
  const data = {
       "sort_key": req.sort_key
     }
  //   console.log(data)
  axios.patch(req.url,data)
  .then((resp) => {
    console.log(resp)
  },(err) => {
    console.log(err)
  })

  return

  const patchReqs = reqs.map(req => {
    const data = {
      "sort_key": req.sort_key
    }
    return axios.patch(req.url,data)
  })

  console.log(patchReqs)

  Promise.all(patchReqs)
  .then( (resp) => {
    console.log("success: ",resp)
  })
  .catch(err => {
    console.log("error: ",err)
  })

  // axios.all(reqs.map((req) => {
  //   const data = {
  //     "sort_key": req.sort_key
  //   }
  //   console.log(data)
  //   axios.patch(req.url,data)
  // }))
  // .then(axios.spread((...resp) => {
  //   console.log("success: ",resp)
  // }, (err)  => { 
  //   console.log("error :",err)
  // }))

}
//   let linksArr = ['https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com/comments'];

// axios.all(linksArr.map(l => axios.get(l)))
//   .then(axios.spread(function (...res) {
//     // all requests are now complete
//     console.log(res);
//   }));

const orderedLanesX = (lanes,laneOrder) => {
  const ordered = []
  laneOrder.map(laneId => {
    if (laneId !== -1) {
      const id = `lane-${laneId}`
      ordered.push(lanes[id])
    }
    else {
      ordered.push(undefined)
    }
  })
  return ordered
}

  const onDragEnd = (result) => {
    //console.log(result)
    
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    //do stuff here:
    // if the dropped item is a lane:
    //  create a new lane item, 
    //  add it to the list of lanes
    //  add it to the ordered list of lanes
    // >>> if we are using the DB, then things are a little different:
    // create new lane, with the roadmap id, and the 'sort' index
    // update the rest of the lanes' sortKey
    // reload the roadmap
    if (type === 'lane' && source.droppableId === 'tool-area-lane') {
 
      const newLane = createLane(destination.index);

      // update the ordered lane list, but put a placeholder value for
      // the new one (since we wont know its ID until we get it from the DB)
      const newLaneOrder = Array.from(roadmap.orderedLanes);
      newLaneOrder.splice(destination.index, 0, -1);
   
      const orderedLanes = orderedLanesX(roadmap.lanes, newLaneOrder)
      updateLaneSortOrder(orderedLanes) //NB

      updateRoadmap()

      return
    }


    // if this is a lane, this is a reorder event:
    // currently just update the order locally - not persistent
    if (type === 'lane') {

      //console.log(roadmap.orderedLanes)
      var newLaneOrder = Array.from(roadmap.orderedLanes);
      newLaneOrder.splice(destination.index, 0, newLaneOrder.splice(source.index,1)[0]);
      //console.log("after: ",newOrderedLanes) 

      const orderedLanes = orderedLanesX(roadmap.lanes, newLaneOrder)
      updateLaneSortOrderNB(orderedLanes)

      updateRoadmap()


      // const newRoadmap = {
      //   ...roadmap,
      //   orderedLanes: newOrderedLanes
      // }
      // setRoadmap(newRoadmap)

      // console.log(newRoadmap)

      // persistent solution:
      // update the 'sort_key' value for all lanes in the db
      // reload the roadmapd from ther db
      //updateLaneSortOrder(newLaneOrder)
      return;
    }

    // if the user just dropped their first lane, wait x seconds
    // and then show them the 'add bar' (task?) modal onboarding dialog
    //setOnboardingData(onboardingContent.addTask)
    //setShowOnboarding(true)
    //console.log("show onboarding")
  }

  const handleUpdateLane = (data) => {

    //console.log("new data: ",data)
    // save the data to the DB, trigger an update?
    const laneId = `lane-${data.id}`
    const lane = roadmap.lanes[laneId]
    roadmap.lanes[laneId] = data
 
    // make sure lane exists...

    const dbData = {
      color: data.color,
      collapsed: data.collapsed,
      title: data.title
    }

    //"collapsed": lane.collapsed
    //"title": lane.title,
    //console.log(dbData)
    axios.patch(`/api/v1/lanes/${lane.id}`,dbData)
    .then(resp => {
      //console.log("update: ",resp)
      updateRoadmap()
    })
    .catch(err => console.log(err))
  }

  const handleDeleteLane = (laneId) => {
    console.log(`delete lane: ${laneId}`)
    axios.delete(`/api/v1/lanes/${laneId}`)
    .then(resp => {
      console.log("delete successful: ",resp)
      updateRoadmap()
    })
    .catch(resp => { 
      console.log(resp)
    })
  }

  const renderOnboarding = () => {
  
    if (!showOnboarding) {
      return null
    }
    // get the position of the target element:
    const pos = {x: 1200, y: 200 }

    // make this conditional...
    var container = document.getElementById("tools_lane")
    if ( container) {
      console.log(container.getBoundingClientRect())
      pos.y = container.getBoundingClientRect().top
    }

    return (
      <Onboarding
        show={showOnboarding}
        onClose={() => {setShowOnboarding(false)}}
        content={onboardingData}
        position={pos}
      />    
    )
  }

  const orderedLanes = () => {
    var xlanes = []
    if (hasData) {
      roadmap.orderedLanes.map( laneId => {
        const laneIndex = `lane-${laneId}`
        xlanes.push(roadmap.lanes[laneIndex])
      })
      //console.log("Lanes: ",xlanes)
    }
    return xlanes
  }

  
  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container">
          <div className="work-area">
            <WorkArea 
              lanes={orderedLanes()} 
              onUpdateLane={handleUpdateLane}
              onDeleteLane={handleDeleteLane}
              />
          </div>
          <div className="tool-area">
            <ToolArea tools={tools}/>
          </div>
        </div>

      </DragDropContext>
      {renderOnboarding()}            
    </Fragment>
  )
}

export default RoadmapContainer