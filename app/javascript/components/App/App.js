import React from 'react';
import logo from './../../../assets/images/pp_logo.svg'
import './App.css';
import TitleBar from '../TitleBar/TitleBar';
import Workspace from '../Workspace/Workspace';

function App() {
  return (
    <div className="App">
      <TitleBar title={"Candidate Homework"} />
      <Workspace />
    </div>
  );
}

export default App
