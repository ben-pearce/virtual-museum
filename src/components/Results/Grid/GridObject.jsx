import React from 'react';

import { Link } from 'react-router-dom';

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
    let object = props.object;
    let cardImage;
    if(props.image == undefined) {
      cardImage = (
        <div className='grid-image-wrap'></div>
      );
    } else {
      cardImage = (
        <div className='grid-image-wrap'>
          <Card.Img variant="top" src={props.image.src}></Card.Img>
        </div>
      );
    }

    let dates = '';
    if(object.creationEarliest & !object.creationLatest) {
      dates = `${object.creationEarliest}`;
    } else if(object.creationEarliest && object.creationLatest) {
      dates = `${object.creationEarliest} - ${object.creationLatest}`;
    }
    return (
      <Link to={`/object/${object.id}`}>
        <Card className="mb-2 mt-2">
          {cardImage}
          <Card.Body>
            <Card.Title className='grid-title-wrap' title={object.name}>{object.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{object.category.name}</Card.Subtitle>
            <Card.Subtitle className="text-muted">{dates}</Card.Subtitle>
          </Card.Body>
        </Card>
      </Link>
    );
  }
};

export default GridObject;