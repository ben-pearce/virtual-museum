import React from 'react';
import { Helmet } from 'react-helmet';

import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import Config from '../../museum.config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faBars,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

import { withRouter } from 'react-router-dom';

import ResultsGridView from '../Results/Grid/ResultsGridView';
import ResultsListView from '../Results/List/ResultsListView';
import FilterMenu from './FilterMenu';

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
  }

  updateResultsList() {  
    const queryBox = document.getElementById('search-query');
    let searchQuery = queryBox.value;

    let queryParams = new URLSearchParams();
    if(searchQuery !== '') {
      queryParams.set('q', searchQuery);
    }

    this.props.history.push({
      search: `?${queryParams.toString()}`
    });
  }

  onResultsListUpdated(e) {
    this.setState({ resultsCount: e.count });
  }

  render() {
    let queryParams = new URLSearchParams(this.props.location.search);
    let searchQuery = queryParams.get('q');

    return (
      <Row>
        <Helmet>
          <title>{searchQuery == null ? 
            `Search Results - ${Config.site.name}` : 
            `Search Results '${searchQuery}' - ${Config.site.name}`}
          </title>
        </Helmet>
        <Col md={4} lg={3} className='sidebar'>
          <div className='sticky-top'>
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faSearch}/> Global Search</Card.Header>
              <Card.Body>
                <InputGroup>
                  <FormControl
                    id='search-query'
                    placeholder='Search term or keyword'
                    aria-label='Search term or keyword'
                    defaultValue={searchQuery}
                    onKeyUp={e => { if(e.keyCode === 13) { this.updateResultsList(); }}}
                  />
                  <InputGroup.Append>
                    <Button 
                      variant='outline-secondary'
                      onClick={this.updateResultsList.bind(this)}
                    ><FontAwesomeIcon icon={faSearch} /></Button>
                  </InputGroup.Append>
                </InputGroup>
              </Card.Body>
            </Card>
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faFilter} /> Filter</Card.Header>
              <FilterMenu />
            </Card>
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
          {this.state.resultsCount && 
            <span className='text-muted ml-2 fs-4'>
              {this.state.resultsCount > 0 ? `${this.state.resultsCount} results` : 'No results'}
            </span>}
          {this.state.resultsView == 'grid' ? 
            <ResultsGridView query={searchQuery} onResults={this.onResultsListUpdated.bind(this)} /> : 
            <ResultsListView query={searchQuery} onResults={this.onResultsListUpdated.bind(this)} />}
        </Col>
      </Row>
    );
  }
}

export default withRouter(Search);