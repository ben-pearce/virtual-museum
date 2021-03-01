import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShareAlt,
  faCode,
  faClipboard
  //faStar as fullStar
} from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

import Config from '../../museum.config';


const ShareToolbar = (props) => {

  const sharePopover = (
    <Popover>
      <Popover.Title as='h3'>Share</Popover.Title>
      <Popover.Content>
        <InputGroup>
          <FormControl
            readOnly
            id='sharePageUrl'
            aria-label='Page URL'
            value={window.location.href}
          />
          <InputGroup.Append>
            <OverlayTrigger
              trigger={['hover', 'click']}
              placement='bottom'
              overlay={<Tooltip>Copy to clipboard</Tooltip>}
            >
              <Button 
                variant='outline-secondary'
                onClick={() => {
                  const shareUrlInput = document.getElementById('sharePageUrl');
                  shareUrlInput.select();
                  document.execCommand('copy');

                }}
              > <FontAwesomeIcon icon={faClipboard}/></Button>
            </OverlayTrigger>
          </InputGroup.Append>
        </InputGroup>
      </Popover.Content>
    </Popover>
  );

  return (
    <ButtonToolbar className='mb-2'>
      <OverlayTrigger trigger='click' placement='bottom' overlay={sharePopover}>
        <Button 
          size='sm' 
          variant='outline-dark' 
          className='mr-1'
        ><FontAwesomeIcon icon={faShareAlt} /> Share</Button>
      </OverlayTrigger>
      <Button 
        size='sm' 
        variant='outline-dark' 
        className='mr-1'
        href={new URL(`/object/${props.object.id}`, Config.api.base).toString()}
        target='_blank'
      ><FontAwesomeIcon icon={faCode} /> JSON</Button>
      <Button 
        size='sm' 
        variant='outline-dark' 
      ><FontAwesomeIcon icon={emptyStar} /> Favourite</Button>
    </ButtonToolbar>
  );
};

ShareToolbar.propTypes = {
  object: PropTypes.object
};


export default ShareToolbar;