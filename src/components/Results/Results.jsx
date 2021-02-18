import React from 'react';

import axios from 'axios';
import { Deserializer } from 'jsonapi-serializer';

import Config from '../../museum.config';


class Results extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      objects: []
    };

    this.objectCache = [];
    this.objectImageCache = {};

    this.scrollEventHandler = null;
    this.paginatorPageCount = 0;
  }

  componentDidMount() {
    this.requestResultsObject();
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
    axios.get(requestUrl)
      .then(r => new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data))
      .then(this.onRequestResultsObjectResponse.bind(this));
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
        image.src = imageUrl;
        this.objectImageCache[object.id] = image;
      }
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

  onRequestResultsObjectResponse(resp) {
    this.objectCache = resp;

    this.loadObjectImages()
      .then(this.loadObjects.bind(this))
      .then(() => {
        this.objectCache = [];
        this.objectImageCache = [];
        this.paginatorPageCount += 1;
        this.scrollEventHandler = this.scrollWatcher.bind(this);
        window.addEventListener('scroll', this.scrollEventHandler);
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