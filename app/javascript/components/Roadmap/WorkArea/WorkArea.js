import React from 'react'
import styled from 'styled-components'
import Lane from './Lane/Lane'
import { Droppable } from 'react-beautiful-dnd'

const Container = styled.div`
  padding: 0px 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white' )};
  flex-grow: 1;
  min-height: 500px;
`;
//
const WorkArea = (props) => {

  const lanes = props.lanes.map((lane,index) => {
    //console.log(">>> index: ",index, "lane: ",lane)
    return ( 
            <div key={index}>
              <Lane 
                data={lane} 
                index={index} 
                onUpdate={props.onUpdateLane}
                onDelete={props.onDeleteLane} 
                />
            </div>
          )
  })
  
  return (
    <Droppable droppableId="roadmap-lanes" type="lane">
    {(provided) => (
      <Container
        ref={provided.innerRef}
        {...provided.droppableProps}
        >
        {lanes}
        {provided.placeholder}
      </Container>
    )}
  </Droppable>
  )
}

export default WorkArea