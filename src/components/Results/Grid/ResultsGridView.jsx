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
    let image = this.objectImageCache[object.id];
    return (<GridObject image={image} object={object} />);
  }

  render() {
    let cols = [];
    for(let i in this.state.objects) {
      let object = this.state.objects[i];
      cols.push(<Col className='pl-1 pr-1' key={i}>{object}</Col>);
    }
    return (
      <Row className='pl-2 pr-2' xs={1} md={2} lg={3}>
        {cols}
      </Row>
    );
  }
}

export default ResultsGridView;