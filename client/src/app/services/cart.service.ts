import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    public url = `localhost:3000/cart`;

    constructor() { }

}