import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import noImage from '../no-Image.jpg'
import { Link, useParams } from 'react-router-dom'

const MovieDetails = () => {

  const [movie, setMovie] = useState(null)

  // const {movieid} = this.props.match.params

  const params = useParams()
  console.log(params)

  useEffect(() => {
     fetch(process.env.REACT_APP_API_URL + '/Movie/' + params.movieid)
    .then(res => res.json())
    .then(res => {
      if(res.status === true){
        setMovie(res.data)
        
      }
    })
    .catch(err => alert('error in getting data'))
  },[])

  return (
    <>
      <Row>
        {movie && 
          <>
            <Col item='true' xs={12} md={4}>
              <img src={movie.coverImage || noImage} style={{width:300,height:300}} />
            </Col>
            <Col item='true' xs={12} md={8}>
              <h3>{movie.title}</h3>
              <p>{movie.description || 'N/A'}</p>
              <div><b>Languge:</b></div>
              <div>{movie.language}</div>
              <div><b>Release Date:</b></div>
              <div>{movie.releaseDate && movie.releaseDate.split('T')[0]}</div>
              <div><b>Cast:</b></div>
              <div>{movie.actors.map(x => x.name).join(", ")}</div>
            </Col>
            <Col>
              <Link to='/'>Go to Home Page</Link>
            </Col>
          </>
        }
      </Row>
    </>
  )
}

export default MovieDetails