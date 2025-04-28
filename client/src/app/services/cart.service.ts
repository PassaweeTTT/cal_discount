import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutModel, ResponseModel } from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    public url = `http://localhost:5000/api/cart/`;

    constructor(
        private http: HttpClient,
    ) { }

    public checkout(param: CheckoutModel): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${this.url}Checkout`, param);
    }
}