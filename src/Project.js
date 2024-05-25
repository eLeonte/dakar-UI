import React, { Component } from "react";
import { variables } from "./Variables.js";
import "./App.css";

export class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      selectedProject: null,
      selectedProjectDescription: "",
      testCases: [],
      loading: true,
      error: null,
    };

    this.selectProject = this.selectProject.bind(this);
    this.fetchProjectDetails = this.fetchProjectDetails.bind(this);
    this.goBackToProjects = this.goBackToProjects.bind(this);
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
      },
      () => {
        this.fetchProjectDetails(projectId);
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

  goBackToProjects() {
    this.setState({ selectedProject: null });
  }

  render() {
    const {
      projects,
      selectedProject,
      selectedProjectDescription,
      testCases,
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
                  <td>{tc.TestCaseName}</td>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
