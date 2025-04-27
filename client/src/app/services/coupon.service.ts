import { Injectable } from '@angular/core';
import { Coupon } from '../models/coupon.model';

@Injectable({
    providedIn: 'root'
})
export class CouponService {

    constructor() { }

    private coupons: Coupon[] = [
        { description: 'Discount 10 Baht', code: 'DISCOUNT10', amount: 10, isPercent: false, category: 'Coupon' },
        { description: 'Discount 20 %', code: 'SAVE20', amount: 20, isPercent: true, category: 'Coupon' },
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
