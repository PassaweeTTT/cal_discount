export interface Coupon {
    description: string;
    code: string;
    amount: number;
    isPercent: boolean;
    category: string;
    isCustom?: boolean;
}