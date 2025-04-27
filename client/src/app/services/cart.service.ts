import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    public url = `https://localhost:7110/api/cart/`;

    constructor(
        private http: HttpClient,
    ) { }

    public checkout(cart: Cart): Observable<any> {
        return this.http.post<any>(`${this.url}Checkout`, cart);
    }
}