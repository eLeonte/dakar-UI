import React, { Component } from "react";
import { variables } from "./Variables.js";

export class ProjectDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { projectId } = this.props.match.params;
    this.fetchProjectDetails(projectId);
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
        this.setState({ project: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
        console.error("Fetch error:", error);
      });
  }

  render() {
    const { project, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <div>
        <h1>{project.ProjectName}</h1>
        <p>{project.ProjectDescription}</p>
        {/* Add more fields as necessary */}
      </div>
    );
  }
}
