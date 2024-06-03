using MovieApiDemo.Entities;
using System.ComponentModel.DataAnnotations;

namespace MovieApiDemo.ViewModel
{
    public class CreateMovieViewModel
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "name of the movie requierd")]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;


        public List<int> Actors { get; set; }

        [Required(ErrorMessage = "Language of the movie requierd")]
        public string Language { get; set; } = string.Empty;

        public DateTime ReleaseDate { get; set; }

        public string CoverImage { get; set; } = string.Empty;

   
    }
}
