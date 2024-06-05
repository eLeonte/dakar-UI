// Home.js
import React, { Component } from "react";
import "./App.css";

export class Home extends Component {
  render() {
    return (
      <div className="d-flex align-items-center min-vh-1000">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Welcome to the Home Page</h5>
                  <p className="card-text">
                    This web application is meant for organizing the Testing
                    Teams within the Project and for each Tester to be able to
                    generate a test plan in which he can have different test
                    cases with well-defined steps to follow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
