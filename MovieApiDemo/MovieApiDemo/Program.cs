using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MovieApiDemo.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MovieDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("defalt")
    ));

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod() ));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@"C:\Users\DAIC\Desktop\MovieProj\folderForMoviePhotos"),
    RequestPath = "/staticFiles"
});

app.UseHttpsRedirection();

app.UseAuthorization();


app.UseCors("AllowAll");

app.MapControllers();

app.Run();
