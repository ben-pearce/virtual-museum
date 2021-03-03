import React from 'react';

import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShareAlt,
  faClipboard
} from '@fortawesome/free-solid-svg-icons';

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

const ShareButton = () => {
  return (
    <OverlayTrigger trigger='click' placement='bottom' overlay={sharePopover}>
      <Button 
        size='sm' 
        variant='outline-dark' 
        className='mr-1'
      ><FontAwesomeIcon icon={faShareAlt} /> Share</Button>
    </OverlayTrigger>
  );
};

export default ShareButton;