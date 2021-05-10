import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { Deserializer } from 'jsonapi-serializer';

import ImagePreloader from '../../imagePreloader';

import Config from '../../museum.config';

/**
 * Component for museum results list.
 *
 * Implements the scroll listener for infinite scrolling. New results will be
 * loaded in as the scroll is exhausted.
 */
class Results extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    onResults: PropTypes.func.isRequired
  };

  /**
   * Creates new results list component instance.
   *
   * @param {object} props Component properties.
   * @param {object} props.params The search params to pass to the API for
   * results generation.
   * @param {func} props.onResults Callback fired when response arrives from
   * API.
   */
  constructor(props) {
    super(props);

    this.state = {
      objects: [],
      resultsExhausted: false
    };

    /**
     * Component instances of result items.
     * @member {ReactNode[]}
     */
    this.objectCache = [];

    /**
     * Image instances of result items.
     * @member {Image[]}
     */
    this.images = [];

    /**
     * Callback for handling scroll event.
     * @member {Callback|null}
     */
    this.scrollEventHandler = null;

    /**
     * The current pagination.
     * @member {integer}
     */
    this.paginatorPageCount = 0;

    /**
     * Total number of objects which have been loaded.
     * @member {integer}
     */
    this.totalObjects = Config.results.resultsPerPage;
  }

  /**
   * Initiate request for first result items when the component is mounted.
   */
  componentDidMount() {
    this.requestResultsObject();
  }

  /**
   * Checks if the props have changed since the last state.
   *
   * If the props have changed the results will be reset and scroll position
   * reset to 0.
   * 
   * @param {object} prevProps Props in the previous state.
   */
  componentDidUpdate(prevProps) {
    if(prevProps.params.toString() !== this.props.params.toString()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.reset();
    }
  }

  /**
   * Resets result list and initiates request for fresh object data.
   */
  reset() {
    window.removeEventListener('scroll', this.scrollEventHandler);

    this.objectCache = [];
    this.images = [];

    this.scrollEventHandler = null;
    this.paginatorPageCount = 0;
    this.totalObjects = Config.results.resultsPerPage;
    this.setState({ 
      objects: [],
      resultsExhausted: false
    }, this.requestResultsObject);
  }
  
  /**
   * Removes the event listener on the window scroll event when the component
   * gets unmounted.
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollEventHandler);
  }

  /**
   * Event handler for scroll event. Once scroll reaches 50 pixels from the
   * bottom of the viewport, additional results are requested.
   */
  scrollWatcher() {
    const windowSize = document.body.clientHeight - window.innerHeight;
    const scrollPageRemaining = (windowSize - document.documentElement.scrollTop);
    if(scrollPageRemaining < 50) {
      window.removeEventListener('scroll', this.scrollEventHandler);
      this.requestResultsObject();
    }
  }

  /**
   * Initiates axios request to API for object results with the appropriate
   * search parameters.
   */
  requestResultsObject() {
    const newObjectCount = Config.results.resultsPerPage % (this.totalObjects - Config.results.resultsPerPage * this.paginatorPageCount + 1);
    const objects = this.state.objects.slice();
    for(let i = 0; i < newObjectCount; i++) {
      objects.push(this.createPreloadComponent());
    }
    this.setState({ objects: objects });
    const searchParams = new URLSearchParams();
    searchParams.set('page[number]', this.paginatorPageCount);
    searchParams.set('page[size]', newObjectCount);
    this.props.params.forEach((value, param) => {
      searchParams.append(param, value);
    });

    axios.get('/search', { baseURL: Config.api.base, params: searchParams })
      .then(this.onRequestResultsObjectResponse.bind(this));
  }

  /**
   * Loads new objects from the object cache into the results view and updates
   * the component state.
   *
   * @returns {Promise} A promise that resolves when the state has been updated.
   */
  loadObjects() {
    const newObjectCount = Config.results.resultsPerPage % (this.totalObjects - Config.results.resultsPerPage * this.paginatorPageCount + 1);
    return new Promise((resolve) => {
      let objects = this.state.objects.slice();
      objects = objects.splice(0, objects.length - newObjectCount);
      objects = objects.concat(this.objectCache.map(this.createLoadedComponent, this));
      this.setState({ objects: objects }, resolve);
    });
  }

  /**
   * Handles response from the API. Pre-loads object images and starts loading
   * objects into the results view.
   * 
   * @param {string} resp Raw response from API.
   */
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
          // Generates the correct image src for each object
          const imageUrls = objects
            .filter((o) => o.collectionsObjectImages.length > 0)
            .map((object) => new URL(`image/${object.id}/thumb`, Config.api.base));
          this.objectCache = objects;
          new ImagePreloader().load(imageUrls).then((images) => {
            this.images = images;
            this.loadObjects().then(() => {
              this.objectCache = [];
              this.images = [];
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
        });
    }
  }

  /**
   * Creates a component instance for a results item that is in a pre-load
   * state.
   *
   * Will be overriden in child classes to support different styles of results
   * (i.e. List or Grid).
   */
  createPreloadComponent() {
    throw new TypeError('Cannot call createPreloadComponent() directly on Results instance');
  }

  /**
   * Creates a component instance for a results item that is in a loaded state.
   *
   * Will be overriden in child classes to support different styles of results
   * (i.e. List or Grid).
   */
  createLoadedComponent() {
    throw new TypeError('Cannot call createdLoadedComponent() directly on Results instance');
  }
}

export default Results;