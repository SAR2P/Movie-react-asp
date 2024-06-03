﻿using Microsoft.EntityFrameworkCore;
using MovieApiDemo.Entities;

namespace MovieApiDemo.Data
{
    public class MovieDbContext :DbContext
    {

        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) 
        {   
        }

        public DbSet<Movie> Movies { get; set; }

        public DbSet<Person> Persons { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
