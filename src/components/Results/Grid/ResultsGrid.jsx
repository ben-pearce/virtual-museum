import React from 'react';

import GridObject from './GridObject';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Results from '../Results';
import ResultsEnd from '../ResultsEnd';
import ResultsEmpty from '../ResultsEmpty';

/**
 * Component for grid results view.
 */
class ResultsGridView extends Results {
  /**
   * Creates component instance for result item in a preload state.
   *
   * @returns {ReactNode} The react node.
   */
  createPreloadComponent() {
    return <GridObject preload />;
  }

  /**
   * Creates component instance for result item in loaded state.
   * 
   * @param {object} object The object data for the result item.
   * @returns {ReactNode} The react node.
   */
  createLoadedComponent(object) {
    const image = this.images[this.objectCache.indexOf(object)];
    return (<GridObject image={image} object={object} />);
  }

  /**
   * Renders grid results list.
   * 
   * @returns {ReactNode} The react node.
   */
  render() {
    if(this.state.objects.length === 0) {
      return <ResultsEmpty/>;
    }
    return (
      <>
        <Row className='pl-2 pr-2' xs={1} md={2} lg={3}>
          {this.state.objects.map((object, i) => 
            <Col className='pl-1 pr-1' key={i}>{object}</Col>
          )}
        </Row>
        {this.state.resultsExhausted && <ResultsEnd/>}
      </>
    );
  }
}

export default ResultsGridView;