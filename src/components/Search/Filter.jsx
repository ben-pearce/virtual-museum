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

class FilterMenu extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      enabledFilters: new Object(),
      openDrawers: new Set()
    };
  }

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
          console.log(`${param}:${value}`);
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

  componentDidUpdate(prevProps, prevState) {
    if(prevState.enabledFilters != this.state.enabledFilters) {
      this.props.onSubmit(this.state.enabledFilters);
    }
  }

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

  getFilterValue(key, option) {
    if(key in this.state.enabledFilters) {
      const options = this.state.enabledFilters[key];
      if(option in options) {
        return options[option];
      }
    }
    return '';
  }

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

  isFilterEnabled(key) {
    if(key === undefined) {
      return Object.keys(this.state.enabledFilters).length > 0;
    }
    return key in this.state.enabledFilters;
  }

  isOptionEnabled(key, val) {
    return this.isFilterEnabled(key) && 
      this.state.enabledFilters[key].has(val);
  }

  toggleDrawer(key) {
    const openDrawers = new Set(this.state.openDrawers);
    if(openDrawers.has(key)) {
      openDrawers.delete(key);
    } else {
      openDrawers.add(key);
    }
    this.setState({ openDrawers: openDrawers });
  }

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
                  icon={this.state.openDrawers.has(k) ? faAngleDown : faAngleRight}
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

              <Collapse in={this.state.openDrawers.has(k)}>
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