import React from 'react';
import PropTypes from 'prop-types';

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';

import Config from '../../museum.config';

import { Link } from 'react-router-dom';
import axios from 'axios';

import { Deserializer } from 'jsonapi-serializer';

class PersonLink extends React.Component {
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      person: null
    };
  }

  requestPersonDetails() {
    if(this.state.person === null) {
      let requestUrl = new URL(`/person/${this.props.person.id}`, Config.api.base);

      axios.get(requestUrl)
        .then(r => new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data))
        .then(this.onRequestPersonDetailsResponse.bind(this));
    }
  }

  onRequestPersonDetailsResponse(resp) {
    this.setState({ person: resp });
  }

  render() {
    const personPopover = (
      <Popover className='person-link-popover'>
        <Popover.Title>{this.props.person.name}</Popover.Title>
        <Popover.Content>
          {this.state.person === null ? 
            <div className='d-flex justify-content-center'>
              <Spinner animation='border' variant='dark' />
            </div> : 
            <p>{this.state.person.note}</p>}
        </Popover.Content>
      </Popover>
    );
    
    return (
      <OverlayTrigger 
        trigger={['hover', 'focus']}
        placement='auto' 
        overlay={personPopover}
        onToggle={this.requestPersonDetails.bind(this)}
      >
        <Link to={`/person/${this.props.person.id}`}>{this.props.person.name}</Link>
      </OverlayTrigger>
    );
  }
}

export default PersonLink;