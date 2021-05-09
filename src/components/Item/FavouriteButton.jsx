import React from 'react';
import PropType from 'prop-types';

import Button from 'react-bootstrap/Button';

import { UserContext } from '../User/AuthProvider';
import LoginModal from '../User/LoginModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as fullStar
} from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

import axios from 'axios';

import Config from '../../museum.config';

import { Deserializer } from 'jsonapi-serializer';

/**
 * React component for favourite button displayed on object and person pages.
 */
class FavouriteButton extends React.Component {
  /**
   * FavouriteButton prop types.
   * 
   * @static
   * @member {object}
   */
  static propTypes = {
    type: PropType.string.isRequired,
    id: PropType.string.isRequired
  }

  static contextType = UserContext

  /**
   * Creates a favourite button component instance.
   * 
   * @param {object} props Component properties.
   * @param {string} props.type Type of item `person` or `object`.
   * @param {string} props.id ID of item.
   */
  constructor(props) {
    super(props);

    this.state = {
      /** Is the item favourited, null if loading */
      favourited: null,
      /** Is transaction in progress */
      processing: false,
      /** Login modal visiblity state */
      loginModalShow: false
    };

    /**
     * Set true or false once {@link UserContext} becomes available.
     * @member {boolean|null}
     */
    this.authenticated = null;

    this.handleLoginModalShow = this.handleLoginModalShow.bind(this);
    this.handleLoginModalHide = this.handleLoginModalHide.bind(this);
    this.handleToggleFavourite = this.handleToggleFavourite.bind(this);
    this.handleGetFavourited = this.handleGetFavourited.bind(this);
  }

  /**
   * Check if the {@link UserContext} has become available, if it has then
   * request favourite status from the API.
   */
  componentDidUpdate() {
    if(this.context.authenticated !== this.authenticated) {
      this.handleGetFavourited();
      this.authenticated = this.context.authenticated;
    }
  }

  /**
   * Requests favourite status as soon as component is mounted in the
   * application.
   */
  componentDidMount() {
    this.authenticated = this.context.authenticated;
    this.handleGetFavourited();
  }

  /**
   * Initiates axios request to the API for favourite status of the relevant
   * item. Then proceeds to update the state of the component.
   */
  handleGetFavourited() {
    axios.get(`/favourite/${this.props.type}`, { 
      baseURL: Config.api.base, 
      params: { 
        [`${this.props.type}Id`]: this.props.id 
      } 
    })
      .then(r => new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data))
      .then(d => {
        this.setState({ favourited: d.length > 0 });
      });
  }

  /**
   * Event handle for toggling the favourite status. Initiates axios requests
   * either will be POST to favourite or DELETE to unfavourite, then proceeds to
   * update the state of the component.
   */
  handleToggleFavourite() {
    this.setState({ processing: true });
    if(!this.state.favourited) {
      axios.post(`/favourite/${this.props.type}`, { 
        [`${this.props.type}Id`]: this.props.id
      }, {
        baseURL: Config.api.base
      }).then(() => {
        this.setState({ 
          favourited: true,
          processing: false 
        });
      });
    } else {
      axios.delete(`/favourite/${this.props.type}/${this.props.id}`, {
        baseURL: Config.api.base
      }).then(() => {
        this.setState({ 
          favourited: false,
          processing: false
        });
      });
    }
  }

  /**
   * Sets the visibility state of the login modal to visible.
   */
  handleLoginModalShow() {
    this.setState({ loginModalShow: true });
  }

  /**
   * Sets the visibility state of the login modal to hidden.
   */
  handleLoginModalHide() {
    this.setState({ loginModalShow: false });
  }

  /**
   * Renders favourite button.
   * 
   * @returns {ReactNode} The react node to render.
   */
  render() {
    return (
      <UserContext.Consumer>
        {({ ready, authenticated, setUser }) => 
          <>
            <LoginModal 
              show={this.state.loginModalShow}
              onHide={this.handleLoginModalHide}
              success={(user) => {
                this.handleLoginModalHide();
                setUser(user);
              }}/>
            {ready && this.state.favourited !== null && <Button 
              size='sm' 
              variant='outline-dark'
              onClick={!authenticated ? this.handleLoginModalShow : this.handleToggleFavourite}
              disabled={this.state.processing}>
              <FontAwesomeIcon 
                icon={this.state.favourited && authenticated ? fullStar : emptyStar} /> &nbsp;
              {this.state.favourited && authenticated ? 'Unfavourite' : 'Favourite'}
            </Button>}
          </>
        }
      </UserContext.Consumer>
    );
  }
}

export default FavouriteButton;