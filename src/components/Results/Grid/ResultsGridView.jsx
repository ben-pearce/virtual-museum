import React from 'react';

import GridObject from './GridObject';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Results from '../Results.jsx';


class ResultsGridView extends Results {
  createPreloadComponent() {
    return <GridObject preload />;
  }

  createLoadedComponent(object) {
    let image = this.objectThumbnailCache[object.id];
    return (<GridObject image={image} object={object} />);
  }

  render() {
    return (
      <Row className='pl-2 pr-2' xs={1} md={2} lg={3}>
        {this.state.objects.map((object, i) => 
          <Col className='pl-1 pr-1' key={i}>{object}</Col>
        )}
      </Row>
    );
  }
}

export default ResultsGridView;