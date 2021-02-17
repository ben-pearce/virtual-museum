import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faBars } from '@fortawesome/free-solid-svg-icons';

import ResultsGridView from '../Results/Grid/ResultsGridView';
import ResultsListView from '../Results/List/ResultsListView';
import FilterMenu from '../FilterMenu';

class Search extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      resultsView: 'grid'
    };
  }

  render() {
    return (
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
              <Button 
                onClick={() => this.setState({ resultsView: 'grid' })}
                variant="secondary" 
                active={this.state.resultsView == 'grid'}>
                <FontAwesomeIcon icon={faThLarge} />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger overlay={
              <Tooltip>
              View as list
              </Tooltip>
            }>
              <Button 
                onClick={() => this.setState({ resultsView: 'list' })}
                variant="secondary"
                active={this.state.resultsView == 'list'}>
                <FontAwesomeIcon icon={faBars} />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
          {this.state.resultsView == 'grid' ? <ResultsGridView/> : <ResultsListView/>}
        </Col>
      </Row>
    );
  }
}

export default Search;