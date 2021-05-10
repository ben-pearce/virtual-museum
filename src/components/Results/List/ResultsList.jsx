import React from 'react';

import ListObject from './ListObject';

import Row from 'react-bootstrap/Row';
import Results from '../Results';
import ResultsEnd from '../ResultsEnd';
import ResultsEmpty from '../ResultsEmpty';

/**
 * Component for list results view.
 */
class ResultsListView extends Results {
  /**
   * Creates component instance for result item in a preload state.
   *
   * @returns {ReactNode} The react node.
   */
  createPreloadComponent() {
    return <ListObject preload />;
  }

  /**
   * Creates component instance for result item in loaded state.
   * 
   * @param {object} object The object data for the result item.
   * @returns {ReactNode} The react node.
   */
  createLoadedComponent(object) {
    const image = this.images[this.objectCache.indexOf(object)];
    return (<ListObject image={image} object={object} />);
  }

  /**
   * Renders list results list.
   * 
   * @returns {ReactNode} The react node.
   */
  render() {
    if(this.state.objects.length === 0) {
      return <ResultsEmpty/>;
    }
    return (
      <>
        {this.state.objects.map((object, i) => <Row className='pl-3 pr-3' key={i}>{object}</Row>)}
        {this.state.resultsExhausted && <ResultsEnd/>}
      </>
    );
  }
}

export default ResultsListView;