import React, { Component } from 'react'
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin: 4px;
  width: 250px;
  height: 24px;
  background-color: ${props => props.isDragging ? 'lightgreen' : props.bkColor};
  text-align: left;
`;

const Task = (props) => {

  return (
    <Draggable draggableId={props.task.id} index={props.index} type="task">
      {(provided,snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          bkColor={this.props.task.color}
        >
          {this.props.task.title}
        </Container>
      )}
    </Draggable>
  )
}
