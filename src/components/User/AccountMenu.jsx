import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import LoginModal from './LoginModal';

import UserContext from '../../userContext';

import {
  Link
} from 'react-router-dom';

class AccountMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginModalShow: false
    };

    this.handleShowLoginModal = this.handleShowLoginModal.bind(this);
    this.handleCloseLoginModal = this.handleCloseLoginModal.bind(this);
  }

  handleShowLoginModal() {
    this.setState({
      loginModalShow: true
    });
  }

  handleCloseLoginModal() {
    this.setState({
      loginModalShow: false,
      view: 'login'
    });
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ authenticated, setAuthenticated }) => !authenticated ? 
          <>
            <LoginModal 
              show={this.state.loginModalShow} 
              onHide={this.handleCloseLoginModal} 
              onSuccess={() => setAuthenticated(true)}/>
            <div className='account-menu'>
              <Button variant='outline-light' onClick={this.handleShowLoginModal}>
                  Login
              </Button>
            </div>
          </>
          :
          <Dropdown className='account-menu'>
            <Dropdown.Toggle variant='outline-light'>
                Hello, {this.state.profileFirstName}
            </Dropdown.Toggle>
            <Dropdown.Menu align='right'>
              <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to='/profile/favourites'>Favourites</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className='text-danger'>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> }
      </UserContext.Consumer>
    );
  }
}

export default AccountMenu;