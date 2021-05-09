import React from 'react';
import PropTypes from 'prop-types';

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Spinner from 'react-bootstrap/Spinner';

import Config from '../../museum.config';

import { Link } from 'react-router-dom';
import axios from 'axios';

import { Deserializer } from 'jsonapi-serializer';

/**
 * React component for a link to a person page with a pop-over to peek details.
 */
class PersonLink extends React.Component {
  /**
   * PersonLink prop types.
   * 
   * @static
   * @member {object}
   */
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  /**
   * Creates an person link component instance.
   * 
   * @param {object} props Component properties.
   * @param {object[]} props.person Person data.
   */
  constructor(props) {
    super(props);

    this.state = {
      /** Person data to be displayed */
      person: null
    };
  }

  /**
   * Initiates axios request to API for person data.
   */
  requestPersonDetails() {
    if(this.state.person === null) {
      axios.get(`/person/${this.props.person.id}`, { baseURL: Config.api.base })
        .then(r => new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data))
        .then(this.onRequestPersonDetailsResponse.bind(this));
    }
  }

  /**
   * Updates the state of the component once API request has completed.
   * 
   * @param {string} resp The raw API response.
   */
  onRequestPersonDetailsResponse(resp) {
    this.setState({ person: resp });
  }

  /**
   * Renders the person link.
   * 
   * @returns {ReactNode} The react node to render.
   */
  render() {
    // Pop-over definition.
    const personPopover = (
      <Popover className='person-link-popover'>
        <Popover.Title>{this.props.person.name}</Popover.Title>
        <Popover.Content>
          {this.state.person === null ? 
            <div className='d-flex justify-content-center'>
              <Spinner animation='border' variant='dark' />
            </div> : 
            this.state.person.note !== null ? 
              <p>{this.state.person.note}</p> : 
              <p className='text-muted'>No description</p>}
        </Popover.Content>
      </Popover>
    );
    
    // Link trigger definition.
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