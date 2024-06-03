using AutoMapper;
using MovieApiDemo.Entities;
using MovieApiDemo.Models;
using MovieApiDemo.ViewModel;

namespace MovieApiDemo.mappingProfilesFolder
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Movie,MovieListViewModel>();
            CreateMap<Movie,MovieDetailsViewModel>();
            CreateMap<MovieListViewModel, Movie>();
            CreateMap<CreateMovieViewModel, Movie>().ForMember(x => x.Actors, y => y.Ignore());

            CreateMap<Person, ActorViewModel>();
            CreateMap<Person, ActorDetailsViewModel>();
            CreateMap<ActorViewModel, Person>();
        }

    }
}
