import React, { useState, useEffect } from 'react';
import ViewSelector from '../ViewSelector/ViewSelector.js'
import RoadmapContainer from './../Roadmap/RoadmapContainer'
import PlanningBoard from './../PlanningBoard/PlanningBoard'
import ParkingLot from './../ParkingLot/ParkingLot'
import axios from 'axios'
import "./Workspace.css"

const Workspace = (props) => {

  const allViews = {
    'roadmap' : 'Roadmap',
    'planning_board' : 'Planning board',
    'parking_lot' : 'Parking lot'
  };

  // import the different views
  const [view,setView] = useState('roadmap');
  const [hasData,setHasData] = useState(false)

  useEffect(() => {
    const roadmap_id = props.workspace.roadmap

    setHasData(true)
    // not really sure why i am doing this...
   // axios.get(`/api/v1/roadmaps/${roadmap_id}`)
   // .then( resp => { setHasData(true) })
   // .catch( resp => { console.log(resp)})
  },[])

  function renderCurrentView() {

    switch(view) {
      case 'roadmap':
        return <RoadmapContainer />;

      case 'planning_board':
        return <PlanningBoard />;
      
      case 'parking_lot':
        return <ParkingLot />;
    }
    return null
  }

  const renderWorkspace = () => {
    if (!hasData) {
      return null;
    }
    return (
      <div className="ws-container">
        <div className="ws-viewSelector">
          <ViewSelector view={view} allViews={allViews} onViewSelected={view => setView(view)}/>
        </div>
        <div className="ws-view">
        {renderCurrentView()}
      </div>  
    </div>
    )
  }

  return renderWorkspace()
}

export default Workspace;