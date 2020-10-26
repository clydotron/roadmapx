import React, {useState, useEffect, Fragment, useLayoutEffect} from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './RoadmapContainer.css'
import WorkArea from './WorkArea/WorkArea'
import ToolArea from './ToolArea/ToolArea'
import Modal from '../Utils/Modal/Modal'
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
  const [nextTaskId,setNextTaskId] = useState(10)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState({})
  const [persistentOrder, setPersistentOrder] = useState(true)
  const [showDropHere,setShowDropHere] = useState(false)
  const [onboardingState,setOnboardingState] = useState("showAddLane")
  const [showModal,setShowModal] = useState(false)

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

  const getRowAndTaskData = async () => {
    const rows = []
    const tasks = []

    try {
      const resp = await axios.get("/api/v1/rows") 
 
      resp.data.data.map((row,index) => {
        if (row.type === 'row') {
          const rowIndex = `row-${row.id}`
          rows[rowIndex] = row.relationships
        }
      })

      resp.data.included.map((item,index) => {
        if (item.type === 'task') {
          const taskIndex = `task-${item.id}`
          tasks[taskIndex] = item.attributes;
        }
      })
    }
    catch (err) {
      console.log(err);
    }

    return { rows, tasks }
  }


  const updateRoadmap = async () => {

    try {
      const resp = await axios.get("/api/v1/roadmaps/1") //use the roadmap id
      
      const payload = resp.data.data  
      //console.log(resp)

      const newLanes = []
      const newOrderedLanes = []
      const newRows = []
      const newTasks = []
  
      // tried (unsuccesfully) to move this to its own function, got tripped up with the Promise/return values... revisit
      try {
        const resp = await axios.get("/api/v1/rows") 
   
        resp.data.data.map((row,index) => {
          if (row.type === 'row') {
            const rowIndex = `row-${row.id}`
            newRows[rowIndex] = {
              tasks: row.relationships.tasks,
              id: row.id
            }
          }
        })
  
        resp.data.included.map((item,index) => {
          if (item.type === 'task') {
            const taskIndex = `task-${item.id}`
            newTasks[taskIndex] = item.attributes;
          }
        })
      }
      catch (err) {
        console.log(err);
      }

      setNextLaneId(payload.attributes.next_lane_id)


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

          //cycle thru the rows
          const data = lane.attributes
          data.id = lane.id
    
          const xrows = lane.relationships.rows.data.map((row) => {

            const rowIndex = `row-${row.id}`
            const rowData = newRows[rowIndex]

            const tasks = rowData.tasks.data.map(task => {
              const taskIndex = `task-${task.id}`
              const ttask = newTasks[taskIndex]

              return {
                ...ttask,
                id: task.id,
                lane_id: lane.id,
                row_id: row.id
              }
            })
            
            // can swap this to be > 
            if (tasks.length === 0) {
              //console.log(`row ${row.id} has no tasks - skipping`)
              //@todo fire off a delete for this row?
              return null
            }

            const newRow = {
              id: row.id,
              lane_id: lane.id,
              tasks: tasks
            }
            return newRow
          })

          data.rows = xrows.filter(row => { return row !== null})

          // always add a placeholder last row - give it a special name and do not store it in the db
          const lastRow = {
            id: `placeholder-${lane.id}`,
            lane_id: lane.id,
            tasks: []
          }
          data.rows.push(lastRow)

          const laneIndex = `lane-${lane.id}`
          newLanes[laneIndex] = data 
          newOrderedLanes.push(lane.id)

          //request all lanes and tasks?
        }
      })

      // update the existing (in memory) roadmap
      const newRoadmap = {
        lanes: newLanes,
        rows: newRows,
        tasks: newTasks,
        orderedLanes: newOrderedLanes
      }

      console.log(newRoadmap)

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

  const initTaskData = () => {

    const title = `Task  ${nextTaskId}`
    setNextTaskId(nextTaskId + 1)
    
    const taskColors =[ "#00d084","#0693e3","purple","tomato"]
    const color = taskColors[nextTaskId % taskColors.length]

    return { title, color }
  }

  const initLaneData = () => {
    const colors =[ "#00d084","#0693e3","purple","tomato"] //@todo make this configurable

    const title = `Lane ${nextLaneId}`
    const color = colors[nextLaneId % colors.length]
    setNextLaneId(nextLaneId + 1)
    // fire off db request:

    return { title, color }
  }

  // ..........................................................................
  // use the drag start callback to determine if we need to show the drop here target
  // (shown if there are zero lanes, and the onboarding state is 'add_lane')

  const onDragStart = (result) => {
    //console.log("Dragging: ",result)

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
 
      //const newLane = createLane(destination.index);
      var newLane = initLaneData(); //@todo improve this
      newLane = { ...newLane,
        roadmap_id: "1",
        collapsed:"false",
        sort_key: destination.index
      } 
   
      axios.post('/api/v1/lanes',newLane)
        .then(resp => {
          // we can get the lane.id from the response...
          const newLaneOrder = Array.from(roadmap.orderedLanes);
          newLaneOrder.splice(destination.index, 0, -1); //we could just put the new lane id in here and not deal with this complexity

          // @todo this REALLY should be a function, since the same thing is done below -- figure out how to return a promise
          const requests = []
          newLaneOrder.forEach((lane,index) => {
            if (lane !== -1) {
              requests.push(axios.patch(`/api/v1/lanes/${lane}`,{"sort_key":index}))
            }
          })

          axios.all(requests)
            .then(axios.spread((...responses) => {
              console.log("successfully updated lane order: ",responses)
              updateRoadmap()
            }))
            .catch(resp => {
              console.log("failed to update lane order: ",resp)
            })
        })
        .catch(resp => {
          console.log()
        })
      return
    }

    // if this is a lane, this is a reorder event:

    if (type === 'lane') {

      console.log("lane reorder")
      
      var newOrderedLanes = Array.from(roadmap.orderedLanes);
      newOrderedLanes.splice(destination.index, 0, newOrderedLanes.splice(source.index,1)[0]);
      console.log(newOrderedLanes)

      //if (persistentOrder) {

        const csrfToken = document.querySelector('[name=csrf-token]').textContent
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
        console.log(csrfToken)

        const requests = newOrderedLanes.map((lane,index) => {
          return axios.patch(`/api/v1/lanes/${lane}`,{"sort_key":index})
        })

        console.log(requests)

        axios.all(requests)
          .then(axios.spread((...responses) => {
            console.log("successfully updated lane order: <reorder>",responses)
            updateRoadmap()
          }))
          .catch(resp => {
            console.log("failed to update lane order: <reorder>",resp)
          })     
      // }
      // else {

      //   // non persistent - (no DB)
      //   const newRoadmap = {
      //     ...roadmap,
      //     orderedLanes: newOrderedLanes
      //   }
      //   setRoadmap(newRoadmap)
      // }
      return;
    }

    if (type === 'task') {
      console.log("task >>>> ",result)

      // check to see if this is a new task:
      if (source.droppableId === 'tool-area-task') {
        //const newTask = createTask()

        // find the row: check to see if it is the placeholder row:
        if (destination.droppableId.startsWith("row-placeholder-")) {

          const parts = destination.droppableId.split("-")
          const laneId = parts.pop()
          //const lane = roadmap.lanes[`lane-${laneId}`]
          //console.log("new task dropped on placeholder row - lane:",lane)

          // what needs to happen:
          // create a new row(r) in lane x -
          // create a new task on row r
          // reload the roadmap - kind of inefficient, but works for now

          axios.post('/api/v1/rows',{"lane_id":laneId})
            .then(resp => {
              //console.log("created new row:", resp);
              const row_id = resp.data.data.id

              const { title, color } = initTaskData()
              axios.post('/api/v1/tasks',{"title":title, "color":color, "row_id":row_id})
                .then(resp => {
                  //console.log("created new task: ")
                  updateRoadmap()
                })
                .catch(resp => { 
                  console.log(resp)
                })
            })
            .catch(resp => {
              console.log(resp)
            })
        }
        else {
          // create the new task in row r
          const row = roadmap.rows[destination.droppableId]
 
          const { title, color } = initTaskData()
          axios.post('/api/v1/tasks',{"title":title, "color":color, "row_id":row.id, "sort_key":destination.index})
            .then(resp => {

              // update the sort_keys of the other tasks:
              // make a copy of the array of tasks, insert a placeholder in the spot where the new one was added
              // cycle thru the tasks, create a patch request for each using the index as the sort_key
              // wait for all requests to complete.
              const ttasks = Array.from(row.tasks.data) //@todo fix this
              ttasks.splice(destination.index, 0, null)

              const requests = []
              ttasks.forEach((task, index) => {
                if ( index !== destination.index ) {
                  requests.push( axios.patch(`/api/v1/tasks/${task.id}`,{"sort_key":index}))
                }
              })
              axios.all([requests]).then(axios.spread((...responses) => {
                console.log(responses)
                updateRoadmap()
              })).catch(errors => {
                // react on errors.
                console.log(errors)
              })
            })
            .catch(resp => { 
              console.log("failed to create new task: ",resp)
            })
        }
      }
      else {
        if( source.droppableId === destination.droppableId ) {
          const row = roadmap.rows[destination.droppableId]

          console.log("task drag: row:",source.droppableId)
          //this is a same row-reorder
          //const row = roadmap.rows[`row-`]
        }
        else {
          // this is from one row to another:
          console.log("task drag: from:",source.droppableId," to:", destination.droppableId)

          //check if the destination is a placeholder
          const srcRow = roadmap.rows[source.droppableId]
          const dsrRow = roadmap.rows[destination.droppableId]
        }
      }
    }


    // if the user just dropped their first lane, wait x seconds
    // and then show them the 'add bar' (task?) modal onboarding dialog
    //setOnboardingData(onboardingContent.addTask)
    //setShowOnboarding(true)
    //console.log("show onboarding")
  }

  //const csrfToken = document.querySelector('[name=csrf-token]').content
  //axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

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
    setShowModal(true)

    console.log(`delete lane: ${laneId}`)



    // axios.delete(`/api/v1/lanes/${laneId}`)
    // .then(resp => {
    //   console.log("delete successful: ",resp)
    //   updateRoadmap()
    // })
    // .catch(resp => { 
    //   console.log(resp)
    // })
  }

  // ..........................................................................

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

  // @todo 
  const renderModalDialog = () => {
    return <Modal show={showModal} title={"Confirm Delete"} onClose={() => setShowModal(false)}>
      Do you really want to delete the lane?
    </Modal>
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
      {renderModalDialog()}        
    </Fragment>
  )
}

export default RoadmapContainer