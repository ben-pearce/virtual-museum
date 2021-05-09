import React from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';

import Spinner from 'react-bootstrap/Spinner';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import ObjectRow from '../ObjectRow';

import axios from 'axios';

import Config from '../../../museum.config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser,
  faExternalLinkAlt,
  faBirthdayCake,
  faSkullCrossbones,
  faGlobeEurope
} from '@fortawesome/free-solid-svg-icons';

import { Deserializer } from 'jsonapi-serializer';

import { withRouter } from 'react-router-dom';

import ImagePreloader from '../../../imagePreloader';

import ShareToolbar from '../ShareToolbar';

const PersonDeserializer = new Deserializer({keyForAttribute: 'camelCase'});

/**
 * React component for displaying person page content to the user.
 */
class PersonPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      /** Person museum object data */
      person: null,

      /** Related object data */
      relatedObjects: null,
      /** Related images preloaded */
      relatedImages: null
    };
  }

  /**
   * Requests object details from API once the component has been mounted into
   * the application.
   */
  componentDidMount() {
    this.requestPersonDetails();
  }

  /**
   * Retrieves the person ID from the router match object (comes from URL bar)
   * and initiates a request to the API for person data using axios.
   */
  requestPersonDetails() {
    const personId = this.props.match.params.personId;

    axios.get(`/person/${personId}`, { baseURL: Config.api.base })
      .then(this.onRequestPersonDetailsResponse.bind(this));
  }

  /**
   * Handles raw response from the API. 
   * 
   * 1. Deserializes the JSON string.
   * 2. Starts pre-loading the images into browser.
   * 3. Updates the state of the component.
   * 
   * @param {string} resp Raw response from API.
   */
  onRequestPersonDetailsResponse(resp) {
    PersonDeserializer.deserialize(resp.data).then((person) => {
      PersonDeserializer.deserialize(resp.data.meta.relatedObjects).then((objects) => {
        const imageUrls = objects.flatMap((object) => 
          object.collectionsObjectImages.map((image, index) => 
            new URL(`image/${object.id}/${index}`, Config.api.base)));
        
        new ImagePreloader().load(imageUrls)
          .then((images) => {
            this.setState({
              person: person,
              relatedObjects: objects,
              relatedImages: images
            });
          });
      });
    });
  }

  /**
   * Renders person page.
   * 
   * @returns {ReactNode} The react node to render.
   */
  render() {
    if(this.state.person === null) {
      return (
        <div className='d-flex justify-content-center'>
          <Spinner animation='border' variant='dark' />
        </div>);
    }

    return (
      <>
        <Helmet>
          <title>{`${this.state.person.name} - ${Config.site.name}`}</title>
        </Helmet>
        <Row className='mb-4'>
          <Col md={4} lg={3} className='sidebar'>
            {this.state.person.birthDate &&
              <Card className='mb-2'>
                <Card.Header><FontAwesomeIcon icon={faBirthdayCake}/> Born</Card.Header>
                <Card.Body>
                  {new Date(this.state.person.birthDate).toDateString()}
                </Card.Body>
              </Card>}
            {this.state.person.deathDate && 
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faSkullCrossbones}/> Died</Card.Header>
              <Card.Body>
                {new Date(this.state.person.deathDate).toDateString()}
              </Card.Body>
            </Card>}
            {this.state.person.nationality &&
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faGlobeEurope}/> Nationality</Card.Header>
              <Card.Body>
                {this.state.person.nationality}
              </Card.Body>
            </Card>}

          </Col>
          <Col md={8} lg={9}>
            <div className='d-flex justify-content-end'>
              <ShareToolbar person={this.state.person} />
            </div>
            <h2 className='mb-3'><FontAwesomeIcon icon={faUser}/> {this.state.person.name}</h2>
            <p>
              {this.state.person.description && 
              this.state.person.description.split('\n').map((item, key) => {
                return <span key={key}>{item}<br/></span>;
              })}
            </p>
            <a 
              href={this.state.person.collectionsUrl} 
              target='_blank' 
              rel='noreferrer'
            >Source <FontAwesomeIcon icon={faExternalLinkAlt}/></a>
          </Col>
        </Row>
        <Row className='mb-4'>
          <Col xs={12}>
            <Card>
              <Card.Header>Related Objects</Card.Header>
              <Card.Body className='pt-0 pb-0'>
                <ObjectRow objects={this.state.relatedObjects} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(PersonPage);