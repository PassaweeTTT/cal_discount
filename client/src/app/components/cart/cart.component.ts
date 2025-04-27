import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../models/cart.model';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchErrorHandler } from '../../utils/handler';
import { CartService } from '../../services/cart.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Coupon } from '../../models/coupon.model';
import { CouponService } from '../../services/coupon.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css',
    providers: [BsModalService],
})
export class CartComponent implements OnInit {
    @ViewChild('couponTemplate') couponTemplate?: TemplateRef<any>;
    @ViewChild('newCouponTemplate') newCouponTemplate?: TemplateRef<any>;

    @Input() public cart: Cart = {
        items: [],
        totalAmount: 0
    }

    public couponList: Coupon[] = [];
    public newCoupon: Coupon = {
        description: '',
        code: '',
        amount: 0,
        isPercent: false,
        category: '',
    };

    public couponInput: string = '';
    public couponCode: string = '';
    public modalRef?: BsModalRef;

    constructor(
        private cartService: CartService,
        private couponService: CouponService,
        private modalService: BsModalService,
    ) { }

    ngOnInit(): void {
        this.couponList = this.couponService.getCoupons();
    }

    public updateQuantity(item: any, change: number): void {
        if (change !== 0) {
            item.quantity += change;
            if (item.quantity < 1) {
                this.removeFromCart(item.id);
            }
        }
        item.totalPrice = item.price * item.quantity;
    }

    public removeFromCart(itemId: number): void {
        this.cart.items = this.cart.items.filter(item => item.id !== itemId);
        this.cart.totalAmount = this.cart.items.reduce((total, item) => total + item.totalPrice, 0);
    }

    public applyCoupon(): void {
        if (!this.couponInput) {
            alert('Please enter a Coupon!');
            return;
        }

        const coupon = this.couponList.find(c => c.code === this.couponInput);
        if (!coupon) {
            alert('Invalid Coupon!');
            return;
        }

        alert(`Coupon applied: ${coupon.description}`);
        this.couponCode = this.couponInput;
    }

    public validateCoupon(): void {
        this.cartService.checkout(this.cart).pipe(
            catchError((error: HttpErrorResponse) => {
                return catchErrorHandler(error);
            })
        ).subscribe(() => {
            alert('Coupon applied successfully!');
        })
    }

    public showAddCouponModal(): void {
        if (!this.newCouponTemplate) {
            alert('Template not found!');
            return;
        }

        this.newCoupon = {
            description: '',
            code: '',
            amount: 0,
            isPercent: false,
            category: 'Coupon',
            isCustom: true,
        };

        this.modalRef = this.modalService.show(this.newCouponTemplate);
    }

    public onConfirmAddCoupon(): void {
        const isComplete = this.couponService.addCustomCoupon(this.newCoupon);
        if (!isComplete) {
            return;
        }
        this.couponList = this.couponService.getCoupons();
        this.modalRef?.hide();
    }

    public showCouponList(): void {
        if (!this.couponTemplate) {
            alert('Template not found!');
            return;
        }
        this.modalRef = this.modalService.show(this.couponTemplate);
    }

    public onDeleteCoupon(code: string): void {
        const isDeleted = this.couponService.removeCustomCoupon(code);
        if (!isDeleted) {
            return;
        }
        this.couponList = this.couponService.getCoupons();
    }

    public onApplyFromList(text: string): void {
        this.couponCode = text;
        this.couponInput = text;
        this.modalRef?.hide();
    }
}