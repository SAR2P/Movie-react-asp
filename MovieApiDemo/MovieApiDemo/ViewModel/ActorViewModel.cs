using System.ComponentModel.DataAnnotations;

namespace MovieApiDemo.ViewModel
{
    public class ActorViewModel
    {
        public int Id { get; set; }
            
        public string Name { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }
    }
}
