import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
} from "react-router-dom";
import { Home } from "./Home";
import { Project } from "./Project";
import "./App.css";

const AppContent = ({ handleProjectButtonClick, isProjectButtonPressed }) => {
  const location = useLocation();

  return (
    <div className="container mt-4">
      <h2 className="text-center">Dakar Testing App</h2>
      <div className="button-container">
        {location.pathname !== "/" && (
          <Link className="btn btn-primary mx-2" to="/">
            Home Page
          </Link>
        )}
        {location.pathname !== "/project" && (
          <Link
            className={`btn btn-primary mx-2 ${
              isProjectButtonPressed ? "btn-pressed" : ""
            }`}
            to="/project"
            onClick={handleProjectButtonClick}
          >
            Projects
          </Link>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </div>
  );
};

const App = () => {
  const [isProjectButtonPressed, setIsProjectButtonPressed] = useState(false);

  const handleProjectButtonClick = () => {
    setIsProjectButtonPressed(true);
  };

  return (
    <Router>
      <div className="App">
        <AppContent
          handleProjectButtonClick={handleProjectButtonClick}
          isProjectButtonPressed={isProjectButtonPressed}
        />
      </div>
    </Router>
  );
};

export default App;
