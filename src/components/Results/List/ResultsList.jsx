import React from 'react';

import ListObject from './ListObject';

import Row from 'react-bootstrap/Row';
import Results from '../Results';
import ResultsEnd from '../ResultsEnd';
import ResultsEmpty from '../ResultsEmpty';

class ResultsListView extends Results {
  createPreloadComponent() {
    return <ListObject preload />;
  }

  createLoadedComponent(object) {
    const image = this.images[this.objectCache.indexOf(object)];
    return (<ListObject image={image} object={object} />);
  }

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