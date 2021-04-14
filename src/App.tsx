import React, { useState } from "react";
import "./App.css";
import { ServicesContextProvider } from "./context/ServiceContext";
import RegionDropdown from "./components/RegionDropdown/RegionDropdown";
import TypesList from "./components/TypesList/TypesList";

function App() {
  const [region, setRegion] = useState<string | null>(null);
  return (
    <ServicesContextProvider>
      <div className="App">
        <RegionDropdown regionChanged={setRegion} />
        {region && <TypesList regionID={region} />}
      </div>
    </ServicesContextProvider>
  );
}

export default App;
