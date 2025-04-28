import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutModel, ResponseModel } from '../models/cart.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    public url = '';

    constructor(
        private http: HttpClient,
    ) {
        this.url = environment.apiEndpoint + 'cart/';
    }

    public checkout(param: CheckoutModel): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(`${this.url}Checkout`, param);
    }
}