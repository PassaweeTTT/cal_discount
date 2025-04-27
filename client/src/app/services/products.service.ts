import { Injectable } from '@angular/core';
import { Product } from '../models/products.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor() { }

    public getDefaultProducts(): Product[] {
        return [
            { id: 1, name: 'Product 1', price: 299, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 1', category: 'Category A', },
            { id: 2, name: 'Product 2', price: 199, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 2', category: 'Category B', },
            { id: 3, name: 'Product 3', price: 399, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Productivity i like buy', category: 'Category A', },
            { id: 4, name: 'Product 4', price: 499, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 4', category: 'Category C', },
            { id: 5, name: 'Product 5', price: 599, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 5', category: 'Category B', },
            { id: 6, name: 'Product 6', price: 699, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 6', category: 'Category A', },
            { id: 7, name: 'Product 7', price: 799, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 7', category: 'Category C', },
            { id: 8, name: 'Product 8', price: 899, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 8', category: 'Category B', },
            { id: 9, name: 'Product 9', price: 999, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 9', category: 'Category A', },
            { id: 10, name: 'Product 10', price: 1099, imageUrl: 'https://via.placeholder.com/300', description: 'Description for Product 10', category: 'Category C', }
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
