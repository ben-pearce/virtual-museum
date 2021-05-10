import React from 'react';
import PropTypes from 'prop-types';

import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Deserializer } from 'jsonapi-serializer';

import axios from 'axios';

import Config from '../../museum.config';

import { 
  withRouter,
  Link
} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCube,
  faUser,
  faTrash,
  faGhost
} from '@fortawesome/free-solid-svg-icons';

const FavouriteDeserializer = new Deserializer({keyForAttribute: 'camelCase'});

/**
 * Component for message displayed when user has not favourites any objects yet.
 * 
 * @returns {ReactNode} The react node.
 */
const NoFavourites = () => {
  return (
    <div className='text-muted mt-3 mb-3'>
      <div className='d-flex justify-content-center'>
        <FontAwesomeIcon className='h1' icon={faGhost}/>
      </div>
      <div className='d-flex justify-content-center'>
        <p className='h1'>You have no favourites</p>
      </div>
      <div className='d-flex justify-content-center'>
        <p>Go and explore the museum to create favourites.</p>
      </div>
    </div>
  );
};

/**
 * React component for profile favourites page, supports both object and person
 * favourites.
 */
class Favourites extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };


  /**
   * Creates a new favourites page component instance.
   *
   * @param {object} props Component properties
   * @param {object|null} props.favourites The favourites to display to the user.
   */
  constructor(props) {
    super(props);

    this.state = {
      favourites: null
    };

    this.handleGetFavourites = this.handleGetFavourites.bind(this);
    this.handleOnGetFavouritesResponse = this.handleOnGetFavouritesResponse.bind(this);
  }

  /**
   * Initiates request to API to retrieve favourites to render.
   */
  componentDidMount() {
    this.handleGetFavourites();
  }

  /**
   * Initiates axios request to the API in order to retrieve the favourites.
   *
   * The type of favourites (i.e. `person` or `object`) will be determined by
   * the URL path.
   */
  handleGetFavourites() {
    const type = this.props.match.params.type;

    this.setState({ favourites: null });
    axios.get(`/favourite/${type}`, { baseURL: Config.api.base })
      .then(this.handleOnGetFavouritesResponse);
  }

  /**
   * Handles favourites response from the API and updates the state of the
   * component.
   * 
   * @param {string} resp Raw response from the API.
   */
  handleOnGetFavouritesResponse(resp) {
    FavouriteDeserializer.deserialize(resp.data).then((favourites) => {
      this.setState({ favourites: favourites });
    });
  }

  /**
   * Renders favourites list.
   * 
   * @returns {ReactNode} The react node to render.
   */
  render() {
    if(this.state.favourites === null) {
      return (<div className='d-flex justify-content-center'>
        <Spinner animation='border' variant='dark' />
      </div>);
    }

    const confirmationModal = (
      <Modal show={this.state.requestToDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete &apos;{}&apos;?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='seconary'>Cancel</Button>
          <Button variant='danger'>Delete</Button>
        </Modal.Footer>
      </Modal>
    );

    const type = this.props.match.params.type;
    return(
      <Card>
        {confirmationModal}
        <Card.Body>
          <Card.Title className='mb-4'>
            {type === 'object' ? 
              <><FontAwesomeIcon icon={faCube}/> Favourite Objects</> :
              <><FontAwesomeIcon icon={faUser}/> Favourite People</>}
          </Card.Title>
          {this.state.favourites.length === 0 ?
            <NoFavourites /> :
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.favourites.map((favourite, i) => 
                  <tr key={i}>
                    <td className='align-middle' width='1'>{i}</td>
                    <td className='align-middle' width='20%'>{favourite[type].id}</td>
                    <td className='align-middle'>
                      <Link to={`/${type}/${favourite[type].id}`}>
                        {favourite[type].name}
                      </Link>
                    </td>
                    <td width='1'>
                      <Button 
                        item={favourite[type]}
                        variant='danger' 
                        size='sm' 
                        onClick={this.handleDeleteItem}>
                        <FontAwesomeIcon icon={faTrash}/>
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          }
        </Card.Body>
      </Card>
    );
  }
}

export default withRouter(Favourites);