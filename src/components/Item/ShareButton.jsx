import React, { useState } from 'react';

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

/**
 * A share button for copying object or person page URL to the clipboard.
 *
 * Clicking displays a pop-over with textbox containing URL.
 *
 * @returns {ReactNode} The {@link OverlayTrigger} react node.
 */
const ShareButton = () => {
  const [url, setUrl] = useState(window.location.href);

  return (
    <OverlayTrigger 
      trigger='click' 
      placement='bottom' 
      onToggle={() => setUrl(window.location.href)}
      overlay={
        <Popover>
          <Popover.Title as='h3'>Share</Popover.Title>
          <Popover.Content>
            <InputGroup>
              <FormControl
                readOnly
                id='sharePageUrl'
                aria-label='Page URL'
                value={url}
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
      }>
      <Button 
        size='sm' 
        variant='outline-dark' 
        className='mr-1'
      ><FontAwesomeIcon icon={faShareAlt} /> Share</Button>
    </OverlayTrigger>
  );
};

export default ShareButton;