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

function App() {
  return (
    <Router>
      <Jumbotron fluid className='museumtron mb-0'>
        <Container fluid='lg'>
          <Link to='/' className='title text-decoration-none'>
            <h1>{Config.site.name}</h1>
            <p>{Config.site.tagline}</p>
          </Link>
        </Container>
      </Jumbotron>
      <ProgressBar variant='primary' now={0} className='mb-4 page-progress' />
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
  );
}

export default App;
