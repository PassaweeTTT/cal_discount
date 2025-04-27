using api.Models;
using api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly IProcessService _processService;

        public CartController(IProcessService processService)
        {
            _processService = processService;
        }

        [HttpPost]
        [Route("Checkout")]
        public IActionResult Checkout(CheckoutModel param)
        {
            _processService.ProcessCheckout(param);

            return Ok(new { Message = "OK" });
        }
    }
}
