import React from 'react';
import PropTypes from 'prop-types';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import { withRouter } from 'react-router-dom';

/**
 * Component for sort menu dropdown.
 */
class SortMenu extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  /**
   * Create sort menu component instance.
   *
   * @param {object} props Component properties.
   * @param {func} props.onChange Callback fired when user updates the sort
   * type.
   */
  constructor(props) {
    super(props);

    this.state = {
      sort: null
    };

    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);
  }

  /**
   * Retrieve the sort type from the browser URL when the component is mounted.
   */
  componentDidMount() {
    const queryParams = new URLSearchParams(this.props.location.search);
    let sortQuery = queryParams.get('sort');

    if(sortQuery === null) {
      sortQuery = '0';
    }

    this.setState({ sort: sortQuery });
  }

  /**
   * Invokes the {@link SortMenu#onChange} callback if the sort type has changed
   * since the last state.
   * 
   * @param {object} prevProps Props in the previous state.
   * @param {object} prevState State in the previous state.
   */
  componentDidUpdate(prevProps, prevState) {
    if(prevState.sort !== this.state.sort) {
      this.props.onChange(this.state.sort);
    }
  }

  /**
   * Event handler for when user changes the sort type.
   * 
   * @param {event} e Event arguments.
   */
  handleSelectionUpdate(e) {
    this.setState({
      sort: e.target.value
    });
  }

  /**
   * Render the sort menu component.
   * 
   * @returns {ReactNode} The react node.
   */
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