import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAngleRight, 
  faAngleDown,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

import { withRouter } from 'react-router-dom';

class FilterMenu extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      availableFilters: {
        image: {
          lang: 'Image',
          options: [
            { lang: 'Has Image', value: '1' },
            { lang: 'No Image', value: '0' }
          ]
        },
        category: {
          lang: 'Category',
          options: [
            { lang: 'Computing & Data Processing', value: '0' }
          ]
        },
        maker: {
          lang: 'Maker',
          options: []
        },
        date: {
          lang: 'Date',
          options: []
        }
      },
      enabledFilters: new Object(),
      openDrawers: new Set()
    };
  }

  componentDidMount() {
    const enabledFilters = new Object();
    const searchParams = new URLSearchParams(this.props.location.search);
    for(const [param, value] of searchParams) {
      const options = new Set(value.split(','));
      enabledFilters[param] = options;
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

  clearFilter(key) {
    if(key === undefined) {
      this.setState({ enabledFilters: new Object() });
    } else {
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
            <Badge
              className='float-right'
              pill
              variant='dark'
              onClick={() => this.clearFilter()} 
            >
              Clear All
            </Badge>}
        </Card.Header>
        <ListGroup className='list-group-flush'>
          {Object.entries(this.state.availableFilters).map(([k, f]) => 
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
              <span 
                className='badge rounded-pill bg-dark text-light float-right'
                onClick={this.clearFilter.bind(this, k)}
              >
                Clear
              </span>}

              <Collapse in={this.state.openDrawers.has(k)}>
                <Form>
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
                  </ul>
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