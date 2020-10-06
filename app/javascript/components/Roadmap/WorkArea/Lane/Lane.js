import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import TaskRow from './TaskRow/TaskRow';
import EditableText from './../../../EditableText/EditableText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { TwitterPicker} from 'react-color'
import './Lane.css';

const Container = styled.div`
  margin-bottom: 8px;
  padding: 0px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2 px;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 80px;

  background: repeating-linear-gradient(
    to right,
    #ffffff,
    #ffffff 124px,
    #d8d8d8 124px,
    #d8d8d8 125px
  );
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.bkcolor}
`;

// align-items: center;
const OpenCloseWidget = styled.div`
  background-color:tomato;
  padding: 8px 6px;
  cursor: pointer;
`

const SettingsWidget = styled.div`
  float:right;
  width:20px;
`

const Title = styled.h3`
  padding: 8px 16px;
  border: 0px;
  margin: 0px 0px 8px 0px;
  text-align: left;
  flex-grow:1;
`;

//background-color: ${props => props.bkcolor}

const Settings = styled.div`
  background-color:  blue;
  width: 24px;
  height: 24px;
`
const SettingsCover = styled.div`
  position: absolute;
  zIndex: 2;
`

const SettingsPopover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

const Lane = (props) => {
  
  const [mouseOver,setMouseOver] = useState(false)
  const [taskRows,setTaskRows] = useState([])
  const [collapsed,setCollapsed] = useState(false)
  const [showSettings,setShowSettings] = useState(false)
  const [showConfirmDelete,setShowConfirmDelete] = useState(false)

  useEffect(() => {
    updateLaneData();
  },[props])

  const updateLaneData = () => {
    setCollapsed(props.data.collapsed)
    //console.log("index: ",props.index," id: ", props.data.id)
  }

  const handleTextUpdate  = (newText) => {
    //console.log(newText)

    const data = {
      ...props.data,
      title: newText
    }
    props.onUpdate(data)
  }

  const settingsClicked = () => {
    // show the color picker
    setShowSettings(true)
  }

  const deleteClicked = () => {
    // confirm it ??
    //setShowConfirmDelete(true)

    props.onDelete(props.data.id)
  }

  const handleNewColor = (color) => {
    //console.log(color)

    const data = {
      ...props.data,
      color: color
    }
    props.onUpdate(data)
  }

  const getActionIcon = () => {
    return collapsed ? faAngleUp : faAngleDown
  }

  const toggleCollapased = () => {
    const newValue = !collapsed
    setCollapsed(newValue)
 
    const data = {
      ...props.data,
      collapsed: newValue
    }
    props.onUpdate(data)
  }

  return(
    <Draggable 
      draggableId={props.data.id} 
      index={props.index} 
      key={props.data.id}
      type="lane"
      >
      {(provided,snapshot) => (
       <div
       {...provided.draggableProps}
            ref={provided.innerRef}
       >
          <TopBar 
            {...provided.dragHandleProps} 
            
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            bkcolor={props.data.color}>
            <OpenCloseWidget>
              <FontAwesomeIcon icon={getActionIcon()} onClick={() => {toggleCollapased()}}/>  
            </OpenCloseWidget>

            <Title>{props.data.title}

            </Title>
            {
              mouseOver &&
              <div>
   
              <SettingsWidget>
              <FontAwesomeIcon icon={faCog} color="lime" onClick={() => {settingsClicked()}}/>  
              </SettingsWidget>
              <FontAwesomeIcon icon={faWindowClose} color="lime" onClick={() => {deleteClicked()}}/>  
              </div>
            }
          </TopBar>
          
          {
          showSettings &&
          <SettingsPopover>
            <SettingsCover onClick={() => setShowSettings(false)}>
              <TwitterPicker color={props.data.color} onChange={(color) => handleNewColor(color.hex) }/>
            </SettingsCover>
          </SettingsPopover>
        }
        {
          !collapsed &&
          <Container>
            <EditableText class_name={"h3 lane-title"} text={props.data.title} handleTextUpdate={handleTextUpdate}/>
          </Container>
        }
        </div>
      )}
    </Draggable>
  )
  
};

export default Lane;
{/* <div>
{
  mouseOver &&
  <Settings onMouseDown={settingsClicked}/>
}
</div> */}
//{props.rows.map((row, index) => {
 // return <TaskRow key={row.id} id={row.id} tasks={row.tasks} index={index} />
//})}



// return (
//   <div>
//     <button onClick={ this.handleClick }>Pick Color</button>
//     { this.state.displayColorPicker ? <div style={ popover }>
//       <div style={ cover } onClick={ this.handleClose }/>
//       <ChromePicker />
//     </div> : null }
//   </div>
// )
// }