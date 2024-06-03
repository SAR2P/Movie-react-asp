import React, { act, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useParams } from "react-router";


const CreatEditActor = () => {
  const location = useLocation();

  const [actor, setActor] = useState({
    id: 0,
    name: "",
    dateOfBirth: undefined,
  });
  const [validated, setValidated] = useState(false);

  //     const params = useParams()
  //     console.log(params)

  //     useEffect(() => {
  //        fetch(process.env.REACT_APP_API_URL + '/person/' + params.actorid)
  //       .then(res => res.json())
  //       .then(res => {
  //         if(res.status === true){
  //           setActor(res.data)
  //         }
  //       })
  //       .catch(err => alert('error in getting actor'))
  //     },[])


  useEffect(() => {

   if(location.state && location.state.id > 0 ){
    let personDate = location.state
    if(personDate.dateOfBirth !== null && personDate.dateOfBirth !== undefined){
        personDate.dateOfBirth = personDate.dateOfBirth.split('T')[0]
    }
    setActor(personDate)
   }
   else{
    setActor({
        id:0,
        name:''
    })
   }

}, []);

  

  const FilehandleChange = (event) => {
    var da = actor;
    da[event.target.name] = event.target.value;

    setActor((oldData) => {
      return { ...oldData, ...da };
    });
  };

  
  
  const handleSave = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if(form.checkValidity() === false){
        event.stopPropagation()
        setValidated(true)
        return
    }


    if(actor && actor.id > 0){
        //update
        fetch(process.env.REACT_APP_API_URL + '/person',{
            method: 'PUT',
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(actor)
        })
        .then((res) => res.json())
      .then((res) => {
        if(res.status === true && res.data){
            let personDate = res.data
            if(personDate.dateOfBirth !== null && personDate.dateOfBirth !== undefined){
                personDate.dateOfBirth = personDate.dateOfBirth.split('T')[0]
            }
            setActor(personDate)
            alert('updated succesfuly')
        }
      })
      .catch((err) => alert("error in getting data"));
    }
    else{
        //create
        fetch(process.env.REACT_APP_API_URL + '/person',{
            method: 'POST',
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(actor)
        })
        .then((res) => res.json())
      .then((res) => {
        if(res.status === true && res.data){
            let personDate = res.data
            if(personDate.dateOfBirth !== null && personDate.dateOfBirth !== undefined){
             personDate.dateOfBirth = personDate.dateOfBirth.split('T')[0]
            }
            setActor(res.data)
            alert('Created succesfuly')
            
        }
      })
      .catch((err) => alert("error in getting data"));
    }
  }


  

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSave}>
        <Form.Group controlId="formActorName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={actor.name || ""}
            required
            type="text"
            autoComplete="off"
            placeholder="Enter Name"
            onChange={FilehandleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter actor name
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formActorDateOfBirth">
          <Form.Label>Birth Date</Form.Label>
          <Form.Control
            name="dateOfBirth"
            value={actor.dateOfBirth || ""}
            required
            type="date"
            placeholder="Enter Movie date"
            onChange={FilehandleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please Enter date Of Birth
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit">
          {actor && actor.id > 0 ? "Update" : "Create"}
        </Button>
      </Form>
    </>
  );
};

export default CreatEditActor;
