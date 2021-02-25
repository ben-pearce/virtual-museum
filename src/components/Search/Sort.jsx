import React from 'react';
import PropTypes from 'prop-types';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import { withRouter } from 'react-router-dom';

class SortMenu extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      sort: null
    };

    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(this.props.location.search);
    let sortQuery = queryParams.get('sort');

    if(sortQuery === null) {
      sortQuery = '0';
    }

    this.setState({ sort: sortQuery });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.sort !== this.state.sort) {
      this.props.onChange(this.state.sort);
    }
  }

  handleSelectionUpdate(e) {
    this.setState({
      sort: e.target.value
    });
  }

  render() {
    return (
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>Sort By:</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control 
          value={this.state.sort ? this.state.sort : 0}
          onChange={this.handleSelectionUpdate}
          as='select'>
          <option value={0}>Relevance</option>
          <option value={1}>Alphabetical (asc)</option>
          <option value={2}>Alphabetical (desc)</option>
          <option value={3}>Date (asc)</option>
          <option value={4}>Date (desc)</option>
        </Form.Control>
      </InputGroup>
    );
  }
}

export default withRouter(SortMenu);