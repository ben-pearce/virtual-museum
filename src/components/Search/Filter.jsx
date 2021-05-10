import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAngleRight, 
  faAngleDown,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

import Config from '../../museum.config';

import { withRouter } from 'react-router-dom';

/**
 * Filter Menu react component.
 */
class FilterMenu extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  }

  /**
   * Creates a new filter menu component instance.
   *
   * @param {object} props Component properties.
   * @param {func} props.onSubmit Callback fired when filter is submitted.
   */
  constructor(props) {
    super(props);

    this.state = {
      enabledFilters: new Object(),
      openDrawer: null
    };
  }

  /**
   * Builds the filter state from the search params so that filter state is
   * maintained across page refresh and when user visits directly via a link.
   *
   * Enabled filters are built from URL search parameters in the browser url.
   */
  componentDidMount() {
    const enabledFilters = new Object();
    const searchParams = new URLSearchParams(this.props.location.search);

    for(const [key, filter] of Object.entries(Config.results.availableFilters)) {
      if(filter.type === undefined) {
        const values = searchParams.getAll(key);
        if(values.length > 0) {
          enabledFilters[key] = new Set(values);
        }
      } else if(filter.type === 'date') {
        for(const option of filter.options) {
          const param = `${key}[${option}]`;
          const value = searchParams.get(param);
          if(value !== null) {
            if(!(key in enabledFilters)) {
              enabledFilters[key] = {};
            }
            enabledFilters[key][option] = value;
          }
        }
      }
    }

    this.setState({ enabledFilters: enabledFilters });
  }

  /**
   * If the enabled filters have updated since the component state was set then
   * invoke the {@link Filter#onSubmit} callback.
   * 
   * @param {object} prevProps Props in previous state.
   * @param {object} prevState State in previous state.
   */
  componentDidUpdate(prevProps, prevState) {
    if(prevState.enabledFilters != this.state.enabledFilters) {
      this.props.onSubmit(this.state.enabledFilters);
    }
  }

  /**
   * Called when user updates a filter in the menu.
   * 
   * Updates the value of a filter and then updates the component state.
   * 
   * @param {string} key The filter key.
   * @param {string} val New value to push into the filter.
   */
  toggleFilter(key, val) {
    let { [key]: enabledOptions, ...otherOptions } = this.state.enabledFilters;
    enabledOptions = new Set(enabledOptions);

    if(enabledOptions.has(val)) {
      enabledOptions.delete(val);
    } else {
      enabledOptions.add(val);
    }

    if(enabledOptions.size > 0) {
      otherOptions = {
        ...otherOptions,
        [key]: enabledOptions
      };
    }

    this.setState(prevState => ({
      ...prevState,
      enabledFilters: {
        ...otherOptions
      }
    }));
  }

  /**
   * Called when user updates a filter in the menu.
   *
   * Updates the value of a filter to a single value and then updates the
   * component state.
   *
   * @param {string} key The filter key.
   * @param {string} option The filter option.
   * @param {string} val Value to set filter option to.
   */
  setFilterValue(key, option, value) {
    let { [key]: enabledOptions, ...otherOptions } = this.state.enabledFilters;
    enabledOptions = new Object(enabledOptions);

    if(value) {
      enabledOptions[option] = value;
    } else if(option in enabledOptions) {
      delete enabledOptions[option];
    }

    if(Object.keys(enabledOptions).length > 0) {
      otherOptions = {
        ...otherOptions,
        [key]: enabledOptions
      };
    }

    this.setState(prevState => ({
      ...prevState,
      enabledFilters: {
        ...otherOptions
      }
    }));
  }

  /**
   * Returns the current value of a filter.
   * 
   * @param {string} key The filter key.
   * @param {string} option The filter option.
   * @returns {string} The filter value.
   */
  getFilterValue(key, option) {
    if(key in this.state.enabledFilters) {
      const options = this.state.enabledFilters[key];
      if(option in options) {
        return options[option];
      }
    }
    return '';
  }

  /**
   * Called when user clicks on clear filter button.
   * 
   * Clears all filters under a particular key.
   * 
   * @param {string} key Filter key to clear.
   */
  clearFilter(key) {
    if(key === undefined) {
      this.setState({ enabledFilters: new Object() });
    } else {
      if(Config.results.availableFilters[key].type === 'date') {
        for(const option of Config.results.availableFilters[key].options) {
          document.getElementById(option).value = '';
        }
      }
      const { ...enabledOptions } = this.state.enabledFilters;
      delete enabledOptions[key];
      this.setState(prevState => ({
        ...prevState,
        enabledFilters: enabledOptions
      }));
    }
  }

  /**
   * Returns true if any filter is applied under a particular key.
   * 
   * @param {string} key Filter key to check.
   * @returns {boolean} Is the filter is enabled.
   */
  isFilterEnabled(key) {
    if(key === undefined) {
      return Object.keys(this.state.enabledFilters).length > 0;
    }
    return key in this.state.enabledFilters;
  }

  /**
   * Returns true if a filter contains a particular value.
   * 
   * @param {string} key Filter key to check.
   * @param {string} val Value to check for.
   * 
   * @returns {boolean} Is value found in filter under key.
   */
  isOptionEnabled(key, val) {
    return this.isFilterEnabled(key) && 
      this.state.enabledFilters[key].has(val);
  }

  /**
   * Toggles a filter drawer open state.
   * 
   * @param {string} key Filter drawer key.
   */
  toggleDrawer(key) {
    if(this.state.openDrawer === key) {
      this.setState({ openDrawer: null });
    } else {
      this.setState({ openDrawer: key });
    }
  }

  /**
   * Renders the filter menu.
   * 
   * @returns {ReactNode} The react node.
   */
  render() {
    return (
      <Card className='mb-2'>
        <Card.Header><FontAwesomeIcon icon={faFilter} /> 
          <span> Filter</span>
          {this.isFilterEnabled() &&
            <Button
              as={Badge}
              className='float-right'
              pill
              variant='dark'
              onClick={() => this.clearFilter()} 
            >Clear All</Button>}
        </Card.Header>
        <ListGroup className='list-group-flush'>
          {Object.entries(Config.results.availableFilters).map(([k, f]) => 
            <ListGroup.Item 
              key={k}
              action
            >
              <span onClick={this.toggleDrawer.bind(this, k)}>
                <FontAwesomeIcon 
                  fixedWidth={true}
                  icon={this.state.openDrawer === k ? faAngleDown : faAngleRight}
                />  
                <span>{f.lang}</span>
              </span>

              {this.isFilterEnabled(k) &&
              <Button
                as={Badge}
                className='float-right'
                pill
                variant='dark'
                onClick={this.clearFilter.bind(this, k)}
              >Clear</Button>}

              <Collapse in={this.state.openDrawer === k}>
                <Form>
                  {f.type === undefined && 
                  <ul className='list-unstyled ml-2 mt-3'>
                    {f.options.map((o, j) => 
                      <li key={j}>
                        <Form.Check
                          id={`filter-${k}-${j}`}
                          label={o.lang}
                          custom
                          checked={this.isOptionEnabled(k, o.value)}
                          onChange={this.toggleFilter.bind(this, k, o.value)}
                        />
                      </li>)}
                  </ul>}
                  {f.type === 'date' &&
                  <InputGroup>
                    <Form.Control 
                      placeholder='From' 
                      id='earliest'
                      defaultValue={this.getFilterValue(k, 'earliest')}
                      onBlur={(e) => this.setFilterValue(k, 'earliest', e.target.value)}
                      maxLength={4} />
                    <Form.Control 
                      placeholder='To' 
                      id='latest'
                      defaultValue={this.getFilterValue(k, 'latest')}
                      onBlur={(e) => this.setFilterValue(k, 'latest', e.target.value)}
                      maxLength={4} />
                  </InputGroup>}
                </Form>
              </Collapse>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    );
  }
}

export default withRouter(FilterMenu);