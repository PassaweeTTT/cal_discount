import { Injectable } from '@angular/core';
import { Coupon } from '../models/coupon.model';
import { EnumCouponType } from '../Enums/enumCategory';

@Injectable({
    providedIn: 'root'
})
export class CouponService {

    private EnumCouponType = EnumCouponType;
    constructor() { }

    private coupons: Coupon[] = [
        { description: 'Discount 10 Baht', code: 'N10', amount: 10, isPercent: false, category: this.EnumCouponType.Coupon },
        { description: 'Discount 50 Baht', code: 'N50', amount: 50, isPercent: false, category: this.EnumCouponType.Coupon },
        { description: 'Summer Save 10%', code: 'SUMMER10', amount: 10, isPercent: true, category: this.EnumCouponType.Coupon },
        { description: 'Summer Save 20%', code: 'SUMMER20', amount: 20, isPercent: true, category: this.EnumCouponType.Coupon },
        { description: 'NEW LIVE NEW SHIRT', code: 'NEWSHIRT', amount: 15, isPercent: true, category: this.EnumCouponType.OnTop, unit: 'Shirt' },
        { description: 'WE RUN', code: 'WERUN', amount: 12, isPercent: true, category: this.EnumCouponType.OnTop, unit: 'Shoes' },
        { description: 'Black Friday', code: 'BFDAY', amount: 50, isPercent: false, category: this.EnumCouponType.Seasonal, every: 500 },
    ];

    public getDefaultCoupons() {
        return this.coupons;
    }

    public getCustomCoupons() {
        const json = localStorage.getItem('custom-coupons');
        const coupons: Coupon[] = json ? JSON.parse(json) : [];
        return coupons;
    }

    public getCoupons(): Coupon[] {
        let result: Coupon[] = this.getDefaultCoupons();
        const customCoupons = this.getCustomCoupons();

        if (customCoupons.length > 0) {
            result = [...result, ...customCoupons];

            const uniqueCouponsMap = new Map<string, Coupon>();
            for (const coupon of result) {
                uniqueCouponsMap.set(coupon.code, coupon);
            }

            result = Array.from(uniqueCouponsMap.values());
        }

        return result;
    }

    public addCustomCoupon(coupon: Coupon): boolean {
        const coupons = this.getCustomCoupons();

        if (!coupon.category) {
            alert('Coupon Category is required!');
            return false;
        }

        if (!coupon.description) {
            alert('Coupon Name is required!');
            return false;
        }
        if (!coupon.code) {
            alert('Coupon Code is required!');
            return false;
        }

        if (!coupon.amount) {
            alert('Coupon Amount is required!');
            return false;
        } else {
            if (coupon.isPercent && (coupon.amount < 0 || coupon.amount > 100)) {
                alert('Coupon Amount must be between 0 and 100 for percentage!');
                return false;
            } else if (!coupon.isPercent && coupon.amount < 0) {
                alert('Coupon Amount must be greater than 0 for fixed amount!');
                return false;
            }
        }

        if (coupon.category === 'OnTop') {
            if (!coupon.unit) {
                alert('Category to Discount is required!');
                return false;
            }
        }

        if (coupon.category === 'Seasonal') {
            if (!coupon.every) {
                alert('Discount Every (฿) is required!');
                return false;
            }
        }

        const isDuplicate = coupons.some((c: Coupon) => c.code === coupon.code);
        if (isDuplicate) {
            alert('Coupon already exists!');
            return false;
        }

        coupons.push(coupon);
        localStorage.setItem('custom-coupons', JSON.stringify(coupons));

        return true;
    }

    public removeCustomCoupon(code: string): boolean {
        const coupons = this.getCustomCoupons();
        const index = coupons.findIndex((c: Coupon) => c.code === code);
        if (index !== -1) {
            coupons.splice(index, 1);
            localStorage.setItem('custom-coupons', JSON.stringify(coupons));
            return true;
        }
        return false;
    }
}
