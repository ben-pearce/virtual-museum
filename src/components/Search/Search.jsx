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

/**
 * Component for search page.
 */
class Search extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  /**
   * Create new search page component instance.
   * 
   * @param {object} props Component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      resultsCount: null
    };

    /**
     * The view switch menu reference.
     * 
     * @member {ViewSwitchMenu}
     */
    this.view = null;

    /**
     * The query menu refernce.
     * 
     * @member {QueryMenu}
     */
    this.query = null;

    /**
     * The filter menu reference.
     * 
     * @member {FilterMenu}
     */
    this.filter = null;

    /**
     * The sort menu reference.
     * 
     * @member {SortMenu}
     */
    this.sort = null;

    this.handleUpdateQuery = this.handleUpdateQuery.bind(this);
    this.handleUpdateFilter = this.handleUpdateFilter.bind(this);
    this.handleUpdateView = this.handleUpdateView.bind(this);
    this.handleUpdateSort = this.handleUpdateSort.bind(this);
    this.handleUpdateResultsList = this.handleUpdateResultsList.bind(this);
  }

  /**
   * Updates browser location when any of the child components (query, filter,
   * view, sort) request an update.
   */
  updateResultsList() {
    const searchParams = this.getResultsSearchParams();

    if(this.view !== 'grid') {
      searchParams.set('view', this.view);
    }

    this.props.history.push({
      search: `?${searchParams.toString()}`
    });
  }

  /**
   * Generates URL search parameter object based on query, filter and view mode.
   *
   * @returns {URLSearchParams} The search params object.
   */
  getResultsSearchParams() {
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

    if(this.sort !== '0') {
      searchParams.set('sort', this.sort);
    }

    return searchParams;
  }

  /**
   * Event handler for when query menu requests new results.
   *
   * @param {string} q The query string submitted by the user.
   */
  handleUpdateQuery(q) {
    this.query = q;
    this.updateResultsList();
  }

  /**
   * Event handler for when filter menu requests new results.
   * 
   * @param {object} f Enabled filter object.
   */
  handleUpdateFilter(f) {
    this.filter = f;
    this.updateResultsList();
  }

  /**
   * Event handler for when view switch menu requests new results.
   *
   * @param {string} v The view mode selected by the user.
   */
  handleUpdateView(v) {
    this.view = v;
    this.updateResultsList();
  }

  /**
   * Event handler for when sort menu requests new results.
   * 
   * @param {integer} s The sort mode selected by the user.
   */
  handleUpdateSort(s) {
    this.sort = s;
    this.updateResultsList();
  }

  /**
   * Event handler for when results list has finished loading new result set.
   *
   * @param {object} e Results object.
   */
  handleUpdateResultsList(e) {
    this.setState({ 
      resultsCount: e.count 
    });
  }

  /**
   * Renders the search page.
   * 
   * @returns {ReactNode} The react node.
   */
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
          <div className='d-flex flex-wrap'>
            <div>
              <ViewSwitchMenu onChange={this.handleUpdateView} />
            </div>
            <div className='flex-grow-1 align-self-center'>
              {this.state.resultsCount > 0 && 
                <span className='text-muted ml-2 fs-4'>{this.state.resultsCount} results</span>}
            </div>
            <div>
              <SortMenu onChange={this.handleUpdateSort} />
            </div>
          </div>
          
          {
            // Do not render the results until menu components are mounted.
            this.view !== null && 
            this.query !== null && 
            this.filter !== null && 
            this.sort !== null &&
            (this.view == 'grid' ? 
              <ResultsGridView 
                params={this.getResultsSearchParams()}
                onResults={this.handleUpdateResultsList} 
              /> : 
              <ResultsListView 
                params={this.getResultsSearchParams()}
                onResults={this.handleUpdateResultsList} 
              />)
          }
        </Col>
      </Row>
    );
  }
}

export default withRouter(Search);