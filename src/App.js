import React, { Component } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import ky from "ky";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const endPoint = "https://api.spacexdata.com/v3/rockets";

const simplify = (api) =>
  api.map((r) => ({
    id: r.id,
    rocket_name: r.rocket_name,
    description: r.description,
    height: r.height.meters,
    engines: r.engines.number,
    wikipedia: r.wikipedia,
  }));

export default class App extends Component {
  state = {
    api: null,
    data: null,
  };

  componentDidMount() {
    this.loadData().then();
  }

  loadData = async () => {
    const api = await ky.post(endPoint).json();
    const data = simplify(api);
    this.setState({ data, api });
  };

  simplify = () => {
    this.setState({ data: simplify(this.state.api) });
  };

  original = () => {
    this.setState({ data: this.state.api });
  };

  render() {
    const { data, api } = this.state;
    if (data === null) return <Spinner animation="border" />;

    const rockets = data.map((r) => (
      <div className="rocket" key={r.id}>
        <div>
          Rocket Name: <strong>{r.rocket_name}</strong>
        </div>
        <div>
          Description: <strong>{r.description}</strong>
        </div>
        <div>
          Height: <strong>{r.height.meters || r.height} meters</strong>
        </div>
        <div>
          Engines: <strong>{r.engines.number || r.engines}</strong>
        </div>
        <div>
          Wikipedia Link:{" "}
          <strong>
            <a href={r.wikipedia} target="_blank" rel="noopener noreferrer">
              {r.wikipedia}
            </a>
          </strong>
        </div>
      </div>
    ));

    return (
      <React.Fragment>
        <Helmet>
          <title>SpaceX API Demo</title>
        </Helmet>
        <Container>
          <Row>
            <Col>
              <h1>SpaceX Rockets:</h1>
            </Col>
          </Row>
          <Row>
            <Col>{rockets}</Col>
          </Row>
          <Row>
            <Col>
              <h1>Raw data from {endPoint}:</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onClick={
                  JSON.stringify(api) === JSON.stringify(data)
                    ? this.simplify
                    : this.original
                }
                size="sm"
                variant="primary"
                className="mb-2"
              >
                {JSON.stringify(api) === JSON.stringify(data)
                  ? "Show Simplified Data"
                  : "Show Original Data"}
              </Button>
              <SyntaxHighlighter
                className="narrow"
                language="json"
                style={monokai}
              >
                {JSON.stringify(data, null, 4)}
              </SyntaxHighlighter>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
