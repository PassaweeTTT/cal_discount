using api.Models;

namespace api.Services
{
    public class ProcessService : IProcessService
    {
        public ResponseModel ProcessCheckout(CheckoutModel param)
        {
            // Validate CheckoutModel
            if (param == null)
            {
                throw new ArgumentNullException(nameof(param));
            }

            if (param.Cart == null)
            {
                throw new ArgumentException("Cart cannot be null.");
            }

            if (param.Cart.Items == null)
            {
                throw new ArgumentException("Cart Items cannot be null.");
            }

            if (!param.Cart.Items.Any())
            {
                throw new ArgumentException("Cart cannot be empty.");
            }

            var items = param.Cart.Items;
            decimal totalAmount = CalculateTotalAmount(items);

            decimal discount = 0;
            decimal pointUsed = 0;

            if (param.Coupon != null && param.Coupon.Any())
            {
                discount += CalculateCouponDiscount(param.Coupon, totalAmount);
                discount += CalculateCategoryDiscount(param.Coupon, items);
                discount += CalculateSeasonalDiscount(param.Coupon, totalAmount - discount);
            }

            if (param.IsPoint.GetValueOrDefault(false))
            {
                pointUsed = CalculatePointDiscount(param.IsPoint, param.PointAmount, totalAmount);
                discount += pointUsed;
            }

            discount = Math.Min(discount, totalAmount);
            decimal finalPrice = totalAmount - discount;

            return new ResponseModel
            {
                TotalPrice = totalAmount,
                Discount = discount,
                FinalPrice = finalPrice,
                PointUsed = pointUsed
            };
        }

        private decimal CalculateTotalAmount(List<CartItem> items)
        {
            if (items == null)
            {
                throw new ArgumentNullException(nameof(items));
            }

            decimal total = 0;
            foreach (var item in items)
            {
                if (item == null)
                {
                    throw new ArgumentNullException(nameof(item), "Cart Item cannot be null.");
                }
                if (item.Price < 0)
                {
                    throw new ArgumentException($"Cart Item price cannot lower than 0. Item: {item.Name}");
                }
                if (item.Quantity <= 0)
                {
                    throw new ArgumentException($"Cart Item quantity must be at least 1. Item: {item.Name}");
                }
                total += item.Price * item.Quantity;
            }
            return total;
        }

        private decimal CalculateCouponDiscount(List<Coupon> coupons, decimal totalAmount)
        {
            if (coupons == null || !coupons.Any())
            {
                return 0;
            }

            var generalCoupons = coupons
                .Where(c => c != null && !c.IsPoint.GetValueOrDefault() && c.Every == null && string.IsNullOrWhiteSpace(c.Category))
                .ToList();

            if (generalCoupons.Count > 1)
            {
                throw new InvalidOperationException("Multiple general coupon campaigns applied.");
            }

            if (generalCoupons.Count == 1)
            {
                var coupon = generalCoupons[0];
                if (coupon.Amount < 0)
                {
                    throw new ArgumentException($"Coupon amount cannot lower than 0. Code: {coupon.Code}");
                }

                if (coupon.IsPercent)
                {
                    if (coupon.Amount > 100)
                    {
                        throw new ArgumentException($"Category discount percentage must be between 0 and 100. Code: {coupon.Code}");
                    }
                    return totalAmount * (coupon.Amount / 100m);
                }
                return coupon.Amount;
            }

            return 0;
        }

        private decimal CalculateCategoryDiscount(List<Coupon> coupons, List<CartItem> items)
        {
            if (coupons == null || !coupons.Any() || items == null || !items.Any())
            {
                return 0;
            }

            var categoryCoupons = coupons
                .Where(c => c != null && !c.IsPoint.GetValueOrDefault() && c.Every == null && !string.IsNullOrWhiteSpace(c.Category))
                .ToList();

            if (categoryCoupons.Count > 1)
            {
                throw new InvalidOperationException("Multiple category discount campaigns applied.");
            }

            if (coupons.Any(c => c != null && c.IsPoint.GetValueOrDefault()) && categoryCoupons.Count > 0)
            {
                throw new InvalidOperationException("Multiple On Top campaigns applied with category discounts.");
            }

            if (categoryCoupons.Count == 1)
            {
                var coupon = categoryCoupons[0];
                if (coupon.Amount < 0 || coupon.Amount > 100)
                {
                    throw new ArgumentException($"Category discount percentage must be between 0 and 100. Code: {coupon.Code}");
                }

                decimal sum = items
                    .Where(i => i != null && string.Equals(i.Category, coupon.Category, StringComparison.OrdinalIgnoreCase))
                    .Sum(i => i.Price * i.Quantity);

                return sum * (coupon.Amount / 100m);
            }

            return 0;
        }

        private decimal CalculatePointDiscount(bool? isPoint, decimal? pointAmount, decimal totalAmount)
        {
            if (!isPoint.GetValueOrDefault(false))
            {
                return 0;
            }

            if (!pointAmount.HasValue)
            {
                throw new ArgumentException("Point amount is required when Use Point.");
            }

            if (pointAmount.Value < 0)
            {
                throw new ArgumentException("Point amount cannot be lower than 0.");
            }

            decimal maxPoint = totalAmount * 0.2m;
            return Math.Min(pointAmount.Value, maxPoint);
        }

        private decimal CalculateSeasonalDiscount(List<Coupon> coupons, decimal baseAmount)
        {
            if (coupons == null || !coupons.Any())
            {
                return 0;
            }

            var seasonalCoupons = coupons
                .Where(c => c != null && c.Every.HasValue)
                .ToList();

            if (seasonalCoupons.Count > 1)
            {
                throw new InvalidOperationException("Multiple seasonal campaigns applied.");
            }

            if (seasonalCoupons.Count == 1)
            {
                var coupon = seasonalCoupons[0];
                if (coupon.Every == null)
                {
                    throw new ArgumentException($"Seasonal (Every) is required. Code: {coupon.Code}");
                }
                if (coupon.Every <= 0)
                {
                    throw new ArgumentException($"Seasonal (Every) cannot lower than 0. Code: {coupon.Code}");
                }
                if (coupon.Amount < 0)
                {
                    throw new ArgumentException($"Seasonal discount amount cannot lower than 0. Code: {coupon.Code}");
                }

                var times = Math.Floor(baseAmount / coupon.Every.Value);
                return times * coupon.Amount;
            }

            return 0;
        }
    }
}
