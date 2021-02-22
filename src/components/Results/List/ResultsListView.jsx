import React from 'react';

import ListObject from './ListObject';

import Row from 'react-bootstrap/Row';
import Results from '../Results';


class ResultsListView extends Results {
  createPreloadComponent() {
    return <ListObject preload />;
  }

  createLoadedComponent(object) {
    let image = this.objectThumbnailCache[object.id];
    return (<ListObject image={image} object={object} />);
  }

  render() {
    return this.state.objects.map((object, i) => 
      <Row className='pl-3 pr-3' key={i}>{object}</Row>);
  }
}

export default ResultsListView;