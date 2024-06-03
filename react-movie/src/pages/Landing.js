import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import MovieList from '../components/Movie-list'
import CreateMovieModel from '../components/Create-movie-model'

const Landing = () => {

  const [show,setShow] =useState(false)

  return (
    <>
      <Row>
        <Col xs={12} md={10}>
          <h2>Movies</h2>
        </Col>
        <Col xs={12} md={2} className='align-self-center'>
          <Button className='float-right' onClick={() => {setShow(true)}}>Add New Movie</Button>
        </Col>
      </Row>

      <MovieList />{/*Get Movies */}
      <CreateMovieModel show={show} handleClose={() => setShow(false)} />{/*Post Movie */}
    </>
  )
}

export default Landing