import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { Deserializer } from 'jsonapi-serializer';

import Config from '../../museum.config';


class Results extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    onResults: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      objects: []
    };

    this.objectCache = [];
    this.objectThumbnailCache = {};

    this.scrollEventHandler = null;
    this.paginatorPageCount = 0;
    this.totalObjects = 0;
    this.searchQuery = props.query;
  }

  componentDidMount() {
    this.requestResultsObject();
  }

  componentDidUpdate() {
    if(this.props.query !== this.searchQuery) {
      this.searchQuery = this.props.query;
      this.paginatorPageCount = 0;
      this.setState({ objects: [] }, this.requestResultsObject);
    }
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollEventHandler);
  }

  scrollWatcher() {
    let windowSize = document.body.clientHeight - window.innerHeight;
    let scrollPageRemaining = (windowSize - document.documentElement.scrollTop);
    if(scrollPageRemaining < 50) {
      window.removeEventListener('scroll', this.scrollEventHandler);
      this.requestResultsObject();
    }
  }

  requestResultsObject() {
    let objects = this.state.objects.slice();
    for(let i = 0; i < Config.results.resultsPerPage; i++) {
      objects.push(this.createPreloadComponent());
    }
    this.setState({ objects: objects });
    let requestUrl = new URL('/search', Config.api.base);
    requestUrl.searchParams.set('page', this.paginatorPageCount);
    requestUrl.searchParams.set('limit', 
      Config.results.resultsPerPage);
    if(this.searchQuery !== null) {
      requestUrl.searchParams.set('q', this.searchQuery);
    }
    
    axios.get(requestUrl).then(this.onRequestResultsObjectResponse.bind(this));
  }

  loadObjects() {
    return new Promise((resolve) => {
      let objects = this.state.objects.slice();
      objects = objects.splice(0, objects.length - Config.results.resultsPerPage);
      objects = objects.concat(this.objectCache.map(this.createLoadedComponent, this));
      this.setState({ objects: objects }, resolve);
    });
  }

  loadObjectImages() {
    return new Promise((resolve) => {
      for(let i in this.objectCache) {
        let object = this.objectCache[i];
        let imageUrl = new URL(`/image/${object.id}/thumb`, Config.api.base);
  
        let image = new Image();
        image.addEventListener('load', () => {
          if(this.allImagesLoaded()) {
            resolve();
          }
        });
        this.objectThumbnailCache[object.id] = image;
        image.src = imageUrl;
      }
    });
  }

  allImagesLoaded() {
    for(let i in this.objectThumbnailCache) {
      if(!this.objectThumbnailCache[i].complete) {
        return false;
      }
    }
    return true;
  }

  onRequestResultsObjectResponse(resp) {
    new Deserializer({keyForAttribute: 'camelCase'}).deserialize(resp.data, (e, objects) => {
      this.objectCache = objects;
      this.loadObjectImages()
        .then(this.loadObjects.bind(this))
        .then(() => {
          this.objectCache = [];
          this.objectThumbnailCache = [];
          this.paginatorPageCount += 1;
          this.totalObjects = resp.data.meta.count;
          this.scrollEventHandler = this.scrollWatcher.bind(this);
          window.addEventListener('scroll', this.scrollEventHandler);

          this.props.onResults({
            objects: this.state.objects,
            count: resp.data.meta.count
          });
        });
    });
  }

  createPreloadComponent() {
    throw new TypeError('Cannot call createPreloadComponent() directly on Results instance');
  }

  createLoadedComponent() {
    throw new TypeError('Cannot call createdLoadedComponent() directly on Results instance');
  }
}

export default Results;