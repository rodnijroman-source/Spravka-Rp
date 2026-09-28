var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors("AllowAll");

var chargesList = new List<Charge>();

app.MapGet("/charges", () =>
{
    return chargesList;
});

app.MapPost("/add_charge", (Charge newCharge) =>
{
    newCharge.Id = chargesList.Count > 0 ? chargesList.Max(c => c.Id) + 1 : 1;
    chargesList.Add(newCharge);

    return Results.Ok(newCharge);
});

app.MapGet("/remove/{id}", (int id) =>
{
    var chargeToRemove = chargesList.FirstOrDefault(c => c.Id == id);

    if (chargeToRemove != null)
    {
        chargesList.Remove(chargeToRemove);
        return Results.Ok($"Жалоба с ID {id} успешно удалена!");
    }
    else
    {
        return Results.NotFound($"Жалоба с ID {id} не найдена.");
    }
});

app.Run();