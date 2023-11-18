import React, { useState } from 'react';
import '../styles/App.css'; // Import the CSS file for App
//import dotenv from 'dotenv';

import MainContainer from './MainContainer';
import SideContainer from './SideContainer';

//dotenv.config(); 
const apiKey = process.env.REACT_APP_APIKey; // Your OpenWeatherMap API key here
console.log(apiKey);

function App() {
  /*
  STEP 1: Use state to manage city data.
  
  React uses 'state' to handle dynamic data. In this app, you need to keep track of the selected city 
  because multiple components are interested in this data (both MainContainer and SideContainer).

  Use the 'useState' hook to create a state variable (e.g., 'selectedCity') and its corresponding setter 
  function (e.g., 'setSelectedCity'). The initial state can be an empty object or null.
  */
  
  
  /*
  STEP 2: Create a function to update the city data in the state.
  
  The selected city changes based on user interaction in the SideContainer component. You need a function 
  that takes city data as its argument and uses the setter function from the 'useState' hook to update the 
  state of the selected city. This function will be passed to SideContainer as a prop.
  */
  
  const [selectedCity, setSelectedCity] = useState(null);

  const updateSelectedCity = (newCityData) => {
    setSelectedCity(newCityData)
  };
  
  return (
    <div className="app-container">
      {/* 
      STEP 3: Connect Components through Props.
      
      Pass the setter function you created as a prop to 'SideContainer'. This allows SideContainer to update 
      the state in this App component. Name this prop something like 'setSelectedCity'.
      
      For the 'MainContainer' component, pass the state variable containing the selected city's data. This 
      allows MainContainer to display the weather for the selected city.
      */}
      
      <MainContainer selectedCity = {selectedCity} apiKey={apiKey} /* Pass the selected city data as props to 'MainContainer' */ />
      <SideContainer updateSelectedCity = {updateSelectedCity} apiKey={apiKey} /* Pass the city data update function as a prop to 'SideContainer' */ />
    </div>
  );
}

export default App;