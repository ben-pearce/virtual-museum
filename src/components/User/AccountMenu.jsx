import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import LoginModal from './LoginModal';

import { UserContext } from './AuthProvider';

import {
  Link
} from 'react-router-dom';

/**
 * Component for account drop down menu.
 */
class AccountMenu extends React.Component {
  /**
   * Create account menu component instance.
   * 
   * @param {object} props Component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      loginModalShow: false
    };

    this.handleShowLoginModal = this.handleShowLoginModal.bind(this);
    this.handleCloseLoginModal = this.handleCloseLoginModal.bind(this);
  }

  /**
   * Sets login modal visibility state to visible.
   */
  handleShowLoginModal() {
    this.setState({
      loginModalShow: true
    });
  }

  /**
   * Sets login modal visible state to hidden.
   */
  handleCloseLoginModal() {
    this.setState({
      loginModalShow: false
    });
  }

  /**
   * Renders the account menu.
   * 
   * @returns {ReactNode} The react node.
   */
  render() {
    return (
      <UserContext.Consumer>
        {({ authenticated, user, setUser, logoutUser }) => 
          <>
            <LoginModal 
              show={this.state.loginModalShow} 
              onHide={this.handleCloseLoginModal} 
              success={(user) => {
                this.handleCloseLoginModal();
                setUser(user);
              }}/>
            {!authenticated ? 
              <div className='account-menu'>
                <Button variant='outline-light' onClick={this.handleShowLoginModal}>
                    Login
                </Button>
              </div> :
              <Dropdown className='account-menu'>
                <Dropdown.Toggle variant='outline-light'>
                    Hello, {user.firstName}
                </Dropdown.Toggle>
                <Dropdown.Menu align='right'>
                  <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to='/profile/favourites'>Favourites</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className='text-danger' onClick={logoutUser}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>}
          </>}
      </UserContext.Consumer>
    );
  }
}

export default AccountMenu;