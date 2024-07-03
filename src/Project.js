import React, { Component } from "react";
import { variables } from "./Variables.js";
import "./App.css";

export class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalTitle: "",
      ProjectId: 0,
      ProjectDescription: "",
      TestCaseId: 0,
      TestCaseName: "",
      StepDescription: "",
      ExpectedResult: "",
      projects: [],
      selectedProject: null,
      selectedProjectDescription: "",
      testCases: [],
      selectedTestCase: null,
      selectedTestCaseName: "",
      testCaseSteps: [],
      loading: true,
      error: null,
      isTestRunMode: false,
      testRunStatus: {},
    };

    this.selectProject = this.selectProject.bind(this);
    this.fetchProjectDetails = this.fetchProjectDetails.bind(this);
    this.goBackToProjects = this.goBackToProjects.bind(this);
    this.selectTestCase = this.selectTestCase.bind(this);
    this.goBackToTestCases = this.goBackToTestCases.bind(this);
    this.addClick = this.addClick.bind(this);
    this.editClick = this.editClick.bind(this);
    this.changeProjectDescription = this.changeProjectDescription.bind(this);
    this.addTcClick = this.addTcClick.bind(this);
    this.editTcClick = this.editTcClick.bind(this);
    this.changeTestCaseName = this.changeTestCaseName.bind(this);
    this.addStepClick = this.addStepClick.bind(this);
    this.changeStepDescription = this.changeStepDescription.bind(this);
    this.changeExpectedResult = this.changeExpectedResult.bind(this);
    this.handleNewTestRun = this.handleNewTestRun.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  refreshList() {
    fetch(variables.API_URL + "project")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ projects: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
        console.error("Fetch error:", error);
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  selectProject(projectId, projectDescription) {
    this.setState(
      {
        selectedProject: projectId,
        selectedProjectDescription: projectDescription,
        loading: true,
        error: null,
        selectedTestCase: null,
        testCaseSteps: [],
        isTestCaseView: false,
        isTestRunMode: false,
      },
      () => {
        this.fetchProjectDetails(projectId);
      }
    );
  }

  selectTestCase(testCaseId, testCaseName) {
    this.setState(
      {
        selectedTestCase: testCaseId,
        selectedTestCaseName: testCaseName,
        loading: true,
        error: null,
        isTestCaseView: true,
      },
      () => {
        this.fetchTestCaseSteps(testCaseId);
      }
    );
  }

  goBackToTestCases() {
    this.setState({
      selectedTestCase: null,
      testCaseSteps: [],
      isTestCaseView: false,
    });
  }

  handleNewTestRun() {
    this.setState({
      isTestRunMode: true,
      selectedTestCase: null,
      testCaseSteps: [],
    });
  }

  goBack() {
    if (this.state.isTestRunMode) {
      this.setState({
        isTestRunMode: false,
        selectedTestCase: null,
        testCaseSteps: [],
      });
    } else if (this.state.isTestCaseView) {
      this.goBackToTestCases();
    } else {
      this.setState({
        selectedProject: null,
        selectedTestCase: null,
        testCaseSteps: [],
      });
    }
  }

  fetchProjectDetails(projectId) {
    fetch(variables.API_URL + `TestCase/${projectId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ testCases: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
        console.error("Fetch error:", error);
      });
  }

  fetchTestCaseSteps(testCaseId) {
    fetch(variables.API_URL + `TestCaseSteps/${testCaseId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ testCaseSteps: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
        console.error("Fetch error:", error);
      });
  }

  goBackToProjects() {
    this.setState({
      selectedProject: null,
      selectedTestCase: null,
      testCaseSteps: [],
      isTestRunMode: false, // Reset test run mode
    });
  }

  // Add, Update and Delete Projects Functions
  changeProjectDescription(p) {
    this.setState({ ProjectDescription: p.target.value });
  }

  addClick() {
    this.setState({
      modalTitle: "Add Project",
      ProjectID: 0,
      ProjectDescription: "",
    });
  }

  editClick(proj) {
    this.setState({
      modalTitle: "Edit Project",
      ProjectID: proj.ProjectID,
      ProjectDescription: proj.ProjectDescription,
    });
  }

  createProject() {
    if (!this.state.ProjectDescription.trim()) {
      alert("Project description cannot be empty.");
      return;
    }
    fetch(variables.API_URL + "project", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ProjectDescription: this.state.ProjectDescription,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Create response:", result);
          if (result.message) {
            alert(result.message);
          } else {
            alert("Project created successfully");
          }
          this.refreshList();
          document.querySelector("#exampleModal .btn-close").click();
        },
        (error) => {
          console.error("Create error:", error);
          alert("Failed to create project");
        }
      );
  }

  updateProject() {
    console.log(
      "Updating project with ID:",
      this.state.ProjectId,
      "and description:",
      this.state.ProjectDescription
    );

    if (!this.state.ProjectDescription.trim()) {
      alert("Project description cannot be empty.");
      return;
    }
    fetch(variables.API_URL + "project", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ProjectID: this.state.ProjectID,
        ProjectDescription: this.state.ProjectDescription,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Update response:", result);
          if (result.message) {
            alert(result.message);
          } else {
            alert("Project updated successfully");
          }
          this.refreshList();
          document.querySelector("#exampleModal .btn-close").click();
        },
        (error) => {
          console.error("Update error:", error);
          alert("Failed to update project");
        }
      );
  }

  deleteProject(id) {
    if (
      window.confirm(
        "Are you sure? Test cases related to this project will also be removed."
      )
    ) {
      fetch(variables.API_URL + "project/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("Update response:", result);
            if (result.message) {
              alert(result.message);
            } else {
              alert("Project deleted successfully");
            }
            this.refreshList();
          },
          (error) => {
            console.error("Update error:", error);
            alert("Failed to delete the project");
          }
        );
    }
  }

  // Add, Update and Delete Test Case Functions
  addTcClick() {
    this.setState({
      modalTitle: "Add Test Case",
      TestCaseId: 0,
      TestCaseName: "",
      ProjectId: this.state.selectedProject,
    });
  }

  changeTestCaseName(e) {
    this.setState({ TestCaseName: e.target.value });
  }

  editTcClick(tc) {
    this.setState({
      modalTitle: "Edit Test Case",
      TestCaseId: tc.TestCaseId,
      TestCaseName: tc.TestCaseName,
    });
  }

  createTcClick() {
    if (!this.state.TestCaseName.trim()) {
      alert("TestCase description cannot be empty.");
      return;
    }
    fetch(variables.API_URL + "TestCase", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TestCaseName: this.state.TestCaseName,
        ProjectID: this.state.ProjectId,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Create response:", result);
          if (result.message) {
            alert(result.message);
          } else {
            alert("Test Case created successfully");
          }
          this.fetchProjectDetails(this.state.selectedProject);
          document.querySelector("#testCaseModal .btn-close").click();
        },
        (error) => {
          console.error("Create error:", error);
          alert("Failed to create the test case");
        }
      );
  }

  updateTcClick() {
    console.log(
      "Updating test case with ID:",
      this.state.TestCaseId,
      "and description:",
      this.state.TestCaseName
    );

    if (!this.state.TestCaseName.trim()) {
      alert("TestCase description cannot be empty.");
      return;
    }
    fetch(variables.API_URL + "TestCase", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TestCaseId: this.state.TestCaseId,
        TestCaseName: this.state.TestCaseName,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Update response:", result);
          if (result.message) {
            alert(result.message);
          } else {
            alert("Test Case updated successfully");
          }
          this.fetchProjectDetails(this.state.selectedProject);
          document.querySelector("#testCaseModal .btn-close").click();
        },
        (error) => {
          console.error("Update error:", error);
          alert("Failed to update the test case");
        }
      );
  }

  deleteTcClick(id) {
    if (window.confirm("Are you sure?")) {
      fetch(variables.API_URL + "testcase/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("Update response:", result);
            if (result.message) {
              alert(result.message);
            } else {
              alert("Test Case deleted successfully");
            }
            this.fetchProjectDetails(this.state.selectedProject);
            document.querySelector("#testCaseModal .btn-close").click();
          },
          (error) => {
            console.error("Update error:", error);
            alert("Failed to delete the test case");
          }
        );
    }
  }

  // Add, Update and Delete Test Case Step Functions
  addStepClick() {
    this.setState({
      modalTitle: "Add Test Case Step",
      StepID: 0,
      ScenarioID: 0,
      StepOrder: 0,
      StepDescription: "",
      ExpectedResult: "",
      TestCaseName: "",
    });
  }

  editStepClick(ts) {
    this.setState({
      modalTitle: "Edit Test Step",
      StepDescription: ts.StepDescription,
      ExpectedResult: ts.ExpectedResult,
      StepID: ts.StepID,
      TestCaseName: "",
    });
  }

  changeStepDescription(s) {
    this.setState({ StepDescription: s.target.value });
  }

  changeExpectedResult(s) {
    this.setState({ ExpectedResult: s.target.value });
  }

  createTcStepClick() {
    if (
      !this.state.StepDescription.trim() ||
      !this.state.ExpectedResult.trim()
    ) {
      alert("There are empty fields.");
      return;
    }
    fetch(variables.API_URL + "TestCaseSteps", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ScenarioID: this.state.selectedTestCase,
        StepOrder: 1,
        StepDescription: this.state.StepDescription,
        ExpectedResult: this.state.ExpectedResult,
        TestCaseName: "",
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Create response:", result);
          if (result.message) {
            alert(result.message);
          } else {
            alert("Test Case Step created successfully");
          }
          this.fetchTestCaseSteps(this.state.selectedTestCase);
          document.querySelector("#testCaseStepsModal .btn-close").click();
        },
        (error) => {
          console.error("Create error:", error);
          alert("Failed to create the test case step");
        }
      );
  }

  updateTcStepClick() {
    if (
      !this.state.StepDescription.trim() ||
      !this.state.ExpectedResult.trim()
    ) {
      alert("There are empty fields.");
      return;
    }
    fetch(variables.API_URL + "TestCaseSteps", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StepDescription: this.state.StepDescription,
        ExpectedResult: this.state.ExpectedResult,
        StepID: this.state.StepID,
        TestCaseName: "",
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Update response:", result);
          if (result.message) {
            alert(result.message);
          } else {
            alert("Test Step updated successfully");
          }
          this.fetchTestCaseSteps(this.state.selectedTestCase);
          document.querySelector("#testCaseStepsModal .btn-close").click();
        },
        (error) => {
          console.error("Update error:", error);
          alert("Failed to update the test step");
        }
      );
  }

  deleteStepClick(id, stepID) {
    if (window.confirm("Are you sure?")) {
      fetch(`${variables.API_URL}TestCaseSteps/${id}/${stepID}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("Update response:", result);
            if (result.message) {
              alert(result.message);
            } else {
              alert("Test step deleted successfully");
            }
            this.fetchTestCaseSteps(this.state.selectedTestCase);
            document.querySelector("#testCaseStepsModal .btn-close").click();
          },
          (error) => {
            console.error("Update error:", error);
            alert("Failed to delete the test step");
          }
        );
    }
  }

  generateReport() {
    const { testCases, testRunStatus, selectedProjectDescription } = this.state;
    const reportData = testCases.map((tc) => ({
      TestCaseId: tc.TestCaseId,
      TestCaseName: tc.TestCaseName,
      Status: testRunStatus[tc.TestCaseId] || "Untested",
    }));

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Facem conversie din raport in date html
    const reportHtml = `
      <html>
        <head>
          <title>Test Report</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .status-circle {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              display: inline-block;
              margin-right: 8px;
            }
            .status-passed {
              background-color: green;
            }
            .status-failed {
              background-color: red;
            }
            .status-blocked {
              background-color: blue;
            }
            .status-retest {
              background-color: yellow;
            }
            .status-untested {
              background-color: gray;
            }
          </style>
        </head>
        <body>
          <h1>Test Report</h1>
          <p>Date: ${formattedDate}</p>
          <p>Project: ${selectedProjectDescription}</p>
          <table>
            <thead>
              <tr>
                <th>TestCaseId</th>
                <th>TestCaseName</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reportData
                .map(
                  (tc) => `
                <tr>
                  <td>${tc.TestCaseId}</td>
                  <td>${tc.TestCaseName}</td>
                  <td>
                    <span class="status-circle status-${tc.Status.toLowerCase()}"></span>
                    ${tc.Status}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Deschidem o noua fereastra si scriem raportul HTML
    const reportWindow = window.open("", "_blank");
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();

    reportWindow.print();
  }

  handleStatusChange(testCaseId, event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      testRunStatus: {
        ...prevState.testRunStatus,
        [testCaseId]: value,
      },
    }));
  }

  render() {
    const {
      modalTitle,
      ProjectID,
      ProjectDescription,
      TestCaseId,
      TestCaseName,
      StepDescription,
      ExpectedResult,
      projects,
      selectedProject,
      selectedProjectDescription,
      testCases,
      selectedTestCase,
      selectedTestCaseName,
      testCaseSteps,
      loading,
      error,
      isTestRunMode,
      testRunStatus,
    } = this.state;

    const getStatusClass = (status) => {
      switch (status) {
        case "Passed":
          return "status-circle status-passed";
        case "Failed":
          return "status-circle status-failed";
        case "Blocked":
          return "status-circle status-blocked";
        case "Retest":
          return "status-circle status-retest";
        default:
          return "status-circle";
      }
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
    }

    // Daca proiectul este selectat si Test Run este activ
    if (isTestRunMode && selectedProject) {
      if (selectedTestCase) {
        return (
          <div className="container mt-4">
            <button
              onClick={this.goBackToTestCases}
              className="btn btn-secondary mb-3"
            >
              Back to Test Run
            </button>
            <h2>{selectedTestCaseName}</h2>
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>StepId</th>
                  <th>Test Step</th>
                  <th>Expected Result</th>
                </tr>
              </thead>
              <tbody>
                {testCaseSteps.map((step) => (
                  <tr key={step.StepID}>
                    <td>{step.StepID}</td>
                    <td>{step.StepDescription}</td>
                    <td>{step.ExpectedResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal Test Case Steps */}
            <div
              className="modal fade"
              id="testCaseStepsModal"
              tabIndex="-1"
              aria-labelledby="testCaseStepModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="testCaseStepModalLabel">
                      {modalTitle}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Step description</span>
                      <input
                        type="text"
                        className="form-control"
                        value={StepDescription}
                        onChange={this.changeStepDescription}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Expected result</span>
                      <input
                        type="text"
                        className="form-control"
                        value={ExpectedResult}
                        onChange={this.changeExpectedResult}
                      />
                    </div>
                    {this.state.StepID === 0 ? (
                      <button
                        type="button"
                        className="btn btn-primary float-start"
                        onClick={() => this.createTcStepClick()}
                      >
                        Create
                      </button>
                    ) : null}
                    {this.state.StepID !== 0 ? (
                      <button
                        type="button"
                        className="btn btn-primary float-start"
                        onClick={() => this.updateTcStepClick()}
                      >
                        Update
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="container mt-4">
          <div className="button-group">
            <button
              onClick={() => this.goBack()}
              className="btn btn-secondary mb-3"
            >
              Back
            </button>
            <button
              onClick={() => this.generateReport()}
              className="btn btn-primary mb-3"
            >
              Generate Report
            </button>
          </div>
          <h2>{selectedProjectDescription}</h2>
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>TestCaseName</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((tc) => (
                <tr key={tc.TestCaseId}>
                  <td>
                    <a
                      href="#"
                      onClick={() =>
                        this.selectTestCase(tc.TestCaseId, tc.TestCaseName)
                      }
                    >
                      {tc.TestCaseName}
                    </a>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <span
                        className={getStatusClass(testRunStatus[tc.TestCaseId])}
                      ></span>
                      <select
                        className="form-select"
                        value={testRunStatus[tc.TestCaseId] || ""}
                        onChange={(event) =>
                          this.handleStatusChange(tc.TestCaseId, event)
                        }
                      >
                        <option value="">Untested</option>
                        <option value="Passed">Passed</option>
                        <option value="Failed">Failed</option>
                        <option value="Blocked">Blocked</option>
                        <option value="Retest">Retest</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedProject) {
      if (selectedTestCase) {
        return (
          <div className="container mt-4">
            <button
              onClick={this.goBackToTestCases}
              className="btn btn-secondary mb-3"
            >
              Back to Test Cases
            </button>
            <h4>{selectedTestCaseName}</h4>
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>StepId</th>
                  <th>Test Step</th>
                  <th>Expected Result</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {testCaseSteps.map((step) => (
                  <tr key={step.StepID}>
                    <td>{step.StepID}</td>
                    <td>{step.StepDescription}</td>
                    <td>{step.ExpectedResult}</td>
                    <td>
                      {" "}
                      <button
                        type="button"
                        className="btn btn-light custom-margin-right"
                        data-bs-toggle="modal"
                        data-bs-target="#testCaseStepsModal"
                        onClick={() => this.editStepClick(step)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn btn-light custom-margin-right"
                        onClick={() =>
                          this.deleteStepClick(step.TestCaseId, step.StepID)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" className="text-center">
                    <button
                      type="button"
                      className="btn btn-primary wide-button new-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#testCaseStepsModal"
                      onClick={this.addStepClick}
                    >
                      + New
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              className="modal fade"
              id="testCaseStepsModal"
              tabIndex="-1"
              aria-labelledby="testCaseStepModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="testCaseStepModalLabel">
                      {modalTitle}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Step description</span>
                      <input
                        type="text"
                        className="form-control"
                        value={StepDescription}
                        onChange={this.changeStepDescription}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Expected result</span>
                      <input
                        type="text"
                        className="form-control"
                        value={ExpectedResult}
                        onChange={this.changeExpectedResult}
                      />
                    </div>
                    {this.state.StepID === 0 ? (
                      <button
                        type="button"
                        className="btn btn-primary float-start"
                        onClick={() => this.createTcStepClick()}
                      >
                        Create
                      </button>
                    ) : null}
                    {this.state.StepID !== 0 ? (
                      <button
                        type="button"
                        className="btn btn-primary float-start"
                        onClick={() => this.updateTcStepClick()}
                      >
                        Update
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="container mt-4">
          <div className="button-group">
            <button
              onClick={this.goBackToProjects}
              className="btn btn-secondary mb-3"
            >
              Back to Projects
            </button>
            <button
              type="button"
              className="btn btn-primary mb-3"
              data-bs-toggle="modal"
              data-bs-target="#testCaseModal"
              onClick={this.addTcClick}
            >
              + New
            </button>

            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={() => this.setState({ isTestRunMode: true })}
            >
              Test Run
            </button>
          </div>
          <h4>{selectedProjectDescription}</h4>
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>TestCaseId</th>
                <th>TestCaseName</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((tc) => (
                <tr key={tc.TestCaseId}>
                  <td>{tc.TestCaseId}</td>
                  <td>
                    <a
                      href="#"
                      onClick={() =>
                        this.selectTestCase(tc.TestCaseId, tc.TestCaseName)
                      }
                    >
                      {tc.TestCaseName}
                    </a>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-light custom-margin-right"
                      data-bs-toggle="modal"
                      data-bs-target="#testCaseModal"
                      onClick={() => this.editTcClick(tc)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light custom-margin-right"
                      onClick={() => this.deleteTcClick(tc.TestCaseId)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Test Case Modal */}
          <div
            className="modal fade"
            id="testCaseModal"
            tabIndex="-1"
            aria-labelledby="testCaseModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="testCaseModalLabel">
                    {modalTitle}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="input-group mb-3">
                    <span className="input-group-text">TestCase Name</span>
                    <input
                      type="text"
                      className="form-control"
                      value={TestCaseName}
                      onChange={this.changeTestCaseName}
                    />
                  </div>
                  {TestCaseId === 0 ? (
                    <button
                      type="button"
                      className="btn btn-primary float-start"
                      onClick={() => this.createTcClick()}
                    >
                      Create
                    </button>
                  ) : null}
                  {TestCaseId !== 0 ? (
                    <button
                      type="button"
                      className="btn btn-primary float-start"
                      onClick={() => this.updateTcClick()}
                    >
                      Update
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mt-4">
        <h2>Projects</h2>
        <div className="row justify-content-center">
          {projects.map((prj) => (
            <div
              key={prj.ProjectID}
              className="col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{prj.ProjectDescription}</h5>
                  <button
                    onClick={() =>
                      this.selectProject(prj.ProjectID, prj.ProjectDescription)
                    }
                    className="btn btn-primary mt-auto"
                  >
                    Open
                  </button>
                  <div className="btn-group mt-2" role="group">
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => this.editClick(prj)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light mr-1"
                      onClick={() => this.deleteProject(prj.ProjectID)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => this.addClick()}
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {modalTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">ProjectName</span>
                  <input
                    type="text"
                    className="form-control"
                    value={ProjectDescription}
                    onChange={this.changeProjectDescription}
                  />
                </div>
                {ProjectID === 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.createProject()}
                  >
                    Create
                  </button>
                ) : null}
                {ProjectID !== 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.updateProject()}
                  >
                    Update
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
