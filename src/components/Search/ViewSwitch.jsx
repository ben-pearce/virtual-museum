import React from 'react';
import PropTypes from 'prop-types';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { withRouter } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faBars
} from '@fortawesome/free-solid-svg-icons';

/**
 * Component for results view switcher.
 */
class ViewSwitchMenu extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  /**
   * Create view switch menu component instance.
   *
   * @param {object} props Component properties.
   * @param {object} props.onChange The callback fired when user changes the
   * view.
   */
  constructor(props) {
    super(props);

    this.state = {
      view: null
    };

    this.handleClickGridButton = this.handleClickGridButton.bind(this);
    this.handleClickListButton = this.handleClickListButton.bind(this);
  }

  /**
   * Retrieves the view from the browser URL and updates the component state if
   * applicable.
   */
  componentDidMount() {
    const queryParams = new URLSearchParams(this.props.location.search);
    let viewQuery = queryParams.get('view');

    if(viewQuery === null) {
      viewQuery = 'grid';
    }

    this.setState({ view: viewQuery });
  }

  /**
   * Invokes the {@link ViewSwitchMenu#onChange} callback if the view has
   * changed since the previous state.
   *
   * @param {object} prevProps Props in the previous state.
   * @param {object} prevState State in the previous state.
   */
  componentDidUpdate(prevProps, prevState) {
    if(prevState.view !== this.state.view) {
      this.props.onChange(this.state.view);
    }
  }

  /**
   * Event handler updates state when grid button is pressed.
   */
  handleClickGridButton() {
    this.setState({
      view: 'grid'
    });
  }

  /**
   * Event handler updates state when list button is pressed.
   */
  handleClickListButton() {
    this.setState({
      view: 'list'
    });
  }

  /**
   * Render the view switch menu.
   * 
   * @returns {ReactNode} The react node.
   */
  render() {
    return (
      <ButtonGroup>
        <Button variant='outline-dark' disabled>View: </Button>
        <OverlayTrigger overlay={
          <Tooltip>
          View as grid
          </Tooltip>
        }>
          <Button 
            onClick={this.handleClickGridButton}
            variant='secondary' 
            active={this.state.view == 'grid'}>
            <FontAwesomeIcon icon={faThLarge} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger overlay={
          <Tooltip>
          View as list
          </Tooltip>
        }>
          <Button 
            onClick={this.handleClickListButton}
            variant='secondary'
            active={this.state.view == 'list'}>
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    );
  }
}

export default withRouter(ViewSwitchMenu);