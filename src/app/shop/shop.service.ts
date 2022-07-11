import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Shop } from "./shop.model";

@Injectable({providedIn: 'root'})
export class ShopService {
    private shops: Shop[] = [
        new Shop(0,'Woolies'),
        new Shop(1,'Coles'),
        new Shop(2,'Aldi'),
        new Shop(3,'Costco'),
    ]
    shopChanged = new BehaviorSubject<Shop[]>(this.shops);

    getShops() {
        return this.shops.slice();
    }

    getShop(index: number) {
        return this.shops[index];
    }

    addShop(shop: Shop) {
        this.shops.push(shop);
        this.shopChanged.next(this.shops.slice());
    }

    updateShop(index: number, newShop: Shop) {
        this.shops[index] = newShop;
        this.shopChanged.next(this.shops.slice());
    }

    deleteShop(index: number) {
        this.shops.splice(index, 1);
        this.shopChanged.next(this.shops.slice());
    }
    
}