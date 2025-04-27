import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart, CheckoutModel, ResponseModel } from '../../models/cart.model';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchErrorHandler } from '../../utils/handler';
import { CartService } from '../../services/cart.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Coupon } from '../../models/coupon.model';
import { CouponService } from '../../services/coupon.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EnumCouponType } from '../../Enums/enumCategory';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule, BsDropdownModule],
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

    public EnumCouponType = EnumCouponType;
    public response?: ResponseModel;

    public couponList: Coupon[] = [];
    public newCoupon: Coupon = {
        description: '',
        code: '',
        amount: 0,
        isPercent: false,
        category: '',
    };

    public couponUseList: Coupon[] = [];

    public modalRef?: BsModalRef;
    public isUsePoint: boolean = false;
    public pointAmount: number = 0;

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

    public checkout(): void {
        let checkoutParam: CheckoutModel = {
            cart: this.cart,
            coupon: this.couponUseList,
            isPoint: this.isUsePoint,
            pointAmount: this.pointAmount || 0
        }

        this.cartService.checkout(checkoutParam).pipe(
            catchError((error: HttpErrorResponse) => {
                return catchErrorHandler(error);
            })
        ).subscribe((res: ResponseModel) => {
            this.response = res;
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
            category: '',
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
        if (!confirm('Are you sure you want to delete this coupon?')) {
            return;
        }

        this.couponUseList = this.couponUseList.filter(c => c.code !== code);

        const isDeleted = this.couponService.removeCustomCoupon(code);
        if (!isDeleted) {
            return;
        }
        this.couponList = this.couponService.getCoupons();
    }

    public onApplyFromList(coupon: Coupon): void {
        if (this.couponUseList.some(c => c.code === coupon.code)) {
            return;
        }

        if (this.couponUseList.some(c => c.category === coupon.category && c.code !== coupon.code)) {
            const text = 'You can only use one coupon per category!';
            alert(text);
            return;
        }

        if (this.isUsePoint && coupon.category === EnumCouponType.OnTop) {
            const text = 'You can not use Point together with "On Top" coupon!';
            this.isUsePoint = false;
            this.pointAmount = 0;
        }

        this.couponUseList.push(coupon);
        // this.modalRef?.hide();
    }

    public onRemoveFromList(coupon: Coupon): void {
        this.couponUseList = this.couponUseList.filter(c => c.code !== coupon.code);
        // this.modalRef?.hide();1
    }

    public getCategoryText(): string {
        if (this.newCoupon.category) {
            if (this.newCoupon.category === EnumCouponType.Coupon) {
                return EnumCouponType.Coupon;
            } else if (this.newCoupon.category === EnumCouponType.Seasonal) {
                return EnumCouponType.Seasonal;
            } else if (this.newCoupon.category === EnumCouponType.OnTop) {
                return 'On Top';
            }
        }

        return 'Select Category';
    }

    public selectCategory(category: string): void {
        if (category == this.newCoupon.category) {
            return;
        }

        if (this.newCoupon.category === EnumCouponType.Seasonal) {
            this.newCoupon.isPercent = false;
        }
        delete this.newCoupon.isPoint;
        delete this.newCoupon.unit;
        delete this.newCoupon.every;

        this.newCoupon.category = category;
    }

    public onPointAmountChange(): void {
        if (this.isUsePoint) {
            this.pointAmount = 0;
            const onTop = this.couponUseList.find(c => c.category === EnumCouponType.OnTop);
            if (onTop) {
                const text = 'You can only use one coupon "On Top" at a time!';
                alert(text);
                this.couponUseList = this.couponUseList.filter(c => c.category !== EnumCouponType.OnTop);
            }
        }
    }

    public canApplyCoupon(coupon: Coupon): boolean {
        if (this.couponUseList.some(c => c.code === coupon.code)) {
            return false;
        }
        return true;
    }
}