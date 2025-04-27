using api.Enum;
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
                throw new Exception("Cart cannot be null.");
            }

            if (param.Cart.Items == null)
            {
                throw new Exception("Cart Items cannot be null.");
            }

            if (!param.Cart.Items.Any())
            {
                throw new Exception("Cart cannot be empty.");
            }

            var items = param.Cart.Items;
            decimal totalAmount = CalculateTotalAmount(items);
            decimal remainAmount = totalAmount;

            decimal discount = 0;
            decimal pointUsed = 0;

            if (param.Coupon != null && param.Coupon.Any())
            {
                ValidateCoupon(param);
                remainAmount -= CalculateCouponDiscount(param.Coupon, totalAmount);
                remainAmount -= CalculateOnTopDiscount(param.Coupon, items);
                CalculatePoint(param, totalAmount, ref remainAmount, ref pointUsed);
                remainAmount -= CalculateSeasonalDiscount(param.Coupon, remainAmount);
            }
            else
            {
                CalculatePoint(param, totalAmount, ref remainAmount, ref pointUsed);
            }

            discount = totalAmount - remainAmount;
            decimal finalPrice = remainAmount;

            return new ResponseModel
            {
                TotalPrice = totalAmount,
                Discount = discount,
                FinalPrice = finalPrice,
                PointUsed = pointUsed
            };
        }

        private void CalculatePoint(CheckoutModel param, decimal totalAmount, ref decimal remainAmount, ref decimal pointUsed)
        {
            if (param.IsPoint.GetValueOrDefault(false))
            {
                var maxPoint = CalculatePointDiscount(param.IsPoint, param.PointAmount, totalAmount);
                if (param.PointAmount > maxPoint)
                    pointUsed = maxPoint;
                else
                    pointUsed = param.PointAmount.GetValueOrDefault(0);

                remainAmount -= pointUsed;
            }
        }

        private void ValidateCoupon(CheckoutModel param)
        {
            var coupon = param.Coupon;
            if(coupon == null || !coupon.Any())
            {
                throw new ArgumentNullException(nameof(coupon), "Coupon cannot be null or empty.");
            }
            foreach (var item in coupon)
            {
                if (item == null)
                {
                    throw new ArgumentNullException(nameof(item), "Coupon cannot be null.");
                }
                if (string.IsNullOrWhiteSpace(item.Code))
                {
                    throw new Exception("Coupon code is required.");
                }
                if (item.Amount < 0)
                {
                    throw new Exception($"Coupon amount cannot lower than 0. Code: {item.Code}");
                }
                if (string.IsNullOrWhiteSpace(item.Category))
                {
                    throw new Exception($"Coupon category is required. Code: {item.Code}");
                }
                if(item.IsPercent && (item.Amount < 0 || item.Amount > 100))
                {
                    throw new Exception($"Coupon discount percentage must be between 0 and 100. Code: {item.Code}");
                }
                if(item.Category == EnumCouponType.OnTop)
                {
                    if (string.IsNullOrWhiteSpace(item.Unit))
                    {
                        throw new Exception($"Category To Discount is required. Code: {item.Code}");
                    }
                }
                if(item.Category == EnumCouponType.Seasonal)
                {
                    if (item.Every == null)
                    {
                        throw new Exception($"Discount Every is required. Code: {item.Code}");
                    }
                    if (item.Every <= 0)
                    {
                        throw new Exception($"Discount Every cannot lower than 0. Code: {item.Code}");
                    }
                }
            }

            if (param.IsPoint.GetValueOrDefault(false))
            {
                if(coupon.Where(x => x.Category == EnumCouponType.OnTop).ToList().Count > 0)
                {
                    throw new Exception($"You can not use Point together with \"On Top\" coupon!");
                }
            }

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
                    throw new Exception($"Cart Item price cannot lower than 0. Item: {item.Name}");
                }
                if (item.Quantity <= 0)
                {
                    throw new Exception($"Cart Item quantity must be at least 1. Item: {item.Name}");
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
                .Where(c => c != null && !string.IsNullOrWhiteSpace(c.Category) && c.Category == EnumCouponType.Coupon)
                .ToList();

            if (generalCoupons.Count > 1)
            {
                throw new Exception("Multiple coupon campaigns can not be applied.");
            }

            if (generalCoupons.Count == 1)
            {
                var coupon = generalCoupons[0];
                if (coupon.Amount < 0)
                {
                    throw new Exception($"Coupon amount cannot lower than 0. Code: {coupon.Code}");
                }

                if (coupon.IsPercent)
                {
                    return (totalAmount * coupon.Amount) / 100;
                }
                return coupon.Amount;
            }

            return 0;
        }

        private decimal CalculateOnTopDiscount(List<Coupon> coupons, List<CartItem> items)
        {
            if (coupons == null || !coupons.Any() || items == null || !items.Any())
            {
                return 0;
            }

            var categoryCoupons = coupons
                .Where(c => c != null && !string.IsNullOrWhiteSpace(c.Category) && c.Category == EnumCouponType.OnTop)
                .ToList();

            if (categoryCoupons.Count > 1)
            {
                throw new Exception("Multiple On Top campaigns can not be applied.");
            }

            if (categoryCoupons.Count == 1)
            {
                var coupon = categoryCoupons[0];

                var itemList = items.Where(i => i.Category != null && i.Category == coupon.Unit).ToList();

                decimal totalAmount = 0;
                foreach (var item in itemList)
                {
                    totalAmount += item.Price * item.Quantity;
                }

                if (coupon.Amount < 0)
                {
                    throw new Exception($"On Top amount cannot lower than 0. Code: {coupon.Code}");
                }

                if (coupon.IsPercent)
                {
                    return (totalAmount * coupon.Amount) / 100;
                }

                return totalAmount - coupon.Amount;
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
                throw new Exception("Point amount is required when Use Point.");
            }

            if (pointAmount.Value < 0)
            {
                throw new Exception("Point amount cannot be lower than 0.");
            }

            decimal maxPoint = (totalAmount * 20) / 100;
            return Math.Floor(maxPoint);
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
            Console.WriteLine($"Seasonal Coupons: {seasonalCoupons.Count}");
            if (seasonalCoupons.Count > 1)
            {
                throw new Exception("Multiple seasonal campaigns can not be applied.");
            }

            if (seasonalCoupons.Count == 1)
            {
                var coupon = seasonalCoupons[0];

                if(coupon.Every == null || coupon.Every < 0)
                {
                    throw new Exception($"Discount Every is required. Code: {coupon.Code}");
                }

                decimal couponEvery = coupon.Every.Value;

                var times = Math.Floor(baseAmount / couponEvery);
                return times * coupon.Amount;
            }

            return 0;
        }
    }
}
