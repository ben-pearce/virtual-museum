import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import { Deserializer } from 'jsonapi-serializer';

import Config from '../../museum.config';

/**
 * React context that provides access to user authentication API from react
 * components far down in the react component tree.
 */
const UserContext = React.createContext({ 
  authenticated: false,
  user: null,
  setUser: () => {},

  logoutUser: () => {},

  ready: false
});

/**
 * Children of this class are provided access to authentication methods and
 * attributes such as user data and a logout method.
 */
class AuthProvider extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  }

  /**
   * Create auth provider component instance.
   * 
   * @param {object} props Component properties.
   */
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

  /**
   * Make request to API profile endpoint to check if user is authenticated on
   * component mount.
   *
   * If the user is authenticated then the state will be updated to notify all
   * children that user data is now accessible.
   */
  componentDidMount() {
    axios.get('/profile', { baseURL: Config.api.base }).then((r) => {
      if(r.status === 200) {
        new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data).then((user) => {
          this.setUser(user);
        });
      }
    }).catch(() => this.setUser(null));
  }

  /**
   * Sets the component state to indicate whether the user is authenticated.
   *
   * @param {object|null} user The user data.
   */
  setUser(user) {
    this.setState({ 
      user: user, 
      ready: true, 
      authenticated: user !== null 
    });
  }

  /**
   * Initiates axios request to end the user session.
   */
  logoutUser() {
    axios.get('/logout', { baseURL: Config.api.base }).then((r) => {
      if(r.status === 200) {
        this.setUser(null);
      }
    });
  }

  /**
   * Render the auth provider component.
   *
   * Passes state and method access down into the child components.
   *
   * @returns {ReactNode} The react node.
   */
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