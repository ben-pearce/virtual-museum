import React from 'react';

import Helmet from 'react-helmet';

import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';

import { UserContext } from '../User/AuthProvider';

import Config from '../../museum.config';

/**
 * Component for profile homepage.
 */
class Home extends React.Component {

  /**
   * Creates a new profile homepage component instance.
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders profile homepage.
   * 
   * @returns {ReactNode} The react node to render.
   */
  render() {
    return (
      <UserContext.Consumer>
        {({ user }) => 
          <>
            <Helmet>
              <title>{`Profile (${user.firstName}) - ${Config.site.name}`}</title>
            </Helmet>
            <Alert variant='success'>
              <Alert.Heading>Hey {user.firstName}, welcome to your <strong>profile</strong>!</Alert.Heading>
              <p>
                You can see details about yourself and view and manage your favourites here.
              </p>
            </Alert>
            <Card>
              <Card.Body>
                <p><strong>User ID: </strong></p> <pre>{user.id}</pre>
                <hr/>
                <p><strong>First Name: </strong> {user.firstName}</p>
                <p><strong>Last Name: </strong> {user.lastName}</p>
                <hr/>
                <p><strong>Email Address: </strong> {user.email}</p>
              </Card.Body>
            </Card>
          </>}
      </UserContext.Consumer>
    );
  }
}

export default Home;