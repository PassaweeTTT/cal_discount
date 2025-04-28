using api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IProcessService, ProcessService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorePolicy", policy =>
    {
        policy.AllowAnyOrigin() 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("CorePolicy");

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
