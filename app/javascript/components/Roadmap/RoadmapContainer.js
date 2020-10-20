import React, {useState, useEffect, Fragment, useLayoutEffect} from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './RoadmapContainer.css'
import WorkArea from './WorkArea/WorkArea'
import ToolArea from './ToolArea/ToolArea'
import Onboarding from './Onboarding/Onboarding'
import onboardingContent from './Onboarding/onboarding-content'
import DropHereTarget from './Onboarding/DropHereTarget'
import _ from "lodash"
import axios from 'axios'

//
// Onboarding state machine:
// when the app starts and has loaded data, check to see if 
//  1. onboarding has already been shown
//  2. if not, are there any lanes?
// if not, show the

// onboarding states:
// active: on/off
// status: firstLane, firsTask, moreTasks

const RoadmapContainer = (props) => {

  const [tools,setTools] = useState([])
  const [hasData,setHasData] = useState(false)
  const [roadmap,setRoadmap] = useState({})
  const [nextLaneId,setNextLaneId] = useState(5) //move to roadmap
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState({})
  const [persistentOrder, setPersistentOrder] = useState(false)
  const [showDropHere,setShowDropHere] = useState(false)
  const [onboardingState,setOnboardingState] = useState("showAddLane")


  // BDG notes:
  /*
  const handleChange = (e) => {
    e.preventDefaults() //look this up
    
    //example
    //setReview(Object.assign({}, review, {[e.target.name]: e.target.value}))
  }

  */
  //4 dates: ShowAddLane, ShowAddTask, ShowAddSecondTask, complete.
  // >>> make persistent
  // >>> make lane counter persistent (so i always get increasing lanes)

  // data structures:
  // do we want to have a roadmap object that contains everything, or lanes and ordereds lanes?
  // pros-cons: having a simple list (only lane ids) for the ordered is simple and easy to manipulate 
  // (dont have to worry about deep copies)
  useEffect(() => {

    setTools([{id:"add_lane", title:"Add Lane", type:"lane"},{id:"add_task", title:"Add Task", type:"task"}])

    updateRoadmap()
  },[])

  useLayoutEffect(() => {
    //console.log("layoutEffect: ",roadmap, "hasData: ",hasData)

    // we could just check if 
    // if (typeof roadmap === 'undefined') {
    //   console.log("no roadmap data yet")
    //   return
    // }

    // check to see if the 
    if (typeof roadmap.lanes === 'undefined') {
      console.log("no roadmap lane data yet")
      return
    }

    if (!hasData) {
      return
    }

    // BDG - 
    const numLanes = Object.keys(roadmap.lanes).length
    //console.log("ULE - numLanes: ",Object.keys(roadmap.lanes).length)

    if (numLanes === 0 && onboardingState === "showAddLane") {
      //if first time, show onboarding
      if (!showOnboarding) {
        //setShowOnboarding(true)
        setTimeout(() => { 
          showOnboardingDialog(onboardingContent.addLane)
          setOnboardingState("showAddTask")
        },1000)
      }
      console.log("show onboarding:")
    }
    if (numLanes === 1 && onboardingState === "showAddTask") {
      console.log("Show AddTask");
      showOnboardingDialog(onboardingContent.addTask)
      //setOnboardingState("showAddSecondTask")
    }

  },[roadmap,hasData,onboardingState])

  const showOnboardingDialog = (content) => {
    setOnboardingData(content)
    setShowOnboarding(true)
  }

  const updateRoadmap = async () => {

    try {
      const resp = await axios.get("/api/v1/roadmaps/1") //use the roadmap id
      
      const payload = resp.data.data  

      const newLanes = []
      const newOrderedLanes = []

      // cycle thru the 'included' data structure to get all of the lanes associated with the roadmap
      // they will be sorted (using sort_key) when retrieved from the DB.
      // note: I am maintaing 2 sets of data: 'lanes' contains all of the lane data (title, id, color)
      // and is stored as properites within the lanes object >>> currently NOT an array <<<
      // a second array (orderedLanes) is used to store the just the id of the lane in the order they 
      // appear on screen. In the event of a reordering of the lanes (either by adding a new lane or reordering 
      // existing,)
      // >>> if not maintaining persistency, the orderedLanes can be upated post dnd with new ordered layout
      resp.data.included.map( lane => {   
        if( lane.type === "lane" ) {

          const data = lane.attributes
          data.id = lane.id
          data.task_rows = lane.relationships.task_rows.data
   
          data.task_rows.tasks = []
          const laneIndex = `lane-${lane.id}`
          newLanes[laneIndex] = data 
          newOrderedLanes.push(lane.id)

          console.log("task rows:", data.task_rows)
       
        }
      })
      const newRoadmap = {
        lanes: newLanes,
        orderedLanes: newOrderedLanes
      }
      setRoadmap(newRoadmap) 

      // if this is the first time:
      // check to see if there are any lanes:
      // if not, show the onboarding ()

      setHasData(true)
    }
    catch(err) {
      console.log(err)
    }
  }
  
  const getNextLaneName = () => {
    // @todo make the nextLaneId persistent
    const ttitle = `Lane ${nextLaneId}`
    setNextLaneId(nextLaneId + 1)
    return ttitle;
  }

  // return these together?
  const getNextLaneColor = () => {
    //allow for color scheme:
    //have 4 colors, cycle thru them
    const colors =[ "#00d084","#0693e3","purple","tomato"]
    return colors[nextLaneId % colors.length]
  }

  // blocking call to create a new lane 
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
      console.log("success: new lane created", resp);
      
      // trigger an update here:
      updateRoadmap();
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
    //console.log(lane)
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
  // const req = reqs[0]
  // const data = {
  //      "sort_key": req.sort_key
  //    }
  // //   console.log(data)
  // axios.patch(req.url,data)
  // .then((resp) => {
  //   console.log(resp)
  // },(err) => {
  //   console.log(err)
  // })

  

  const patchReqs = reqs.map(req => axios.patch(req.url,{"sort_key": req.sort_key}))
  console.log(patchReqs)

  Promise.all([patchReqs[0],patchReqs[1]])
  .then( (resp) => {
    console.log("success: ",resp)
    updateRoadmap()
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

  // use the drag start callback to determine if we need to show the drop here target
  // (shown if there are zero lanes, and the onboarding state is 'add_lane')
  const onDragStart = (result) => {
    console.log("Dragging: ",result)

    const {source,destination } = result;
    
    // if the user is dragging a new lane, show the "drop here"
    const numLanes = Object.keys(roadmap.lanes).length
    if ( source.droppableId === 'tool-area-lane' && numLanes === 0) {
      setShowDropHere(true)
    }
  }

  const onDragEnd = (result) => {
    //console.log(result)
    setShowDropHere(false)

    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }


    // User dropped a new lane onto the work area:
    //  create a new lane item, 
    //  add it to the list of lanes
    //  add it to the ordered list of lanes
    // >>> if we are using the DB, then things are a little different:
    // create new lane, with the roadmap id, and the 'sort' index
    // update the rest of the lanes' sortKey
    // reload the roadmap
    // @todo: problem: the 
    if (type === 'lane' && source.droppableId === 'tool-area-lane') {
 
      const newLane = createLane(destination.index);

      if (persistentOrder) {

      }
      else {

      }
      return

      // update the ordered lane list, but put a placeholder value for
      // the new one (since we wont know its ID until we get it from the DB)
      const newLaneOrder = Array.from(roadmap.orderedLanes);
      newLaneOrder.splice(destination.index, 0, -1);
   
      const orderedLanes = orderedLanesX(roadmap.lanes, newLaneOrder)
      updateLaneSortOrder(orderedLanes) //NB

      updateRoadmap()

      return
    }

    // ......
    // if this is a lane, this is a reorder event:
    // currently just update the order locally - not persistent

    if (type === 'lane') {

      // @todo move to own function?
      //reorderLanes(?)
      var newOrderedLanes = Array.from(roadmap.orderedLanes);
      newOrderedLanes.splice(destination.index, 0, newOrderedLanes.splice(source.index,1)[0]);

      if (persistentOrder) {

        // persistent solution:
        // update the 'sort_key' value for all lanes in the db
        // reload the roadmapd from the db
        const orderedLanes = orderedLanesX(roadmap.lanes, newOrderedLanes)
        updateLaneSortOrderNB(orderedLanes)

        updateRoadmap()
      }
      else {

        // non persistent - (no DB)
        const newRoadmap = {
          ...roadmap,
          orderedLanes: newOrderedLanes
        }
        setRoadmap(newRoadmap)
      }
      return;
    }

    if (type === task) {

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

const csrfToken = document.querySelector('[name=csrf-token]').content
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
console.log(csrfToken)

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

  const renderDropHereTarget = () => {
    if(!showDropHere) {
      return null;
    }

    return (
      <div className="drop-here-target">
        <h3>Drop Here</h3>
      </div>
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

  //todo: DropHereTarget should probably be rendered as the placeholder for dnd?
  // should only be visible when the something is being dragged over,
  // 
  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="roadmap-container">
          <div className="work-area">
            <DropHereTarget active={showDropHere} />
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