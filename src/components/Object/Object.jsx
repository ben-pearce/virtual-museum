import React from 'react';
import { Helmet } from 'react-helmet';

import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';

import GridObject from '../Results/Grid/GridObject';

import axios from 'axios';

import Config from '../../museum.config';
import ShareToolbar from './ShareToolbar';
import PersonLink from './PersonLink';

import { Deserializer } from 'jsonapi-serializer';

import { Splide, SplideSlide } from '@splidejs/react-splide';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCube,
  faFingerprint,
  faMapMarkerAlt,
  faMapMarkedAlt,
  faUser,
  faUsers,
  faExternalLinkAlt,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

import { Link, withRouter } from 'react-router-dom';

class ObjectPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  static primaryOptions = {
    type: 'loop',
    fixedHeight: 300,
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    pagination: false,
    padding: {
      left: 'auto',
      right: 'auto'
    }
  };

  static secondaryOptions = {
    type: 'slide',
    rewind: true,
    gap: '1rem',
    pagination: false,
    fixedWidth: 110,
    fixedHeight: 70,
    cover: true,
    focus: 'center',
    isNavigation: true,
    updateOnMove: true,
    arrows: false
  };


  constructor(props) {
    super(props);

    this.state = {
      object: null
    };

    this.objectCache = null;
    this.objectImageCache = [];

    this.primarySplideRef = React.createRef();
    this.secondarySplideRef = React.createRef();

  }

  componentDidMount() {
    this.requestObjectDetails();
  }

  requestObjectDetails() {
    let objectId = this.props.match.params.objectId;
    let requestUrl = new URL(`/object/${objectId}`, Config.api.base);

    axios.get(requestUrl)
      .then(r => new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data))
      .then(this.onRequestObjectDetailsResponse.bind(this));
  }

  loadObjectImages() {
    return new Promise((resolve) => {
      for(let i in this.objectCache.collectionsObjectImages) {
        let objectId = this.props.match.params.objectId;
        let imageUrl = new URL(`/image/${objectId}/${i}`, Config.api.base);

        let image = new Image();
        image.addEventListener('load', () => {
          if(this.allImagesLoaded()) {
            resolve();
          }
        });

        this.objectImageCache.push(image);
        image.src = imageUrl;
      }
      resolve();
    });
  }

  allImagesLoaded() {
    for(let i in this.objectImageCache) { 
      if(!this.objectImageCache[i].complete) {
        return false;
      }
    }
    return true;
  }

  onRequestObjectDetailsResponse(resp) {
    this.objectCache = resp;
    
    this.loadObjectImages()
      .then(() => this.setState({ object: this.objectCache }, () => {
        // Sync primary splide with thumbnail splide
        this.primarySplideRef.current.sync(this.secondarySplideRef.current.splide);
      }));
  }

  render() {
    if(this.state.object === null) {
      return (
        <div className='d-flex justify-content-center'>
          <Spinner animation='border' variant='dark' />
        </div>);
    }
    return (
      <>
        <Helmet>
          <title>{`${this.state.object.name} - ${Config.site.name}`}</title>
        </Helmet>
        <Row className='mb-2'>
          <Col md={4} lg={3} className='sidebar'>
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faFingerprint}/> Accession No.</Card.Header>
              <Card.Body>
                <pre className='m-0'>{this.state.object.accession}</pre>
              </Card.Body>
            </Card>
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faMapMarkerAlt}/> Displayed at</Card.Header>
              <Card.Body>
                {this.state.object.facility === null ? 
                  <p className='text-muted m-0'>This object is not currently on display.</p> : 
                  <p className='m-0'>
                    <Link to={`/search?facility=${this.state.object.facility.id}`}>
                      {this.state.object.facility.name}
                    </Link>
                  </p>}
              </Card.Body>
            </Card>
            {this.state.object.creationEarliest &&
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faCalendarAlt}/> Lifecycle</Card.Header>
              <Card.Body>
                <p className='m-0'>
                  {this.state.object.creationEarliest && this.state.object.creationLatest && 
                  (this.state.object.creationEarliest !== this.state.object.creationLatest) ?
                    <Link 
                      to={`/search?creation[earliest]=${this.state.object.creationEarliest}&creation[latest]=${this.state.object.creationLatest}`}
                    >
                      {this.state.object.creationEarliest} - {this.state.object.creationLatest}
                    </Link> :
                    <Link 
                      to={`/search?creation[earliest]=${this.state.object.creationEarliest}`}
                    >
                      {this.state.object.creationEarliest}
                    </Link>}
                </p>
              </Card.Body>
            </Card>}
            {this.state.object.collectionsObjectMakers.length > 0 &&
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faUser}/> Made by</Card.Header>
              <ListGroup as='ul' variant='flush' className='m-0'>
                {this.state.object.collectionsObjectMakers.map((person, i) => {
                  return <ListGroup.Item as='li' key={i}>
                    <PersonLink person={person.person}/>
                  </ListGroup.Item>;
                })}
              </ListGroup>
            </Card>}
            {this.state.object.collectionsObjectPeople.length > 0 &&
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faUsers}/> Related people</Card.Header>
              <ListGroup as='ul' variant='flush' className='m-0'>
                {this.state.object.collectionsObjectPeople.map((person, i) => {
                  return <ListGroup.Item as='li' key={i}>
                    <PersonLink person={person.person}/>
                  </ListGroup.Item>;
                })}
              </ListGroup>
            </Card>}
            {this.state.object.collectionsObjectPlaces.length > 0 &&
            <Card className='mb-2'>
              <Card.Header><FontAwesomeIcon icon={faMapMarkedAlt}/> Places of origin</Card.Header>
              <ListGroup as='ul' variant='flush' className='m-0'>
                {this.state.object.collectionsObjectPlaces.map((place, i) => {
                  return <ListGroup.Item as='li' key={i}>
                    {place.place.name}
                  </ListGroup.Item>;
                })}
              </ListGroup>
            </Card>}
          </Col>
          <Col md={8} lg={9}>
            <ShareToolbar object={this.state.object} />
            <Card className='mb-3'>
              <Card.Body>
                <Splide options={ObjectPage.primaryOptions} ref={this.primarySplideRef} className='mb-2'>
                  {this.objectImageCache.map((image, i) => {
                    return <SplideSlide key={i}><img height='100%' src={image.src}/></SplideSlide>;
                  })}
                </Splide>
                <Splide options={ObjectPage.secondaryOptions} ref={this.secondarySplideRef}>
                  {this.objectImageCache.map((image, i) => {
                    return <SplideSlide key={i}><img height='100%' src={image.src}/></SplideSlide>;
                  })}
                </Splide>
              </Card.Body>
            </Card>
            <h2 className='mb-3'><FontAwesomeIcon icon={faCube}/> {this.state.object.name}</h2>
            <p>From <Link to={`/search?category=${this.state.object.category.id}`}>{this.state.object.category.name}</Link></p>
            <p>{this.state.object.description}</p>
            <a 
              href={this.state.object.collectionsUrl} 
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

export default withRouter(ObjectPage);