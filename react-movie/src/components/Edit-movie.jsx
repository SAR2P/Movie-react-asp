import React, {  useEffect, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import AsyncSelect from 'react-select/async'
import NoImage from "../no-Image.jpg";
import { useParams } from "react-router";


const EditMovie = () => {
  const [movie, setMovie] = useState({});
    const [validated,setValidated] = useState(false)
    const [actors,setActors] = useState(null)

      const params = useParams()  
  

    useEffect(()=> {//if this page come up by eddit button in movie List
      if(params !== undefined && params !== undefined){
        fetch(process.env.REACT_APP_API_URL + '/movie/' + params.movieid)
        .then(res => res.json())
        .then(res => {
          if(res.status === true){
            let movieCreate = res.data
            if(movieCreate.releaseDate !== null && movieCreate.releaseDate !== undefined){
              movieCreate.releaseDate = movieCreate.releaseDate.split('T')[0]
            }
            setMovie(movieCreate)
            setActors(res.data.actors.map(x => {return{value: x.id, lable: x.name}}))
            
          }
        })
        .catch(err => alert('error in getting data'))
      }
    },[])


  const handleFileUpload = (event) => {
    event.preventDefault();

    var file = event.target.files[0];
    const form = new FormData();
    form.append("imageFile", file);
    {
      /*in abov codes we get the photo from client and put it insid the form varible we created */
    }
    {
      /* then in the next codes we fetch the post cover method and send the form Varible that we created above
            and after that we recive the image Address From the api by the last (then) method        
       */
    }
    fetch(process.env.REACT_APP_API_URL + "/Movie/upload-movie-poster", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        var da = movie;
        da.coverImage = res.profileImage;

        setMovie((oldData) => {
          return { ...oldData, ...da };
        });
      })
      .catch((err) => alert("error in file upload"));
  };


  const handleSave = (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if(form.checkValidity() === false){
        event.stopPropagation()
        setValidated(true)
        return
    }

    let movieToPost = movie

    movieToPost.actors = movieToPost.actors.map(x => x.id)

    if(movie && movie.id > 0){
        //update
        fetch(process.env.REACT_APP_API_URL + '/movie',{
            method: 'PUT',
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(movieToPost)
        })
        .then((res) => res.json())
      .then((res) => {
        if(res.status === true && res.data){
            setMovie(res.data)
            alert('updated succesfuly')
        }
      })
      .catch((err) => alert("error in getting data"));
    }
    else{
        //create
        fetch(process.env.REACT_APP_API_URL + '/Movie',{
            method: 'POST',
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(movieToPost)
        })
        .then((res) => res.json())
      .then((res) => {
        if(res.status === true && res.data){
            setMovie(res.data)
            alert('Created succesfuly')
        }
      })
      .catch((err) => alert("error in getting data"));
    }
  }


  const handleFieldChange = (event) => {
    var da = movie;
    da[event.target.name] = event.target.value

    setMovie((oldData) => {
      return { ...oldData, ...da };
    });
  };

 

  const promiseOptions = (inputValue) => {
    return fetch(process.env.REACT_APP_API_URL + '/Person/search/'+ inputValue)
    .then(res => res.json())
    .then(res => { 
        if(res.status === true && res.data.length > 0){
            return res.data.map(x => {return{value: x.id, label: x.name}})
        }

        if(res.data.count === 0){
            alert('there is no actor matching this name.')
        }
    })
    .catch(err => alert('error getting actor'))
  }


  const multiSelectChange = (data) => {
    setActors(data);

    var people = data.map(x => {return{id: x.value, name: x.label}});

    var da = movie;
    da.actors = people

    setMovie((oldData) => {
      return { ...oldData, ...da };
    });
  }

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSave}>

        <Form.Group className="d-flex justify-content-center">
          <Image
            width="200"
            height="200"
            src={(movie && movie.coverImage) || NoImage}
          />
        </Form.Group>

        <Form.Group className="d-flex justify-content-center">
          <div>
            <input type="File" onChange={handleFileUpload} />
          </div>
        </Form.Group>

        <Form.Group controlId="formMovieTitle">
          <Form.Label>Movie Title</Form.Label>
          <Form.Control
            name="title"
            value={(movie && movie.title) || ""}
            required
            type="text"
            autoComplete="off"
            placeholder="Enter Movie Name"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter movie name
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formMovieDescription">
          <Form.Label>Movie Description</Form.Label>
          <Form.Control
            name="description"
            value={(movie && movie.description) || ""}
            type="textarea"
            rows={3}
            placeholder="Enter Movie Description"
            onChange={handleFieldChange}
          />
        </Form.Group>

        <Form.Group controlId="formMovieReleaseDate">
          <Form.Label>Release Date</Form.Label>
          <Form.Control
            name="releaseDate"
            value={(movie && movie.releaseDate) || ""}
            required
            type="date"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter movie Release Date
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formMovieReleaseDate">
          <Form.Label>Actors</Form.Label>
          <AsyncSelect cacheOptions isMulti value={actors} loadOptions={promiseOptions} onChange={multiSelectChange} />
        </Form.Group>

        <Form.Group controlId="formMovieLanguage">
          <Form.Label>Movie Languge</Form.Label>
          <Form.Control
            name="language"
            value={(movie && movie.language) || ""}
            type="text"
            rows={3}
            placeholder="Enter Movie Languge"
            onChange={handleFieldChange}
          />
        </Form.Group>

        <Button type="submit">{movie && movie.Id > 0 ? 'Update' : 'Create'}</Button>

      </Form>
    </>
  );
};

export default EditMovie;
