import { Injectable } from '@angular/core';
import { Product } from '../models/products.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor() { }

    public getDefaultProducts(): Product[] {
        return [
            { id: 1, name: 'Blue Sneaker', price: 1499, imageUrl: 'images/products/shoes_1.jpg', description: '', category: 'Shoes', },
            { id: 2, name: 'Cool Shirt', price: 1050, imageUrl: 'images/products/shirt_1.jpg', description: '', category: 'Shirt', },
            { id: 3, name: 'Cooler Shirt', price: 1051, imageUrl: 'images/products/shirt_2.jpg', description: '', category: 'Shirt', },
            { id: 4, name: 'Long Pant', price: 1200, imageUrl: 'images/products/pant_1.jpg', description: '', category: 'Pant', },
            { id: 5, name: 'What Watch', price: 4500, imageUrl: 'images/products/watch_1.jpg', description: '', category: 'Watch', },
        ]
    }

    public getCustomProducts(): Product[] {
        const json = localStorage.getItem('custom-products');
        const products: Product[] = json ? JSON.parse(json) : [];
        return products;
    }

    public getProducts(): Product[] {
        let result: Product[] = this.getDefaultProducts();
        const customProduct = this.getCustomProducts();

        if (customProduct.length > 0) {
            customProduct.forEach((item: Product) => {
                const isDuplicate = result.some((p: Product) => p.id === item.id);
                if (isDuplicate) {
                    const maxId = Math.max(...result.map((p: Product) => p.id));
                    item.id = maxId + 1;
                }
            });
            result = [...result, ...customProduct];
        }

        return result;
    }

    public addCustomProduct(product: Product): boolean {
        const products = this.getCustomProducts();

        if (!product.name) {
            alert('Product name is required!');
            return false;
        }
        if (!product.description) {
            alert('Product description is required!');
            return false;
        }

        if (!product.category) {
            alert('Product category is required!');
            return false;
        }

        if (!product.price) {
            alert('Product price is required!');
            return false;
        } else {
            if (product.price < 0) {
                alert('Product price must be greater than 0!');
                return false;
            }
        }

        const isDuplicate = products.some((p: Product) => p.name === product.name);
        if (isDuplicate) {
            alert('Product already exists!');
            return false;
        }

        const isDuplicateById = products.some((p: Product) => p.id === product.id);
        if (isDuplicateById) {
            product.id = Math.max(...products.map((p: Product) => p.id)) + 1;
        }

        products.push(product);
        localStorage.setItem('custom-products', JSON.stringify(products));

        return true;
    }

    public deleteCustomProduct(id: number): void {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        const products = this.getCustomProducts();
        const updatedProducts = products.filter((p: Product) => p.id !== id);
        localStorage.setItem('custom-products', JSON.stringify(updatedProducts));
    }
}
