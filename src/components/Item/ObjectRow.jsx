import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GridObject from '../Results/Grid/GridObject';

import Config from '../../museum.config';

import { withRouter } from 'react-router-dom';

import ImagePreloader from '../../imagePreloader';

/**
 * React component for object row displayed on object and person pages for
 * related objects.
 */
class ObjectRow extends React.Component {
  /**
   * ObjectRow prop types.
   * 
   * @static
   * @member {object}
   */
  static propTypes = {
    objects: PropTypes.array.isRequired
  };

  /**
   * Creates an object row component instance.
   * 
   * @param {object} props Component properties.
   * @param {object[]} props.objects Array of object data.
   */
  constructor(props) {
    super(props);

    this.state = {
      /** Object data to be displayed */
      objects: null,
      /** Preloaded images for objects */
      images: null
    };
  }

  /**
   * Preloads the images for each object and then proceeds to update the
   * component state.
   */
  componentDidMount() {
    const imageUrls = this.props.objects.map((object) => 
      new URL(`image/${object.id}/thumb`, Config.api.base));
      
    new ImagePreloader().load(imageUrls)
      .then((images) => {
        this.setState({
          objects: this.props.objects,
          images: images
        });
      });
  }

  /**
   * Renders the object row.
   * 
   * @returns {ReactNode} The react node to render.
   */
  render() {
    return (
      <Row xs={1} md={4}>
        {this.state.objects === null ? 
          [...Array(4).keys()].map((x, i) => 
            <Col className='pl-1 pr-1' key={i}>
              <GridObject preload/>
            </Col>)
          : this.state.objects.length === 0 ? 
            <p className='mx-auto text-muted mb-0'>There are no related objects to show.</p> :
            this.state.objects.map((object, index) => 
              <Col className='pl-1 pr-1' key={index}>
                <GridObject object={object} image={this.state.images[index]} />
              </Col>)}
      </Row>
    );
  }
}

export default withRouter(ObjectRow);