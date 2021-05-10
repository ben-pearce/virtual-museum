import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGhost
} from '@fortawesome/free-solid-svg-icons';

/**
 * A message displayed to the user when there are no results to show in the
 * results view.
 *
 * @returns {ReactNode} The react node.
 */
const ResultsEmpty = () => {
  return (
    <div className='text-muted mt-3 mb-3'>
      <div className='d-flex justify-content-center'>
        <FontAwesomeIcon className='h1' icon={faGhost}/>
      </div>
      <div className='d-flex justify-content-center'>
        <p className='h1'>Nothin&apos; to see here</p>
      </div>
      <div className='d-flex justify-content-center'>
        <p>Try refining your search results or clearing some filters.</p>
      </div>
    </div>
  );
};

export default ResultsEmpty;