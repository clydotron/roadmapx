import React, { useState, useEffect } from 'react';
import Roadmap from './../Roadmap/Roadmap'
import PlanningBoard from './../PlanningBoard/PlanningBoard'
import ParkingLot from './../ParkingLot/ParkingLot'
import axios from 'axios'

//import ViewSelector from '../ViewSelector/ViewSelector.js'
//<ViewSelector view={view} allViews={allViews} onViewSelected={view => setView(view)}/>
const Workspace = (props) => {

  const allViews = {
    'Roadmap' : 'roadmap',
    'Planning board' : 'planning_board',
    'Parking lot' : 'parking_lot'
};

  // import the different views
  const [view,setView] = useState('roadmap');
  const [hasData,setHasData] = useState(false)
  useEffect(() => {
  
    axios.get("/api/v1/roadmaps/1")
    .then( resp => { 
      setHasData(true)
      console.log(resp)
    })
    .catch( resp => { console.log(resp)})
    
    console.log(props)
    },[])

  function renderCurrentView() {
    switch(view) {
      case 'roadmap':
        return <Roadmap />;

      case 'planning_board':
        return <PlanningBoard />;
      
      case 'parking_lot':
        return <ParkingLot />;
    }
  }

  return (
    <div className="Workspace">
    {
      hasData &&
      <div>
        <div className="Workspace-viewSelector">
          ViewSelector
        </div>
        <div className="Workspace-view">
          {renderCurrentView()}
        </div>  
      </div>
    }
    </div>
  )
}

export default Workspace;