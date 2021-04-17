import React, { useState } from "react";
import "./App.css";
import { ServicesContextProvider } from "./context/ServiceContext";
import RegionDropdown from "./components/RegionDropdown/RegionDropdown";
import TypesList from "./components/TypesList/TypesList";
import PriceList from "./components/PriceList/PriceList";

function App() {
  const [region1, setRegion1] = useState<string | null>(null);
  const [region2, setRegion2] = useState<string | null>(null);
  return (
    <ServicesContextProvider>
      <div className="App">
        <RegionDropdown regionChanged={setRegion1} />
        <RegionDropdown regionChanged={setRegion2} />
        {region1 && region2 && (
          <PriceList region1={region1} region2={region2} />
        )}
      </div>
    </ServicesContextProvider>
  );
}

export default App;
