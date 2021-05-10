import React from 'react';

import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import GridContentLoader from '../../ContentLoaders/GridContentLoader';

/**
 * Grid object component displayed in object results when grid view is enabled.
 * 
 * Displays the object image, name, category and date.
 * 
 * @param {object} props Component properties.
 * @param {boolean} props.preload True to show only object skeleton instead of actual content.
 * @param {object|null} props.object The object data displayed in this component.
 * @param {Image|null} props.image The image instance to display.
 * 
 * @returns {ReactNode} The {@link Card} react node.
 */
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
      <Card className='grid-object mb-2 mt-2'>
        <Link to={`/object/${object.id}`}>
          <div className='grid-image-wrap'>
            {props.image === undefined ? 'No Image' : <Card.Img variant='top' src={props.image.src}></Card.Img>}
          </div>
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
        </Link>
      </Card>
      
    );
  }
};

export default GridObject;