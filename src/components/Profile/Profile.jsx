import React from 'react';
import PropTypes from 'prop-types';

import {
  Switch,
  Route,
  Redirect,
  NavLink
} from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import Spinner from 'react-bootstrap/Spinner';

import Home from './Home';
import Favourites from './Favourites';

import { UserContext } from '../User/AuthProvider';

import { withRouter } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle,
  faStar
} from '@fortawesome/free-solid-svg-icons';

class Profile extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  render () {
    return (
      <UserContext.Consumer>
        {({ authenticated, ready }) => {
          if(!ready) {
            return (
              <div className='d-flex justify-content-center'>
                <Spinner animation='border' variant='dark' />
              </div>
            );
          }

          if(!authenticated) {
            return <Redirect to='/'/>;
          }

          return (
            <Row>
              <Col md={4} lg={3} className='sidebar'>
                <Card className='mb-2'>
                  <Card.Header>
                    <FontAwesomeIcon icon={faUserCircle}/> Profile
                  </Card.Header>
                  <ListGroup variant='flush'>
                    <ListGroup.Item 
                      action 
                      as={NavLink} 
                      to={`${this.props.match.url}/overview`} 
                      activeClassName='active'>
                        Overview
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
                <Card className='mb-2'>
                  <Card.Header>
                    <FontAwesomeIcon icon={faStar}/> Favourites
                  </Card.Header>
                  <ListGroup variant='flush'>
                    <ListGroup.Item 
                      action 
                      as={NavLink} 
                      to={`${this.props.match.url}/favourites/object`} 
                      activeClassName='active'>
                        Objects
                    </ListGroup.Item>
                    <ListGroup.Item 
                      action 
                      as={NavLink} 
                      to={`${this.props.match.url}/favourites/person`} 
                      activeClassName='active'>
                        People
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              <Col>
                <Switch>
                  <Route exact path={this.props.match.url}>
                    <Redirect to={`${this.props.match.url}/overview`} />
                  </Route>
                  <Route exact path={`${this.props.match.url}/favourites`}>
                    <Redirect to={`${this.props.match.url}/favourites/object`} />
                  </Route>
                  <Route path={`${this.props.match.url}/overview`}>
                    <Home />
                  </Route>
                  <Route 
                    path={`${this.props.match.url}/favourites/:type`}
                    render={props => <Favourites key={props.location.key} {...props} />}
                  />
                </Switch>
              </Col>
            </Row>
          );
        }}
      </UserContext.Consumer>
    );
  }
}

export default withRouter(Profile);