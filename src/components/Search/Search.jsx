import React from 'react';
import { Helmet } from 'react-helmet';

import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Config from '../../museum.config';

import { withRouter } from 'react-router-dom';

import ResultsGridView from '../Results/Grid/ResultsGrid';
import ResultsListView from '../Results/List/ResultsList';
import FilterMenu from './Filter';
import QueryMenu from './Query';
import ViewSwitchMenu from './ViewSwitch';
import SortMenu from './Sort';

class Search extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      resultsCount: null
    };

    this.view = null;
    this.query = null;
    this.filter = null;
    this.sort = null;

    this.handleUpdateQuery = this.handleUpdateQuery.bind(this);
    this.handleUpdateFilter = this.handleUpdateFilter.bind(this);
    this.handleUpdateView = this.handleUpdateView.bind(this);
    this.handleUpdateSort = this.handleUpdateSort.bind(this);
    this.handleUpdateResultsList = this.handleUpdateResultsList.bind(this);
  }

  updateResultsList() {
    const searchParams = new URLSearchParams();
    if(this.query !== null && this.query !== '') {
      searchParams.set('q', this.query);
    }

    if(this.filter !== null) {
      for(const [key, values] of Object.entries(this.filter)) {
        if(values instanceof Set) {
          for(const value of values) {
            searchParams.append(key, value);
          }
        } else if(values instanceof Object) {
          for(const [option, value] of Object.entries(values)) {
            const param = `${key}[${option}]`;
            searchParams.set(param, value);
          }
        }
      }
    }

    if(this.view !== 'grid') {
      searchParams.set('view', this.view);
    }

    if(this.sort !== '0') {
      searchParams.set('sort', this.sort);
    }

    this.props.history.push({
      search: `?${searchParams.toString()}`
    });
  }

  handleUpdateQuery(q) {
    this.query = q;
    this.updateResultsList();
  }

  handleUpdateFilter(f) {
    this.filter = f;
    this.updateResultsList();
  }

  handleUpdateView(v) {
    this.view = v;
    this.updateResultsList();
  }

  handleUpdateSort(s) {
    this.sort = s;
    this.updateResultsList();
  }

  handleUpdateResultsList(e) {
    this.setState({ resultsCount: e.count });
  }

  render() {
    return (
      <Row>
        <Helmet>
          <title>{this.query ? 
            `Search Results '${this.query}' - ${Config.site.name}` :
            `Search Results - ${Config.site.name}`}
          </title>
        </Helmet>
        <Col md={4} lg={3} className='sidebar'>
          <div className='sticky-top'>
            <QueryMenu onSubmit={this.handleUpdateQuery} />
            <FilterMenu onSubmit={this.handleUpdateFilter} />
          </div>
        </Col>
        <Col>
          <ViewSwitchMenu onChange={this.handleUpdateView} />
          {this.state.resultsCount > 0 && 
            <span className='text-muted ml-2 fs-4'>{this.state.resultsCount} results</span>}
          <span className='float-right'>
            <SortMenu onChange={this.handleUpdateSort} />
          </span>
          {
            this.view !== null && 
            this.query !== null && 
            this.filter !== null && 
            this.sort !== null &&
            (this.view == 'grid' ? 
              <ResultsGridView 
                query={this.query} 
                onResults={this.handleUpdateResultsList} 
              /> : 
              <ResultsListView 
                query={this.query} 
                onResults={this.handleUpdateResultsList} 
              />)
          }
        </Col>
      </Row>
    );
  }
}

export default withRouter(Search);