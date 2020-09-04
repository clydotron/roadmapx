import React, { useState, useEffect } from 'react';
import Roadmap from './../Roadmap/Roadmap'
import PlanningBoard from './../PlanningBoard/PlanningBoard'
import ParkingLot from './../ParkingLot/ParkingLot'
import axios from 'axios'

import ViewSelector from '../ViewSelector/ViewSelector.js'
//<ViewSelector view={view} allViews={allViews} onViewSelected={view => setView(view)}/>

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

    axios.get(`/api/v1/roadmaps/${roadmap_id}`)
    .then( resp => { setHasData(true) })
    .catch( resp => { console.log(resp)})
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
          <ViewSelector view={view} allViews={allViews} onViewSelected={view => setView(view)}/>
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