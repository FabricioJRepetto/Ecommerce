import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./test/fer/Home";
import Authetication from "./test/Authetication.jsx";

function App() {
  return (
    <div className="App">
      <div>
        <h1>e-commerce</h1>
        <Home />
        {/* <Authetication /> */}
      </div>
    </div>
  );
}

export default App;
