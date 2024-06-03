using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using MovieApiDemo.Data;
using MovieApiDemo.Entities;
using MovieApiDemo.Models;
using MovieApiDemo.ViewModel;
using System.Reflection;

namespace MovieApiDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieDbContext _Context;
        private readonly IMapper _mapper;

        public MovieController(MovieDbContext context, IMapper mapper)
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
                var movieCount = _Context.Movies.Count();
                var movieList = _mapper.Map<List<MovieListViewModel>>(
                    _Context.Movies.Include(x => x.Actors).Skip(pageIndex * pageSize).Take(pageSize).ToList()
                    );
                   

                response.Status = true;
                response.Message = "success";
                response.Data = new { movies = movieList, count = movieCount };

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
        public IActionResult GetMovieById(int id)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
               
                var movie = _Context.Movies.Include(x => x.Actors).Where(x => x.Id == id)
                  .FirstOrDefault();

                if(movie == null)
                {
                    response.Status = false;
                    response.Message= "error. movie is not exist";

                    return BadRequest(response);
                }

                var movieData = _mapper.Map<MovieDetailsViewModel>(movie);

                response.Status = true;
                response.Message = "success";
                response.Data = movieData;

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


        [HttpPost]
        public IActionResult Post(CreateMovieViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                if(ModelState.IsValid)
                {
                    var actors = _Context.Persons.Where(x => model.Actors.Contains(x.Id)).ToList();


                    if(actors.Count != model.Actors.Count)
                    {
                        response.Status = false;
                        response.Message = "Invalid actor asigned";

                        return BadRequest(response);
                    }

                    var postedModel = _mapper.Map<Movie>(model);
                    postedModel.Actors = actors;

                    _Context.Movies.Add(postedModel);
                    _Context.SaveChanges();

                    var responseData = _mapper.Map<MovieDetailsViewModel>(postedModel);
                    
                    response.Status = true;
                    response.Message = "created Succesfuly";
                    response.Data = responseData;
                   
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
        public IActionResult put(CreateMovieViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                if (ModelState.IsValid)
                {

                    if(model.Id <= 0)
                    {
                        response.Status = false;
                        response.Message = "Invalid movie record for update";

                        return BadRequest(response);
                    }

                    var actors = _Context.Persons.Where(x => model.Actors.Contains(x.Id)).ToList();


                    if (actors.Count != model.Actors.Count)
                    {
                        response.Status = false;
                        response.Message = "Invalid actor asigned";

                        return BadRequest(response);
                    }

                    var movieDetails = _Context.Movies.Include(x => x.Actors).Where(x => x.Id == model.Id).FirstOrDefault();

                    if(movieDetails == null)
                    {
                        response.Status = false;
                        response.Message = "Invalid movie record";

                        return BadRequest(response);
                    }

                    movieDetails.CoverImage = model.CoverImage;
                    movieDetails.Description = model.Description;
                    movieDetails.Language = model.Language;
                    movieDetails.ReleaseDate = model.ReleaseDate;
                    movieDetails.Title = model.Title;

                    //find removed actors

                    var removedActors = movieDetails.Actors.Where(x => !model.Actors.Contains(x.Id)).ToList();

                    foreach (var actor in removedActors)
                    {
                        movieDetails.Actors.Remove(actor);
                    }

                    // find added actors

                    var addedActors = actors.Except(movieDetails.Actors).ToList();

                    foreach (var actor in addedActors)
                    {
                        movieDetails.Actors.Add(actor);
                    }

                    _Context.SaveChanges();


                    var responseData = new MovieDetailsViewModel
                    {
                        Id = movieDetails.Id,
                        Title = movieDetails.Title,
                        Actors = movieDetails.Actors.Select(y => new ActorViewModel
                        {
                            Id = y.Id,
                            Name = y.Name,
                            DateOfBirth = y.DateOfBirth
                        }).ToList(),
                        CoverImage = movieDetails.CoverImage,
                        Language = movieDetails.Language,
                        ReleaseDate = movieDetails.ReleaseDate,
                        Description = movieDetails.Description,
                    };

                    response.Status = true;
                    response.Message = "created Succesfuly";
                    response.Data = responseData;

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

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var movie = _Context.Movies.Where(x => x.Id == id).FirstOrDefault();
                if (movie == null)
                {
                    response.Status = false;
                    response.Message = "invalid movie record";

                    return BadRequest(response);
                }

                _Context.Movies.Remove(movie);
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


        [HttpPost]
        [Route("upload-movie-poster")]
        public async Task<IActionResult> UploadMoviePoster(IFormFile imageFile)
        {
            try
            {
                var fileName = ContentDispositionHeaderValue.Parse(imageFile.ContentDisposition).FileName;
                string newPath = @"C:\Users\DAIC\Desktop\MovieProj\folderForMoviePhotos";

                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);

                }

                string[] allowedImageExtensions = new string[] { ".jpg", ".jpeg", ".png" };

                if (!allowedImageExtensions.Contains(Path.GetExtension(fileName).ToString()))
                {
                    return BadRequest(new BaseResponseModel
                    {
                        Status = false,
                        Message = "only .jpg .jpeg and .png type files are allowed"
                    });
                }

                string newFileName = Guid.NewGuid() + Path.GetExtension(fileName).ToString();
                string FullFilePath = Path.Combine(newPath, newFileName);

                using(var stream = new FileStream(FullFilePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                return Ok(new {profileImage = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/staticFiles/{newFileName}" });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponseModel
                {
                    Status = false,
                    Message = "error occured"
                });
               
            }
        }


    }
}
