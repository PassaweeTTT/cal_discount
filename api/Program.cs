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
        policy.WithOrigins("http://localhost:4200")  // กำหนดให้อนุญาตแค่ origin นี้
              .AllowAnyMethod()  // อนุญาตให้ใช้ทุก HTTP method
              .AllowAnyHeader()  // อนุญาตให้ใช้ทุก header
              .AllowCredentials();  // อนุญาตให้ส่ง cookies หรือ credentials
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorePolicy");

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
