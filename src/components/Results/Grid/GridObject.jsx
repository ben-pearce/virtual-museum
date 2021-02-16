import React from 'react';

import Card from 'react-bootstrap/Card';
import GridContentLoader from '../../ContentLoaders/GridContentLoader';

const GridObject = (props) => {
  if(props.preload) {
    return (
      <Card className="mb-2 mt-2">
        <Card.Body>
          <GridContentLoader/>
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <a href={props.href}>
        <Card className="mb-2 mt-2">
          <div className='grid-image-wrap'>
            <Card.Img variant="top" src={props.img}></Card.Img>
          </div>
          <Card.Body>
            <Card.Title>{props.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Category</Card.Subtitle>
            <Card.Subtitle className="text-muted">1978</Card.Subtitle>
          </Card.Body>
        </Card>
      </a>
    );
  }
};

export default GridObject;