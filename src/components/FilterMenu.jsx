import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';

class FilterMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filters: [
        {
          lang: 'Image',
          open: false,
          filters: [
            {
              lang: 'Has Image',
              key: 'has-image',
            },
            {
              lang: 'Non-Commercial Use',
              key: 'non-c-image',
            }
          ]
        },
        {
          lang: 'Category',
          open: false
        },
        {
          lang: 'Maker',
          open: false
        },
        {
          lang: 'Date',
          open: false
        }
      ]
    };
  }

  handleFilterClick(e) {
    e.stopPropagation();
  }

  generateFilterList(filters, depth) {
    if(depth == undefined) {
      depth = 0;
    }

    const list = [];
    for(let f in filters) {
      let filter = filters[f];
      if(depth == 0) {
        list.push(<ListGroup.Item 
          key={f}
          action
          onClick={() => {
            filter.open = !filter.open;
            this.setState({filter: this.state.filter});
          }}
        >
          <FontAwesomeIcon 
            fixedWidth={true}
            icon={filter.open? faAngleDown : faAngleRight}
          />
          <span>{filter.lang}</span>
          <Collapse in={filter.open}>
            {this.generateFilterList(filter.filters, depth+1)}
          </Collapse>
        </ListGroup.Item>);
      } else if(depth >= 1) {
        let checkbox = <Form.Check
          id={filter.key}
          label={filter.lang} 
          onClick={e => e.stopPropagation()}
        ></Form.Check>;
        list.push(
          <li key={f}>
            {checkbox}
            {this.generateFilterList(filter.filters, depth+1)}
          </li>
        );
      }
    }

    if(depth == 0) {
      return (
        <ListGroup className="list-group-flush">
          {list}
        </ListGroup>
      );
    } else if(depth >= 1) {
      return (
        <ul className='list-unstyled ml-3 mt-3'>
          {list}
        </ul>
      );
    }
  }

  render() {
    return(this.generateFilterList(this.state.filters));
  }
}

export default FilterMenu;