import React from 'react';

import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ProgressBar from 'react-bootstrap/ProgressBar';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faBars } from '@fortawesome/free-solid-svg-icons';

import GridObject from './components/GridObject.jsx';
import FilterMenu from './components/FilterMenu.jsx';

function App() {
  return (
    <>
      <Jumbotron fluid className='museumtron mb-0'>
        <div className='title'>
          <h1>VIRTUAL MUSEUM</h1>
          <p>All your favourite museum objects in one place!</p>
        </div>
      </Jumbotron>
      <ProgressBar variant='primary' now={0} className='mb-4 page-progress' />
      <Container fluid>

        <Row>
          <Col md={4} lg={3}>
            <div className="sticky-top">
              <Card className="mb-2">
                <Card.Header>Global Search</Card.Header>
                <Card.Body>
                  <InputGroup>
                    <FormControl
                      placeholder="Search term or keyword"
                      aria-label="Search term or keyword"
                    />
                  </InputGroup>
                </Card.Body>
              </Card>
              <Card className="mb-2">
                <Card.Header>Filter</Card.Header>
                <FilterMenu />
              </Card>
            </div>
          </Col>
          <Col>
            <ButtonGroup>
              <Button variant="outline-dark" disabled>View: </Button>
              <OverlayTrigger overlay={
                <Tooltip>
                  View as grid
                </Tooltip>
              }>
                <Button variant="secondary" active>
                  <FontAwesomeIcon icon={faThLarge} />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger overlay={
                <Tooltip>
                  View as list
                </Tooltip>
              }>
                <Button variant="secondary">
                  <FontAwesomeIcon icon={faBars} />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
            <Row xs={2} md={2} lg={3}>
              <Col>
                <GridObject />
              </Col>
              <Col>
                <GridObject />
              </Col>
              <Col>
                <GridObject />
              </Col>
              <Col>
                <GridObject />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
