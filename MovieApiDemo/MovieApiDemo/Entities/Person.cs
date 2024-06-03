using System.ComponentModel.DataAnnotations;

namespace MovieApiDemo.Entities
{
    public class Person
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        public ICollection<Movie> Movies { get; set; }


        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifyDate { get; set; }
    }
}
