import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../models/cart.model';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchErrorHandler } from '../../utils/handler';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
    @Input() public cart: Cart = {
        items: [],
        totalAmount: 0
    }

    public appliedCoupons: string[] = [];
    public couponCode: string = '';
    public discount: number = 0;
    public finalAmount: number = 0;

    constructor(
        private cartService: CartService,
    ) { }

    ngOnInit(): void {
    }

    public updateQuantity(item: any, change: number): void {
        if (change !== 0) {
            item.quantity += change;
            if (item.quantity < 1) {
                this.removeFromCart(item.id);
            }
        }
        item.totalPrice = item.price * item.quantity;
        this.calculateFinalAmount();
    }

    public removeFromCart(itemId: number): void {
        this.cart.items = this.cart.items.filter(item => item.id !== itemId);
        this.cart.totalAmount = this.cart.items.reduce((total, item) => total + item.totalPrice, 0);
        this.calculateFinalAmount();
    }

    public applyCoupon(code: string): void {
        this.cartService.checkout(this.cart).pipe(
            catchError((error: HttpErrorResponse) => {
                return catchErrorHandler(error);
            })
        ).subscribe(() => {
            alert('Coupon applied successfully!');
        })
    }

    public removeCoupon(code: string): void {
        this.appliedCoupons = this.appliedCoupons.filter(c => c !== code);
        this.calculateFinalAmount();
    }

    public calculateFinalAmount(): void {
        this.cart.totalAmount = this.cart.items.reduce((total, item) => total + item.totalPrice, 0);
    }
}