import React from 'react';

import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import GridContentLoader from '../../ContentLoaders/GridContentLoader';

const GridObject = (props) => {
  if(props.preload) {
    return (
      <Card className='mb-2 mt-2'>
        <Card.Body>
          <GridContentLoader/>
        </Card.Body>
      </Card>
    );
  } else {
    const object = props.object;
    return (
      <Link to={`/object/${object.id}`}>
        <Card className='mb-2 mt-2'>
          {props.image === undefined ? 
            <div className='grid-image-wrap'></div> :
            <div className='grid-image-wrap'>
              <Card.Img variant='top' src={props.image.src}></Card.Img>
            </div>}
          <Card.Body>
            <Card.Title className='grid-title-wrap' title={object.name}>{object.name}</Card.Title>
            <Card.Subtitle className='mb-2 text-muted grid-text-wrap'>{object.category.name}</Card.Subtitle>
            <Card.Subtitle className='text-muted grid-text-wrap'>{
              (object.creationEarliest && !object.creationLatest) 
                || (object.creationEarliest && object.creationEarliest === object.creationLatest)? 
                `${object.creationEarliest}` : 
                (object.creationEarliest && object.creationLatest) ? 
                  `${object.creationEarliest} - ${object.creationLatest}` : 
                  ''}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </Link>
    );
  }
};

export default GridObject;