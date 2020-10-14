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
    console.log(`>>> newTitle:${newTitle}`)

    const data = {
      title: newTitle
    }
    axios.patch("/api/v1/workspaces/1",{title: newTitle})
    .then(resp => {console.log(`success:${resp}`) })
    .catch(resp => { console.log(resp) })
  }

  useEffect( () => {
    // axios.get("workspace.json")
    // .then(resp => { 
    //   const data = resp.data.data
    //   setWorkspace(data)
    //   setTitle(data.title)
    //   //console.log(data)
    //   setLoaded(true)
    // })
    // .catch(resp => { console.log(resp)})

    //console.log("workspace:")
    axios.get("/api/v1/workspaces/1")
    .then( resp => { 
  
      const wsdata = resp.data.data
      //console.log(wsdata)

      const workspaceX = {
        title: wsdata.attributes.title,
        roadmap: wsdata.relationships.roadmap.data.id
      }

      setTitle(workspaceX.title)
      setWorkspace(workspaceX)

      console.log(workspaceX)

      setLoaded(true)
    })
    .catch( resp => console.log(resp))
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
