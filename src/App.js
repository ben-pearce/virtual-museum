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
import AccountMenu from './components/User/AccountMenu';

import UserContext from './userContext';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.setAuthenticated = this.setAuthenticated.bind(this);

    this.state = {
      authenticated: false,
      setAuthenticated: this.setAuthenticated
    };
  }

  setAuthenticated(authenticated) {
    this.setState({ authenticated: authenticated });
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
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
                <div>
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
              </Route>
            </Switch>
          </Container>
        </Router>
      </UserContext.Provider>
    );
  }

}

export default App;
