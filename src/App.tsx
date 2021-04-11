import React from "react";
import "./App.css";
import { ServicesContextProvider } from "./context/ServiceContext";
import RegionDropdown from "./components/RegionDropdown/RegionDropdown";

function App() {
  return (
    <ServicesContextProvider>
      <div className="App">
        <RegionDropdown />
      </div>
    </ServicesContextProvider>
  );
}

export default App;
