import React, {useEffect} from 'react'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Task from './Task'

const TaskRowContainer = styled.div`
  background-color: ${props =>(props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 50px;
`

const TaskRow = (props) => {

  useEffect(() => {
    console.log("Row: ",props)
    //console.log(props.data)
  },[])

  return (

        <TaskRowContainer>
          <div>
            task
          </div>
        </TaskRowContainer>

  )
}

export default TaskRow

/*
   <Droppable 
      droppableId={props.id} 
      direction="horizontal"
      type="task" 
      >
      {(provided,snapshot) => {
        <TaskRowContainer
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
          >
          <div>
            task
   
          {
            props.data.tasks.map((task,index) => {
              return <Task task={task} index={index} />
            })
          }
          {provided.placeholder}
          </div>
        </TaskRowContainer>
      }}
    </Droppable>
*/


/*
<Droppable 
droppableId={this.props.id} 
direction="horizontal" 
type="task"
>
{(provided,snapshot) => (
  <TaskList
    ref={provided.innerRef}
    {...provided.droppableProps}
    isDraggingOver={snapshot.isDraggingOver}
  >
    {this.props.tasks.map((task, index) => {
      return <Task key={task.id} task={task} index={index}/>
    })}
    {provided.placeholder}
  </TaskList>
)}
</Droppable>
*/

/*
    <Droppable droppableId={props.data.id} type="task" direction="horizontal">
    {(provided,snapshot) => {
      <TaskRowContainer
        ref={provided.innerRef}
        {...provided.droppableProps}
        isDraggingOver={snapshot.isDraggingOver}
        >
        <div>
          task
        </div>
        {provided.placeholder}
      </TaskRowContainer>
    }}
  </Droppable>
*/