import React, {useState, useEffect } from 'react';
import logo from './../../../assets/images/pp_logo.svg';
import './App.css';
import TitleBar from '../TitleBar/TitleBar';
import Workspace from '../Workspace/Workspace';
import axios from 'axios';

function App() {

  const [title,setTitle] = useState("none");
  const [workspace,setWorkspace] = useState({});
  const [loaded,setLoaded] = useState(false)

  const handleNewTitle = (newTitle) => {
    setTitle(newTitle)
    console.log(`newTitle:${newTitle}`)
    // we need to update the DB...
  }

  useEffect( () => {
    axios.get("/workspace.json")
    .then(resp => { 
      const data = resp.data.data
      setWorkspace(data)
      setTitle(data.title)
      setLoaded(true)
    })
    .catch(resp => { console.log(resp)})
  }
,[title.length])

  return (
    <div className="App">
      {
        loaded &&
        <div>
        <TitleBar title={title} onXYZ={handleNewTitle.bind(this)}/>
        <Workspace data={workspace}/>
        </div>
      }
    </div>
  );
}

export default App
