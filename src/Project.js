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
      projects: [],
      selectedProject: null,
      selectedProjectDescription: "",
      testCases: [],
      selectedTestCase: null,
      selectedTestCaseName: "",
      testCaseSteps: [],
      loading: true,
      error: null,
    };

    this.selectProject = this.selectProject.bind(this);
    this.fetchProjectDetails = this.fetchProjectDetails.bind(this);
    this.goBackToProjects = this.goBackToProjects.bind(this);
    this.selectTestCase = this.selectTestCase.bind(this);
    this.goBackToTestCases = this.goBackToTestCases.bind(this);
    this.addClick = this.addClick.bind(this);
    this.changeProjectDescription = this.changeProjectDescription.bind(this);
  }

  refreshList() {
    console.log("Fetching project list...");

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
      },
      () => {
        this.fetchTestCaseSteps(testCaseId);
      }
    );
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
    });
  }

  goBackToTestCases() {
    this.setState({ selectedTestCase: null, testCaseSteps: [] });
  }

  changeProjectDescription(p) {
    this.setState({ ProjectDescription: p.target.value });
  }

  addClick() {
    this.setState({
      modalTitle: "Add Project",
      ProjectId: 0,
      ProjectDescription: "",
    });
  }

  editClick(proj) {
    this.setState({
      modalTitle: "Edit Project",
      ProjectId: proj.ProjectId,
      ProjectDescription: proj.ProjectDescription,
    });
  }

  render() {
    const {
      modalTitle,
      ProjectId,
      ProjectDescription,
      projects,
      selectedProject,
      selectedProjectDescription,
      testCases,
      selectedTestCase,
      selectedTestCaseName,
      testCaseSteps,
      loading,
      error,
    } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="alert alert-danger">Error: {error.message}</div>;
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
          </div>
        );
      }

      return (
        <div className="container mt-4">
          <button
            onClick={this.goBackToProjects}
            className="btn btn-secondary mb-3"
          >
            Back to Projects
          </button>
          <h2>{selectedProjectDescription}</h2>
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>TestCaseId</th>
                <th>TestCaseName</th>
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
                </tr>
              ))}
            </tbody>
          </table>
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
                {ProjectId === 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.createClick()}
                  >
                    Create
                  </button>
                ) : null}
                {ProjectId !== 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.updateClick()}
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
