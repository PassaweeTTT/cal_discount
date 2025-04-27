using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {

        [HttpPost]
        [Route("Checkout")]
        public IActionResult Checkout(Cart param)
        {

            return Ok(new { Message = "OK" });
        }
    }
}
