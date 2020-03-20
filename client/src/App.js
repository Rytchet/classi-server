import React from "react";
import AppNavbar from "./components/AppNavbar";
import CarList from "./components/CarList";

// Redux imports
import { Provider } from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AppNavbar />
        <CarList />
      </div>
    </Provider>
  );
}

export default App;
