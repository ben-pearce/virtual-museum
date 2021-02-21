import React from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';

import Spinner from 'react-bootstrap/Spinner';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import GridObject from '../Results/Grid/GridObject';

import axios from 'axios';

import Config from '../../museum.config';

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

class Person extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      person: null
    };
  }

  componentDidMount() {
    this.requestPersonDetails();
  }

  requestPersonDetails() {
    let personId = this.props.match.params.personId;
    let requestUrl = new URL(`/person/${personId}`, Config.api.base);

    axios.get(requestUrl)
      .then(r => new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data))
      .then(this.onRequestPersonDetailsResponse.bind(this));
  }

  onRequestPersonDetailsResponse(resp) {
    this.setState({ person: resp });
  }

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
        <Row className='mb-2'>
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
            <h2 className='mb-3'><FontAwesomeIcon icon={faUser}/> {this.state.person.name}</h2>
            {this.state.person.description && 
            this.state.person.description.split('\n').map((item, key) => {
              return <span key={key}>{item}<br/></span>;
            })}
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
              <Card.Body>
                <Row>
                  <Col sm={12} md={3}><GridObject preload/></Col>
                  <Col sm={12} md={3}><GridObject preload/></Col>
                  <Col sm={12} md={3}><GridObject preload/></Col>
                  <Col sm={12} md={3}><GridObject preload/></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRouter(Person);