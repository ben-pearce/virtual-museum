import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import { Deserializer } from 'jsonapi-serializer';

import Config from '../../museum.config';

const UserContext = React.createContext({ 
  authenticated: false,
  user: null,
  setUser: () => {},

  logoutUser: () => {},

  ready: false
});


class AuthProvider extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      user: null,
      ready: false
    };

    this.setUser = this.setUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  componentDidMount() {
    axios.get('/profile', { baseURL: Config.api.base }).then((r) => {
      if(r.status === 200) {
        new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data).then((user) => {
          this.setUser(user);
        });
      }
    }).catch(() => this.setUser(null));
  }

  setUser(user) {
    this.setState({ 
      user: user, 
      ready: true, 
      authenticated: user !== null 
    });
  }

  logoutUser() {
    axios.get('/logout', { baseURL: Config.api.base }).then((r) => {
      if(r.status === 200) {
        this.setUser(null);
      }
    });
  }

  render() {
    const value = {
      ...this.state,
      setUser: this.setUser,
      logoutUser: this.logoutUser
    };

    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export { AuthProvider, UserContext };