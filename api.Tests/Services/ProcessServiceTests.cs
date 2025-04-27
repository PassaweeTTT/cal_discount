using api.Models;
using api.Services;
using System;
using System.Collections.Generic;
using Xunit;

namespace api.Tests.Services
{
    public class ProcessServiceTests
    {
        private readonly ProcessService _service;

        public ProcessServiceTests()
        {
            _service = new ProcessService();
        }

        [Fact]
        public void ProcessCheckout_NullParam_ThrowsArgumentNullException()
        {
            CheckoutModel param = null;

            Assert.Throws<ArgumentNullException>(() => _service.ProcessCheckout(param));
        }

        [Fact]
        public void ProcessCheckout_NullCart_ThrowsException()
        {
            var param = new CheckoutModel
            {
                Cart = null
            };

            var ex = Assert.Throws<Exception>(() => _service.ProcessCheckout(param));
            Assert.Equal("Cart cannot be null.", ex.Message);
        }

        [Fact]
        public void ProcessCheckout_NullCartItems_ThrowsException()
        {
            var param = new CheckoutModel
            {
                Cart = new Cart
                {
                    Items = null
                }
            };

            var ex = Assert.Throws<Exception>(() => _service.ProcessCheckout(param));
            Assert.Equal("Cart Items cannot be null.", ex.Message);
        }

        [Fact]
        public void ProcessCheckout_EmptyCartItems_ThrowsException()
        {
            var param = new CheckoutModel
            {
                Cart = new Cart
                {
                    Items = new List<CartItem>()
                }
            };

            var ex = Assert.Throws<Exception>(() => _service.ProcessCheckout(param));
            Assert.Equal("Cart cannot be empty.", ex.Message);
        }

        [Fact]
        public void ProcessCheckout_ValidCartWithoutCoupon_ShouldReturnCorrectResult()
        {
            var param = new CheckoutModel
            {
                Cart = new Cart
                {
                    Items = new List<CartItem>
                    {
                        new CartItem { Name = "Item1", Price = 100, Quantity = 2 },
                        new CartItem { Name = "Item2", Price = 50, Quantity = 1 }
                    }
                },
                IsPoint = false
            };

            var result = _service.ProcessCheckout(param);

            Assert.Equal(250, result.TotalPrice);
            Assert.Equal(0, result.Discount);
            Assert.Equal(250, result.FinalPrice);
            Assert.Equal(0, result.PointUsed);
        }

        [Fact]
        public void ProcessCheckout_InvalidCartItemPrice_ThrowsException()
        {
            var param = new CheckoutModel
            {
                Cart = new Cart
                {
                    Items = new List<CartItem>
                    {
                        new CartItem { Name = "Item1", Price = -100, Quantity = 1 }
                    }
                }
            };

            var ex = Assert.Throws<Exception>(() => _service.ProcessCheckout(param));
            Assert.Contains("Cart Item price cannot lower than 0", ex.Message);
        }

        [Fact]
        public void ProcessCheckout_InvalidCartItemQuantity_ThrowsException()
        {
            var param = new CheckoutModel
            {
                Cart = new Cart
                {
                    Items = new List<CartItem>
                    {
                        new CartItem { Name = "Item1", Price = 100, Quantity = 0 }
                    }
                }
            };

            var ex = Assert.Throws<Exception>(() => _service.ProcessCheckout(param));
            Assert.Contains("Cart Item quantity must be at least 1", ex.Message);
        }

        [Fact]
        public void ProcessCheckout_UsePoint_ShouldApplyDiscount()
        {
            var param = new CheckoutModel
            {
                Cart = new Cart
                {
                    Items = new List<CartItem>
                    {
                        new CartItem { Name = "Item1", Price = 100, Quantity = 2 }
                    }
                },
                IsPoint = true,
                PointAmount = 30
            };

            var result = _service.ProcessCheckout(param);

            Assert.True(result.PointUsed > 0);
            Assert.Equal(result.FinalPrice, result.TotalPrice - result.Discount);
        }
    }
}
