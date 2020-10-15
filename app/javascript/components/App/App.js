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

  // ..........................................................................
  // write the new title to the database
  
  const handleNewTitle = (newTitle) => {
    setTitle(newTitle)

    axios.patch("/api/v1/workspaces/1",{title: newTitle})
    .then(resp => {console.log(`success:${resp}`) })
    .catch(resp => { console.log(resp) })
  }

  const createNewWorkspace = () => {

  }

  useEffect( () => {

    axios.get("/api/v1/workspaces/1")
    .then( resp => { 
  
      const wsdata = resp.data.data
      const workspaceX = {
        title: wsdata.attributes.title,
        roadmap: wsdata.relationships.roadmap.data.id
      }

      setTitle(workspaceX.title)
      setWorkspace(workspaceX)

      //console.log(workspaceX)
      setLoaded(true)
    })
    .catch( resp => {
      // if 404, create a workspace:
      const workspaceX = {
        title: "Candidate Homework",
        roadmap: 1
      }
      //write this to the DB...
      // will need to create a roadmap as well

      console.log(resp)
    })
  }
,[])

  return (
    <div className="App">
      {
        loaded &&
        <div className="Container">
          <TitleBar title={title} handleNewTitle={handleNewTitle.bind(this)}/>
          <Workspace workspace={workspace}/>
        </div>
      }
    </div>
  );
}

export default App
