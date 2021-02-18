import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

import axios from 'axios';

import Config from '../../museum.config';

import { Deserializer } from 'jsonapi-serializer';

import { Splide, SplideSlide } from '@splidejs/react-splide';

import { withRouter } from 'react-router-dom';

class ObjectPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
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
    const primaryOptions = {
      type: 'loop',
      width: 800,
      autoWidth: true,
      ixedWidth: 300,
      fixedHeight: 400,
      perPage: 1,
      perMove: 1,
      gap: '1rem',
      pagination: false,
    };

    const secondaryOptions = {
      type: 'slide',
      rewind: true,
      width: 800,
      gap: '1rem',
      pagination: false,
      fixedWidth: 110,
      fixedHeight: 70,
      cover: true,
      focus: 'center',
      isNavigation: true,
      updateOnMove: true,
    };

    let images = [];
    for(let i in this.objectImageCache) {
      images.push(
        <SplideSlide key={i}>
          <img height="100%" src={`${this.objectImageCache[i].src}`}/>
        </SplideSlide>
      );
    }

    if(this.state.object === null) {
      return (
        <Spinner animation="border" variant="dark" /> 
      );
    }
    return (
      <Row>
        <Col md={4} lg={3} className='sidebar'>
          <div className="sticky-top">
            <Card className="mb-2">
              <Card.Header>Other Details</Card.Header>
              <Card.Body>
                
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col>
          <div>
            <Splide options={primaryOptions} ref={this.primarySplideRef}>
              {images}
            </Splide>
            <Splide options={secondaryOptions} ref={this.secondarySplideRef}>
              {images}
            </Splide>
          </div>
          <h2>{this.state.object.name}</h2>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ObjectPage);