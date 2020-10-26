import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Task from './Task'


// this doesnt work: react-beautiful-dnd complains about the inner ref. Class based solution works, as well as 
// the functional component one in WorkSpace. not sure why...

const TaskRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgreen' : 'orange' )};
  opacity: ${props => (props.isDraggingOver ? 0.6 : 1.0)};
  flex-grow: 1;
  min-height: 20px;
`

const TaskRow = (props) => {

  const tasks = props.data.tasks.map((task,index) => {
    return ( 
      <div key={index}>
        <Task 
          task={task} 
          index={index} 
          />
      </div>
    )
  })

  return (
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
          {tasks}
          {provided.placeholder}
        </TaskRowContainer>
      }}
    </Droppable>
  )
}

export default TaskRow
