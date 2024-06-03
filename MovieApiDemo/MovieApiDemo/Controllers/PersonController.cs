using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApiDemo.Data;
using MovieApiDemo.Entities;
using MovieApiDemo.Models;
using MovieApiDemo.ViewModel;

namespace MovieApiDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly MovieDbContext _Context;
        private readonly IMapper _mapper;

        public PersonController(MovieDbContext context, IMapper mapper)
        {
            _Context = context;
            _mapper = mapper;
        }


        [HttpGet]
        public IActionResult Get(int pageIndex = 0, int pageSize = 10)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var actorCount = _Context.Persons.Count();
                var actorList = _mapper.Map<List<ActorViewModel>>(
                    _Context.Persons.Skip(pageIndex * pageSize).Take(pageSize).ToList()
                    );

                response.Status = true;
                response.Message = "success";
                response.Data = new { Person = actorList, count = actorCount };

                return Ok(response);
            }
            catch (Exception ex)
            {
                // todo: do logging exception
                response.Status = false;
                response.Message = "something went wrong";

                return BadRequest(response);
            }
        }




        [HttpGet("{id}")]
        public IActionResult GetPersonById(int id)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {

                var person = _Context.Persons.Where(x => x.Id == id).FirstOrDefault();


                if (person == null)
                {
                    response.Status = false;
                    response.Message = "error. person is not exist";

                    return BadRequest(response);
                }

                var personData = new ActorDetailsViewModel
                {
                    Id = person.Id,
                    DateOfBirth = person.DateOfBirth,
                    Name = person.Name,
                    movies = _Context.Movies.Where(x => x.Actors.Contains(person)).Select(x => x.Title).ToArray(),
                };

                response.Status = true;
                response.Message = "success";
                response.Data = personData;

                return Ok(response);
            }
            catch (Exception ex)
            {
                // todo: do logging exception
                response.Status = false;
                response.Message = "something went wrong";

                return BadRequest(response);
            }
        }


        [HttpGet]
        [Route("search/{searchText}")]
        public IActionResult GetById(string searchText)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
              var searchPerson = _Context.Persons.Where(x => x.Name.Contains(searchText)).Select(x => new
              {
                  x.Id,
                  x.Name,
              }).ToList();

                response.Status = true;
                response.Message = "success";
                response.Data = searchPerson;

                return Ok(response);

            }
            catch (Exception)
            {

                response.Status = false;
                response.Message = "something went wrong";

                return BadRequest(response);
            }
        }


        [HttpPost]
        public IActionResult Post(ActorViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                if (ModelState.IsValid)
                {
                   
                    var postedModel = new Person()
                    {
                        Name = model.Name,
                        DateOfBirth = model.DateOfBirth,
                       
                    };

                    _Context.Persons.Add(postedModel);
                    _Context.SaveChanges();

                    model.Id = postedModel.Id;

                    response.Status = true;
                    response.Message = "created Succesfuly";
                    response.Data = model;

                    return Ok(response);
                }
                else
                {
                    response.Status = false;
                    response.Message = "validation faild";
                    response.Data = ModelState;
                    return BadRequest(response);
                }

            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Message = "something went wrong";

                return BadRequest(response);
            }
        }


        [HttpPut]
        public IActionResult Put(ActorViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                if (ModelState.IsValid)
                {
                    var postedModel = _mapper.Map<Person>(model);

                    if (model.Id <= 0)
                    {
                        response.Status = false;
                        response.Message = "invalid person data";
                        return BadRequest(response);
                    }

                    var personDetails = _Context.Persons.Where(x => x.Id == model.Id).AsNoTracking().FirstOrDefault();
                    if (personDetails == null)
                    {
                        response.Status = false;
                        response.Message = "invalid person data";
                        return BadRequest(response);
                    }

                    _Context.Persons.Update(postedModel);
                    _Context.SaveChanges();

                    response.Status = true;
                    response.Message = "Updated Succesfuly";
                    response.Data = postedModel;

                    return Ok(response);
                }
                else
                {
                    response.Status = false;
                    response.Message = "validation faild";
                    response.Data = ModelState;
                    return BadRequest(response);
                }
            }
            catch (Exception)
            {

                response.Status = false;
                response.Message = "something went wrong";

                return BadRequest(response);

            }
        }



        [HttpDelete]
        public IActionResult Delete(int id)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var Person = _Context.Persons.Where(x => x.Id == id).FirstOrDefault();
                if (Person == null)
                {
                    response.Status = false;
                    response.Message = "invalid person record";

                    return BadRequest(response);
                }

                _Context.Persons.Remove(Person);
                _Context.SaveChanges();

                response.Status = true;
                response.Message = "Deleted Successfuly";


                return Ok(response);

            }
            catch (Exception ex)
            {

                response.Status = false;
                response.Message = "something went wrong";

                return BadRequest(response);
            }
        }



    }
}
