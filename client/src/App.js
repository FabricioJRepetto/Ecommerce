import "./App.css";
import { Routes, Route } from "react-router-dom";
import Authetication from "./components/common/Authetication";

function App() {
  return (
    <div className="App">
      <div>
        <h1>e-commerce</h1>
        <Authetication />
      </div>
    </div>
  );
}

export default App;
