import { Button, Col, Nav, Row } from 'react-bootstrap'
import NoImage from '../no-Image.jpg'
import { Link } from 'react-router-dom'

//we use the withRouter. whithRouter give to props another value name: history that we used 
//in buttons and also in exporting 
//withRouter => minet: 5/20/00

const MovieItem = (props) => {


    return (
        <>
            <Row className='card '  >

                <Col item='true' xs={12} md={2} className='card-img-top '>
                    <img src={props.data.coverImage || NoImage} style={{ width: 150, height: 150 }} />
                </Col>
                <Col item='true' xs={12} md={10} className='card-body '>
                    <div className='card-text'><b>{props.data.title}</b></div>
                    <div className='card-text'>Actors: {props.data.actors.map(x => x.name).join(", ")}</div>
                    <Button ><Nav.Link as={Link} to={'/details/' + props.data.id}>see Details</Nav.Link></Button>{' '}
                    <Button ><Nav.Link as={Link} to={'/edit/' + props.data.id}>Edit</Nav.Link></Button>{' '}
                    <Button variant='danger' onClick={() => props.deleteMovie(props.data.id)} danger='true' >Delete</Button>
                </Col>
                <Col >
                    <hr />
                </Col>

            </Row>
            {/* onClick={() => navigate('/details/' + props.data.id)} */}

        </>
    )
}

export default MovieItem