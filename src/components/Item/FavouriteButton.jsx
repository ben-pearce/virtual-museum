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

class FavouriteButton extends React.Component {
  static propTypes = {
    type: PropType.string.isRequired,
    id: PropType.string.isRequired
  }

  static contextType = UserContext

  constructor(props) {
    super(props);

    this.state = {
      favourited: null,
      processing: false,
      loginModalShow: false
    };

    this.authenticated = null;

    this.handleLoginModalShow = this.handleLoginModalShow.bind(this);
    this.handleLoginModalHide = this.handleLoginModalHide.bind(this);
    this.handleToggleFavourite = this.handleToggleFavourite.bind(this);
    this.handleGetFavourited = this.handleGetFavourited.bind(this);
  }

  componentDidUpdate() {
    if(this.context.authenticated !== this.authenticated) {
      this.handleGetFavourited();
      this.authenticated = this.context.authenticated;
    }
  }

  componentDidMount() {
    this.authenticated = this.context.authenticated;
    this.handleGetFavourited();
  }

  handleGetFavourited() {
    axios.get(`/favourite/${this.props.type}`, { 
      baseURL: Config.api.base, 
      params: { 
        [`${this.props.type}Id`]: this.props.id 
      } 
    }).then((r) => {
      if(r.status === 200) {
        this.setState({ favourited: true });
      }
    }).catch(() => {
      this.setState({ favourited: false });
    });
  }

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

  handleLoginModalShow() {
    this.setState({ loginModalShow: true });
  }

  handleLoginModalHide() {
    this.setState({ loginModalShow: false });
  }

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