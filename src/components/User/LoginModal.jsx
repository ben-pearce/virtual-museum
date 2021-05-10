import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Login from './Login';
import SignUp from './SignUp';

/**
 * Component for login modal. 
 *
 * Provides a switch to either create a new account or login to existing
 * account.
 */
class LoginModal extends React.Component {
  static propTypes = {
    success: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      view: 'login'
    };

    this.handleToggleView = this.handleToggleView.bind(this);
  }

  /**
   * Updates the component state to toggle between login and signup forms.
   */
  handleToggleView() {
    this.setState({
      view: this.state.view === 'login' ? 'signup' : 'login'
    });
  }

  /**
   * Renders the react component.
   * 
   * @returns {ReactNode} The react node.
   */
  render() {
    const {success, ...props} = this.props;

    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          {this.state.view === 'login' ? 'Sign In' : 'Create Account'}
        </Modal.Header>
        <Modal.Body>
          {this.state.view === 'login' ? 
            <Login success={success} /> : 
            <SignUp success={success} />}
        </Modal.Body>
        <Modal.Footer>
          {this.state.view === 'login' ? 
            <p>
              Need an account? &nbsp;
              <Button 
                variant='link' 
                className='p-0'
                onClick={this.handleToggleView}>
                Create one
              </Button>.
            </p> :
            <p>
              Got an account already? &nbsp;
              <Button 
                variant='link' 
                className='p-0'
                onClick={this.handleToggleView}>
                Sign in
              </Button>.
            </p>}
        </Modal.Footer>
      </Modal>
    );

  }
}

export default LoginModal;