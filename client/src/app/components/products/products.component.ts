import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RequireDirective } from '../../directives/require.directive';
import { Cart, CartItem, Product } from '../../models/cart.model';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FormsModule, RequireDirective],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
    providers: [BsModalService],
})
export class ProductsComponent implements OnInit {
    @ViewChild('newItemTemplate') newItemTemplate?: TemplateRef<any>;

    @Input() public cart: Cart = {
        items: [],
        totalAmount: 0
    }

    public modalRef?: BsModalRef;

    public products: Product[] = []

    public newProduct: Product = {
        id: 0,
        name: '',
        price: 0,
        imageUrl: '',
        description: '',
        category: '',
    }

    constructor(
        private modalService: BsModalService,
        private productService: ProductsService,
    ) { }

    ngOnInit(): void {
        this.products = this.productService.getProducts();
    }

    public onNewProductClick(): void {
        if (!this.newItemTemplate) {
            alert('Template not found!');
            return;
        }

        this.newProduct = {
            id: 0,
            name: '',
            price: 0,
            imageUrl: '',
            description: '',
            category: 'Custom Product',
            isCustom: true,
        };
        this.modalRef = this.modalService.show(this.newItemTemplate, { class: 'modal-lg' });
    }

    public onConfirmAddProduct(): void {
        const maxId = Math.max(...this.products.map(p => p.id), 0) + 1;
        this.newProduct.id = maxId;

        const isComplete = this.productService.addCustomProduct(this.newProduct);
        if (!isComplete) {
            return;
        }

        this.products = this.productService.getProducts();
        this.modalRef?.hide();
    }

    public onDeleteProduct(id: number): void {
        this.productService.deleteCustomProduct(id);
        this.products = this.productService.getProducts();

        this.cart.items = this.cart.items.filter(item => item.id !== id);
        this.cart.totalAmount = this.cart.items.reduce((total, item) => total + item.totalPrice, 0);
    }

    public addToCart(product: Product) {
        const existingItem = this.cart.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.price * existingItem.quantity;
        }
        else {
            const newItem: CartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                totalPrice: product.price,
                imageUrl: product.imageUrl,
            };
            this.cart.items.push(newItem);
        }
        this.updateTotalAmount();
    }

    public updateTotalAmount(): void {
        this.cart.totalAmount = this.cart.items.reduce((total, item) => total + item.totalPrice, 0);
    }
}
