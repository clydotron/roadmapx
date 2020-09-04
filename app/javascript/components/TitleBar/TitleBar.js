import React, { useState } from 'react'
import './../../../assets/stylesheets/index.css'
import './TitleBar.css'
import EditableText from './../EditableText/EditableText'
import { SearchBox } from './../SearchBox/SearchBox'

//      <SearchBox requestSearch={console.log} data-testid="search" />
const TitleBar = (props) =>{

  const handleTextUpdate = (newText) => {
    console.log(`textUpdate:${newText}`)
    props.handleNewTitle(newText)
    // could skip this
  }

  return (
    <div className="titlebar">
      <div className="titlebar-logo" data-testid="logo">
        <div className="logo" />
        logo
      </div>
      <EditableText text={props.title} handleTextUpdate={handleTextUpdate}/>
      <SearchBox requestSearch={console.log} data-testid="search" />
    </div>
  );
  
}

export default TitleBar;
