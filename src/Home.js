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

          {/* Getting Started Section */}
          <div className="row mt-5">
            <div className="col-12">
              <h5 className="section-title">
                Get Started by pressing the "Project" button
              </h5>
            </div>
            {/* <div className="col-12 mb-4 d-flex">
              <img
                src="/Images/ProjectPage.png"
                className="img-fluid me-3"
                alt="Screenshot 1"
              />
              <p className="align-self-center">Projects</p>
            </div> */}
            {/* <div className="col-md-6 mb-4 d-flex">
              <img
                src="/Images/TestCasePage.png"
                className="img-fluid me-3"
                alt="Screenshot 2"
              />
              <p className="align-self-center">Test Cases</p>
            </div> */}
            {/* <div className="col-md-6 mb-4 d-flex">
              <img
                src="/Images/TestSteps.png"
                className="img-fluid me-3"
                alt="Screenshot 3"
              />
              <p className="align-self-center">Test Steps</p>
            </div> */}

            {/* <div className="col-md-6 mb-4 d-flex">
              <img
                src="/Images/TestRunPage.png"
                className="img-fluid me-3"
                alt="Screenshot 4"
              />
              <p className="align-self-center">Test Run</p>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
