import React, {useState, useEffect, Fragment} from 'react'
//import Task from './Task/Task'
import axios from 'axios'

const PlanningBoard = (props) => {

  const [hasData,setHasData] = useState(false)
  const [newTaskMode, setNewTaskMode] = useState(false)
  const [tasks,setTasks] = useState([])

  const createNewTask = () => {
    console.log("newTask")

    const newTask = {
      id:1000, 
      title:"task X", 
      description:"",
      color:"orange"
    } 
    axios.post("/api/v1/tasks", newTask)
    .then(resp => { 
      console.log(success) 
      setTasks( {...tasks,newTask})
    })
    .catch(resp => console.log(resp))

  }

  const renderDefaultView = () => {
    return <div>default</div>
  }

  const renderNewTaskView = () =>{
    return <div>
      new!
    </div>
  }

  const taskList = tasks.map( task => {
    return <div>id:{task.id} name:{task.title} color:{task.color}</div>
  })
  
  return (
    <div>PlanningBoard
      <button onClick={createNewTask}>Create new task</button>
      <div>
        {taskList}
      </div>

    </div>
  )
}
export default PlanningBoard