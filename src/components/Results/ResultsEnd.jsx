import React from 'react';

import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrain
} from '@fortawesome/free-solid-svg-icons';

const ResultsEnd = () => {
  return (
    <div className='text-muted mt-3 mb-3'>
      <div className='d-flex justify-content-center'>
        <FontAwesomeIcon className='h1' icon={faTrain}/>
      </div>
      <div className='d-flex justify-content-center'>
        <p className='h1'>End of the line</p>
      </div>
      <div className='d-flex justify-content-center'>
        <Button variant='primary' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top?</Button>
      </div>
    </div>
  );
};

export default ResultsEnd;