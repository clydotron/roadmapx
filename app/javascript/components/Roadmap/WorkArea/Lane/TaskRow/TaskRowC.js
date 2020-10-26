import React from 'react'
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task'


const TaskList = styled.div`
  display: flex;
  flex-direction: row;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgreen' : 'inherit' )};
  opacity: ${props => (props.isDraggingOver ? 0.6 : 1.0)};
  flex-grow: 1;
  min-height: 2px;
`;

export default class TaskRow extends React.Component {


  render() {
    return (
      <Droppable 
        droppableId={`row-${this.props.id}`} 
        direction="horizontal" 
        type="task"
      >
        {(provided,snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {this.props.data.tasks.map((task, index) => {
              //console.log("task_id:",task.task_id)
              return <Task key={task.id} task={task} index={index}/>
            })}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    )
  }
}
