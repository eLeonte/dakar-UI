// Home.js
import React, { Component } from "react";
import "./App.css";

export class Home extends Component {
  render() {
    return (
      <div className="d-flex align-items-center min-vh-1000">
        <div className="container">
          <div className="row mt-5">
            <div className="col-12">
              <h5 className="section-title">
                Get started by pressing the "Project" button
              </h5>
            </div>
            <div className="col-12 mb-4 d-flex">
              {/* <img
                src="/Images/ProjectButton1.png"
                className="img-fluid me-3"
                alt="Screenshot 1"
              /> */}
              <p className="align-self-center"></p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">About the app</h5>
                  <p className="card-text">
                    Welcome to our project management platform designed
                    specifically for testing teams. <br /> This application
                    enables each tester to effortlessly create and organize test
                    plans.
                    <br />
                    You can generate comprehensive test cases with clear,
                    step-by-step instructions, ensuring thorough testing and
                    efficient workflow management. Start exploring and
                    streamline your testing process today!
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
