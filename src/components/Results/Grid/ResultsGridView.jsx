import React from 'react';

import GridObject from './GridObject.jsx';

import axios from 'axios';
import { Deserializer } from 'jsonapi-serializer';

import Config from '../../../museum.config.js';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class ResultsGridView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      objects: []
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollWatcher.bind(this));
    this.requestResultsObject();
  }

  scrollWatcher() {
    console.log(document.documentElement.scrollBottom);
  }

  requestResultsObject() {
    let objects = [];
    for(let i = 0; i < Config.results.resultsPerPage; i++) {
      objects.push(<GridObject key={i} preload />);
    }
    this.setState({ objects: objects });
    let requestUrl = new URL('/search', Config.apiBase);
    requestUrl.searchParams.set('page', 0);
    requestUrl.searchParams.set('limit', 
      Config.results.resultsPerPage);
    axios.get(requestUrl)
      .then(r => new Deserializer().deserialize(r.data))
      .then(this.onRequestResultsObjectResponse.bind(this));
  }

  onRequestResultsObjectResponse(resp) {
    let objects = this.state.objects.slice();
    objects = objects.splice(0, objects.length - Config.results.resultsPerPage);
    
    for(let i in resp) {
      let object = resp[i];

      let objectUrl = `/object/${object.id}`;

      let imageUrl = new URL(`/image/${object.id}/thumb`, Config.apiBase);

      objects.push(
        <GridObject
          href={objectUrl} 
          img={imageUrl}
          name={object.name}
        />
      );
    }

    this.setState({ objects: objects });
  }

  render() {
    let cols = [];
    for(let i in this.state.objects) {
      cols.push(
        <Col key={i}>
          {this.state.objects[i]}
        </Col>
      );
    }
    return (
      <>
        <Row xs={1} md={2} lg={3}>
          {cols}
        </Row>
      </>
    );
  }
}

export default ResultsGridView;