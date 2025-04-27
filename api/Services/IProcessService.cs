using api.Models;

namespace api.Services
{
    public interface IProcessService
    {
        public ResponseModel ProcessCheckout(CheckoutModel param);
    }
}
