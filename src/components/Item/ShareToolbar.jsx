import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode
} from '@fortawesome/free-solid-svg-icons';

import FavouriteButton from './FavouriteButton';
import ShareButton from './ShareButton';

import Config from '../../museum.config';

/**
 * Share toolbar component displayed on person and object pages. 
 *
 * Integrates the share button and favourite button into a single toolbar. 
 * 
 * @param {object} props Component properties.
 * @param {object} props.object Museum object data.
 * @param {object} props.person Museum person data.
 * @returns {ReactNode} The {@link ButtonToolbar} react node.
 */
const ShareToolbar = (props) => {
  const type = props.object ? 'object' : 'person';
  const id = props.object ? props.object.id : props.person.id;
  return (
    <ButtonToolbar className='mb-2'>
      <ShareButton />
      <Button 
        size='sm' 
        variant='outline-dark' 
        className='mr-1'
        href={new URL(`${type}/${id}`, Config.api.base).toString()}
        target='_blank'
      ><FontAwesomeIcon icon={faCode} /> JSON</Button>
      <FavouriteButton type={type} id={id} />
    </ButtonToolbar>
  );
};

ShareToolbar.propTypes = {
  object: PropTypes.object,
  person: PropTypes.object
};


export default ShareToolbar;