import React from "react";
import AppNavbar from "./components/AppNavbar";
import CarList from "./components/CarList";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <AppNavbar />
      <CarList />
    </div>
  );
}

export default App;
