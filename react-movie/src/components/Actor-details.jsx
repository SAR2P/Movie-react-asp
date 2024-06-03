import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

const ActorDetails = () => {
   
  const [actor, setActor] = useState(null)

  // const {movieid} = this.props.match.params

  const params = useParams()
  console.log(params)
  
  useEffect(() => {
     fetch(process.env.REACT_APP_API_URL + '/person/' + params.actorid)
    .then(res => res.json())
    .then(res => {
      if(res.status === true){
        setActor(res.data)
        
      }
    })
    .catch(err => alert('error in getting actor'))
  },[])

  return (
    <>
      <Row>
        {actor && 
          <>
           
            <Col item='true' xs={12} md={8}>
              <h3>Actor Name:</h3>
              <h2>{actor.name}</h2>
              <div><b>Date of Birth:</b></div>
              <div>{actor.dateOfBirth}</div>
            </Col>
            <Col>
              <Link to='/actors'>Go to Actors Page</Link>
            </Col>
          </>
        }
      </Row>
    </>
  )
}

export default ActorDetails