import React, { useState } from 'react'
import '../../../assets/stylesheets/index.css'
import './TitleBar.css'
import EditableText from './../EditableText/EditableText'

//import { SearchBox } from './../SearchBox/SearchBox'
//      <SearchBox requestSearch={console.log} data-testid="search" />
const TitleBar = (props) =>{


  return (
    <div className="titlebar">
      <div className="titlebar-logo" data-testid="logo">
        <div className="logo" />
        logo
      </div>
      <EditableText text={props.title} />
    </div>
  );
  
}

export default TitleBar;
