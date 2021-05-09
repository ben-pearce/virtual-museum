import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import Config from './museum.config';

import Search from './components/Search/Search';
import Object from './components/Item/Object/Object';
import Person from './components/Item/Person/Person';
import Profile from './components/Profile/Profile';
import AccountMenu from './components/User/AccountMenu';
import { AuthProvider } from './components/User/AuthProvider';

/**
 * Mounts the React router instance into the main application. 
 *
 * Wraps the router in an {@link AuthProvider} parent node so that children are
 * able to access the auth methods.
 *
 * @returns {ReactNode} The application react node.
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Jumbotron fluid className='museumtron'>
          <Container fluid='lg'>
            <div className='d-flex'>
              <div className='flex-grow-1'>
                <Link to='/' className='title text-decoration-none'>
                  <h1>{Config.site.name}</h1>
                  <p>{Config.site.tagline}</p>
                </Link>
              </div>
              <div className='align-self-center'>
                <AccountMenu/>
              </div>
            </div>
          </Container>
        </Jumbotron>
        <Container fluid='lg'>
          <Switch>
            <Route exact path='/'>
              <Redirect to='/search'/>
            </Route>
            <Route path='/search'>
              <Search />
            </Route>
            <Route path='/object/:objectId'>
              <Object />
            </Route>
            <Route path='/person/:personId'>
              <Person />
            </Route>
            <Route path='/profile'>
              <Profile />
            </Route>
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
};


export default App;
