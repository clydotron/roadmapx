import React, { useState, useRef } from 'react'

const EditableText = (props) => {
  const [text,setText] = useState(props.text);
  const [editMode,setEditMode] = useState(false)
  const inputRef = useRef(null)

  const changeEditMode = () => {
    setEditMode(!editMode)
  }

  const updateTextValue = () => {
    setEditMode(false)
    const newText = inputRef.current.value
    setText(newText)
    console.log(`props:${props}`)
    //props.onXYZ(newText)
  }

  const renderEditView = () => {
    return (
      <div>
        <input type="text" defaultValue={text} ref={inputRef}/>
        <button onClick={changeEditMode}>X</button>
        <button onClick={updateTextValue.bind(this)}>OK</button>
      </div>
    )
  }

  const renderDefaultView = () => {
    return (
      <div className="titlebar-title" onDoubleClick={changeEditMode} data-testid="title">
        {text}
      </div>
    )
  }

  return editMode ? renderEditView() : renderDefaultView()
}

export default EditableText