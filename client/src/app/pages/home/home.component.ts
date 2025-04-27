import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartComponent } from "../../components/cart/cart.component";
import { ProductsComponent } from "../../components/products/products.component";
import { Cart } from '../../models/cart.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, ProductsComponent, CartComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    public cart: Cart = {
        items: [],
        totalAmount: 0
    }

    constructor() { }
}