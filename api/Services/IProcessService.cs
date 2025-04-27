using api.Models;

namespace api.Services
{
    public interface IProcessService
    {
        public void ProcessCheckout(CheckoutModel param);
    }
}
