import React, { Component } from "react";
import { variables } from "./Variables.js";

export class CreateTestRun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testRunDescription: "",
    };

    this.changeTestRunDescription = this.changeTestRunDescription.bind(this);
    this.createTestRun = this.createTestRun.bind(this);
  }

  changeTestRunDescription(e) {
    this.setState({ testRunDescription: e.target.value });
  }

  createTestRun() {
    const { selectedProject } = this.props;

    fetch(variables.API_URL + "testrun", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ProjectID: selectedProject,
        TestRunDescription: this.state.testRunDescription,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Create Test Run response:", result);
          if (result.message) {
            alert(result.message);
          } else {
            alert("Test run created successfully");
          }
          this.setState({ testRunDescription: "" });
          // Optionally, navigate back to the project details or test runs list
        },
        (error) => {
          console.error("Create Test Run error:", error);
          alert("Failed to create test run");
        }
      );
  }

  render() {
    return (
      <div className="container mt-4">
        <h2>Create Test Run</h2>
        <div className="mb-3">
          <label className="form-label">Test Run Description</label>
          <input
            type="text"
            className="form-control"
            value={this.state.testRunDescription}
            onChange={this.changeTestRunDescription}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.createTestRun}
        >
          Create Test Run
        </button>
      </div>
    );
  }
}

export default CreateTestRun;
