import { Container, Nav, Navbar } from 'react-bootstrap';
import './App.css';
import { BrowserRouter, Link, Route, Routes, Switch  } from 'react-router-dom'
import Landing from './pages/Landing';
import Actor from './pages/Actor';
import EditMovie from './components/Edit-movie';
import MovieDetails from './components/Moviedetails';
import CreatEditActor from './components/Creat-edit-actor';
import ActorDetails from './components/Actor-details';

function App() {
  return (
    <Container>
      <BrowserRouter>
          <Navbar bg='dark' variant='dark'>
              <Navbar.Brand as={Link} to='/'>Movie Website</Navbar.Brand>
              <Nav className='mr-auto'>
                <Nav.Link as={Link} to='/'>Movies</Nav.Link>
                <Nav.Link as={Link} to='/actors'>Actors</Nav.Link>
              </Nav>
          </Navbar>
          <Routes >
              <Route exact path='/' Component={() => <Landing />} />
              <Route exact path='/details/:movieid' Component={MovieDetails} />
              <Route exact path='/edit/:movieid' Component={EditMovie} />
              <Route exact path='/actors' Component={Actor} />
              <Route exact path='/actors/create-edit' Component={CreatEditActor} />
              <Route exact path='/actors/details/:actorid' Component={ActorDetails} />
          </Routes >
          
      </BrowserRouter>
    </Container>


  );
}

export default App;
