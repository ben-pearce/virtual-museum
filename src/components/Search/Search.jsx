import React from 'react';
import { Helmet } from 'react-helmet';

import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';  
import InputGroup from 'react-bootstrap/InputGroup';

import Config from '../../museum.config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faBars
} from '@fortawesome/free-solid-svg-icons';

import { withRouter } from 'react-router-dom';

import ResultsGridView from '../Results/Grid/ResultsGrid';
import ResultsListView from '../Results/List/ResultsList';
import FilterMenu from './FilterMenu';
import QueryMenu from './QueryMenu';

class Search extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      resultsView: 'grid',
      resultsCount: null
    };

    this.searchQuery = null;
    this.filterOptions = null;

    this.handleUpdateQuery = this.handleUpdateQuery.bind(this);
    this.handleUpdateFilter = this.handleUpdateFilter.bind(this);
    this.handleUpdateResultsList = this.handleUpdateResultsList.bind(this);
  }

  updateResultsList() {
    const queryParams = new URLSearchParams();
    if(this.searchQuery !== null && this.searchQuery !== '') {
      queryParams.set('q', this.searchQuery);
    }

    if(this.filterOptions !== null) {
      for(const [param, value] of Object.entries(this.filterOptions)) {
        queryParams.set(param, Array.from(value).join(','));
      }
    }

    this.props.history.push({
      search: `?${queryParams.toString()}`
    });
  }

  handleUpdateQuery(q) {
    this.searchQuery = q;
    this.updateResultsList();
  }

  handleUpdateFilter(f) {
    this.filterOptions = f;
    this.updateResultsList();
  }

  handleUpdateResultsList(e) {
    this.setState({ resultsCount: e.count });
  }

  render() {
    return (
      <Row>
        <Helmet>
          <title>{this.searchQuery == null ? 
            `Search Results - ${Config.site.name}` : 
            `Search Results '${this.searchQuery}' - ${Config.site.name}`}
          </title>
        </Helmet>
        <Col md={4} lg={3} className='sidebar'>
          <div className='sticky-top'>
            <QueryMenu onSubmit={this.handleUpdateQuery} />
            <FilterMenu onSubmit={this.handleUpdateFilter} />
          </div>
        </Col>
        <Col>
          <ButtonGroup>
            <Button variant='outline-dark' disabled>View: </Button>
            <OverlayTrigger overlay={
              <Tooltip>
              View as grid
              </Tooltip>
            }>
              <Button 
                onClick={() => this.setState({ resultsView: 'grid' })}
                variant='secondary' 
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
                variant='secondary'
                active={this.state.resultsView == 'list'}>
                <FontAwesomeIcon icon={faBars} />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
          {this.state.resultsCount > 0 && 
            <span className='text-muted ml-2 fs-4'>{this.state.resultsCount} results</span>}
          <span className='float-right'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Sort By:</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control as='select'>
                <option>Relevance</option>
                <option>Alphabetical (asc)</option>
                <option>Alphabetical (dec)</option>
                <option>Date (asc)</option>
                <option>Date (dec)</option>
              </Form.Control>
            </InputGroup>
          </span>
          {this.searchQuery !== null && this.filterOptions !== null &&
            this.state.resultsView == 'grid' ? 
            <ResultsGridView 
              query={this.searchQuery} 
              onResults={this.handleUpdateResultsList} 
            /> : 
            <ResultsListView 
              query={this.searchQuery} 
              onResults={this.handleUpdateResultsList} 
            />}
        </Col>
      </Row>
    );
  }
}

export default withRouter(Search);