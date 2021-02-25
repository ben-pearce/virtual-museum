import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { Deserializer } from 'jsonapi-serializer';

import Config from '../../museum.config';


class Results extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    onResults: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      objects: [],
      resultsExhausted: false
    };

    this.objectCache = [];
    this.objectThumbnailCache = {};

    this.scrollEventHandler = null;
    this.paginatorPageCount = 0;
    this.totalObjects = Config.results.resultsPerPage;
  }

  componentDidMount() {
    this.requestResultsObject();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.toString() !== this.props.params.toString()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.reset();
    }
  }

  reset() {
    window.removeEventListener('scroll', this.scrollEventHandler);

    this.objectCache = [];
    this.objectThumbnailCache = [];

    this.scrollEventHandler = null;
    this.paginatorPageCount = 0;
    this.totalObjects = Config.results.resultsPerPage;
    this.setState({ 
      objects: [],
      resultsExhausted: false
    }, this.requestResultsObject);
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollEventHandler);
  }

  scrollWatcher() {
    const windowSize = document.body.clientHeight - window.innerHeight;
    const scrollPageRemaining = (windowSize - document.documentElement.scrollTop);
    if(scrollPageRemaining < 50) {
      window.removeEventListener('scroll', this.scrollEventHandler);
      this.requestResultsObject();
    }
  }

  requestResultsObject() {
    const newObjectCount = Config.results.resultsPerPage % (this.totalObjects - Config.results.resultsPerPage * this.paginatorPageCount + 1);
    const objects = this.state.objects.slice();
    for(let i = 0; i < newObjectCount; i++) {
      objects.push(this.createPreloadComponent());
    }
    this.setState({ objects: objects });
    const requestUrl = new URL('/search', Config.api.base);
    requestUrl.searchParams.set('page[number]', this.paginatorPageCount);
    requestUrl.searchParams.set('page[size]', newObjectCount);
    this.props.params.forEach((value, param) => {
      requestUrl.searchParams.append(param, value);
    });

    axios.get(requestUrl).then(this.onRequestResultsObjectResponse.bind(this));
  }

  loadObjects() {
    const newObjectCount = Config.results.resultsPerPage % (this.totalObjects - Config.results.resultsPerPage * this.paginatorPageCount + 1);
    return new Promise((resolve) => {
      let objects = this.state.objects.slice();
      objects = objects.splice(0, objects.length - newObjectCount);
      objects = objects.concat(this.objectCache.map(this.createLoadedComponent, this));
      this.setState({ objects: objects }, resolve);
    });
  }

  loadObjectImages() {
    return new Promise((resolve) => {
      for(const i in this.objectCache) {
        const object = this.objectCache[i];
        if(object.collectionsObjectImages.length > 0) {
          const imageUrl = new URL(`/image/${object.id}/thumb`, Config.api.base);
  
          const image = new Image();
          image.addEventListener('load', () => {
            if(this.allImagesLoaded()) {
              resolve();
            }
          });
          this.objectThumbnailCache[object.id] = image;
          image.src = imageUrl;
        }
      }
      if(Object.keys(this.objectThumbnailCache).length === 0) {
        resolve();
      }
    });
  }

  allImagesLoaded() {
    for(const i in this.objectThumbnailCache) {
      if(!this.objectThumbnailCache[i].complete) {
        return false;
      }
    }
    return true;
  }

  onRequestResultsObjectResponse(resp) {
    if(resp.data.meta.count == 0) {
      this.setState({ objects: [] });
      this.props.onResults({
        objects: this.state.objects,
        count: resp.data.meta.count
      });
    } else {
      new Deserializer({keyForAttribute: 'camelCase'}).deserialize(resp.data)
        .then((objects) => {
          this.objectCache = objects;
          this.loadObjectImages()
            .then(this.loadObjects.bind(this))
            .then(() => {
              this.objectCache = [];
              this.objectThumbnailCache = [];
              this.paginatorPageCount += 1;
              this.totalObjects = resp.data.meta.count;
              if(Config.results.resultsPerPage * this.paginatorPageCount < this.totalObjects) {
                this.scrollEventHandler = this.scrollWatcher.bind(this);
                window.addEventListener('scroll', this.scrollEventHandler);
              } else {
                this.setState({ resultsExhausted: true });
              }
  
              this.props.onResults({
                objects: this.state.objects,
                count: this.totalObjects
              });
            });
        });
    }
  }

  createPreloadComponent() {
    throw new TypeError('Cannot call createPreloadComponent() directly on Results instance');
  }

  createLoadedComponent() {
    throw new TypeError('Cannot call createdLoadedComponent() directly on Results instance');
  }
}

export default Results;