import React from 'react';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Link } from 'react-router-dom';

import ListContentLoader from '../../ContentLoaders/ListContentLoader';

/**
 * List object component displayed in object results when list view is enabled.
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
const ListObject = (props) => {
  if(props.preload) {
    return (
      <Card className='mb-2 mt-2 list-object'>
        <Card.Body>
          <ListContentLoader/>
        </Card.Body>
      </Card>
    );
  } else {
    const object = props.object;
    return (
      <Link to={`/object/${object.id}`} className='list-object'>
        <Card className='mb-2 mt-2'>
          <Row>
            <Col className='pr-0' xs={3}>
              {props.image === undefined ? 
                <div className='grid-image-wrap'></div> :
                <div className='grid-image-wrap'>
                  <Card.Img variant='top' src={props.image.src}></Card.Img>
                </div>}  
            </Col>
            <Col className='pl-0'>
              <Card.Body>
                <Card.Title title={object.name}>{object.name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>{object.category.name}</Card.Subtitle>
                <Card.Subtitle className='text-muted'>{
                  (object.creationEarliest && !object.creationLatest) 
                    || (object.creationEarliest && object.creationEarliest === object.creationLatest)? 
                    `${object.creationEarliest}` : 
                    (object.creationEarliest && object.creationLatest) ? 
                      `${object.creationEarliest} - ${object.creationLatest}` : 
                      ''}
                </Card.Subtitle>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Link>
    );
  }
};

export default ListObject;