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
            ResponseModel result = new ResponseModel();

            try
            {
                result = _processService.ProcessCheckout(param);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            return Ok(result);
        }
    }
}
