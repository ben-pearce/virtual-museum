import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { withRouter } from 'react-router-dom';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class QueryMenu extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      query: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(this.props.location.search);
    let searchQuery = queryParams.get('q');

    if(searchQuery === null) {
      searchQuery = '';
    }

    this.setState({ query: searchQuery });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.query != this.state.query) {
      this.props.onSubmit(this.state.query);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = document.getElementById('search-query');
    this.setState({ query: query.value });
  }

  render() {
    return (
      <Card className='mb-2'>
        <Card.Header><FontAwesomeIcon icon={faSearch}/> Global Search</Card.Header>
        <Card.Body>
          <Form onSubmit={this.handleSubmit}>
            <InputGroup>
              <FormControl
                id='search-query'
                placeholder='Search term or keyword'
                aria-label='Search term or keyword'
                defaultValue={this.state.query}
              />
              <InputGroup.Append>
                <Button 
                  variant='outline-secondary'
                  type='submit'
                ><FontAwesomeIcon icon={faSearch} /></Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(QueryMenu);