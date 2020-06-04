import React, { Component } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import ky from "ky";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./App.css";

const endPoint = "https://api.spacexdata.com/v3/rockets";

export default class App extends Component {
  state = {
    data: null,
  };

  componentDidMount() {
    this.loadData().then();
  }

  loadData = async () => {
    const data = await ky.post(endPoint).json();
    this.setState({ data });
  };

  render() {
    const { data } = this.state;
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
          Height: <strong>{r.height.meters} meters</strong>
        </div>
        <div>
          Engines: <strong>{r.engines.number}</strong>
        </div>
        <div>
          Wikipedia Link:{" "}
          <strong>
            <a href={r.wikipedia} target="_blank">
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
              <h1>Rockets:</h1>
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
