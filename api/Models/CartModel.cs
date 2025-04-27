namespace api.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
    }

    public class Cart
    {
        public List<CartItem> Items { get; set; }
        public decimal? TotalAmount { get; set; }
    }

    public class Coupon
    {
        public string Code { get; set; }
        public decimal Amount { get; set; }
        public bool IsPercent { get; set; }
        public string Category { get; set; }
        public bool? IsPoint { get; set; }
        public string? Unit { get; set; }
        public decimal? Every { get; set; }
    }
    public class CheckoutModel
    {
        public Cart Cart { get; set; }
        public List<Coupon> Coupon { get; set; }
        public bool? IsPoint { get; set; }
        public decimal? PointAmount { get; set; }
    }

    public class ResponseModel
    {
        public decimal TotalPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal FinalPrice { get; set; }
        public decimal PointUsed { get; set; }
    }
}

