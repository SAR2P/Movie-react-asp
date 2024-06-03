import React, { useEffect, useState } from 'react'
import { Row, Col, Nav, Button} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'

const ActorList = () => {
    const [actors,setActors] = useState(null)
    const [actorsCount,setActorsCount] = useState(0)
    const [page,setPage] = useState(0)
    
    useEffect(() => {
        getPerson()

    },[page])

    const getPerson = () => {
        fetch(process.env.REACT_APP_API_URL + "/Person?pageSize=" + process.env.REACT_APP_PAGING_SIZE + "&pageIndex=" + page)
        .then(res => res.json())
        .then(res => {
            if(res.status === true && res.data.count > 0){
                 setActors(res.data.person)
                setActorsCount(Math.ceil(res.data.count / process.env.REACT_APP_PAGING_SIZE))
               
            }

            if(res.data.count === 0){
                alert("there is no actor data in system")
            }
        })
        .catch(err => alert("error getting data")) 
    }

    const handlePageClick = (pageIndex) => {
        setPage(pageIndex.selected)
    }
    
    const deletePerson = (id) => {
        fetch(process.env.REACT_APP_API_URL + '/person?id=' + id,{
            method: 'DELETE',
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json' 
            }
        })
        .then((res) => res.json())
      .then((res) => {
        if(res.status === true){
            alert('deleted')
            getPerson()
        }
      })
      .catch((err) => alert("error in deleting"));
    }
    {/*we created delete function here but we use it in movie Item Component. all is need we just send the function in props*/}

  return (
    <>
        {actors && actors !== [] ?
        <div>
            { actors.map((m,i) => { 
                return(
                        <Row key={i}>
                            <Col>
                            <Nav.Link as={Link} to={'/actors/details/' + m.id}>{m.name}</Nav.Link>
                            {/* <Button><Nav.Link as={Link} to={{ pathname:'/actors/create-edit/' + m.id }}>Edit</Nav.Link> </Button> */}
                            <Button><Link to={'/actors/create-edit/'} state={m}>Edit</Link></Button>
                            <Button variant='danger' onClick={() => deletePerson(m.id)} danger='true' >Delete</Button>
                            <hr />
                            </Col>
                        </Row>
                )
            }) }
        </div>
            : '' 
        }
{/* {'/actors/create-edit/'} */}
        <div className="d-flex justify-content-center">
            <ReactPaginate 
                previousLabel={'previos'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'page-link'}
                pageCount={actorsCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName='page-item'
                pageLinkClassName={'page-link'}
                previousClassName={'page-link'}
                nextClassName={'page-link'}
                activeClassName={'active'}
            /> {/*reacts component for next and prevent option */}
           
        </div>

        
    </>
  )
}

export default ActorList