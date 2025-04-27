export interface Coupon {
    description: string;
    code: string;
    amount: number;
    isPercent: boolean;
    category: string;
    isCustom?: boolean;
    isPoint?: boolean;
    unit?: string;
    every?: number;
}
