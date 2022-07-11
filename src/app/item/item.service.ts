import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from '../category/category.service';
import { ShopService } from '../shop/shop.service';
import { Item } from './item.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class ItemService {

  private items: Item[] = [
    new Item(
      'Lipton Ice Team 1.5L',
      2.1,
      2,
      'per l',
      '30%',
      this.shopService.getShop(0),
      new Date(),
      this.categoryService.getCategory(0)
    ),
    new Item(
      'Banana Cavendish',
      2.87,
      2.5,
      'per kg',
      '40%',
      this.shopService.getShop(3),
      new Date(),
      this.categoryService.getCategory(1)
    ),
    new Item(
      'Lamb',
      2.1,
      2,
      'per l',
      '30%',
      this.shopService.getShop(2),
      new Date(),
      this.categoryService.getCategory(3)
    ),
    new Item(
      'Chicken',
      2.87,
      2.5,
      'per kg',
      '40%',
      this.shopService.getShop(2),
      new Date(),
      this.categoryService.getCategory(4)
    ),
    new Item(
      'Ice',
      2.1,
      2,
      'per l',
      '30%',
      this.shopService.getShop(3),
      new Date(),
      this.categoryService.getCategory(2)
    ),
    new Item(
      'Apple',
      2.87,
      2.5,
      'per kg',
      '40%',
      this.shopService.getShop(1),
      new Date(),
      this.categoryService.getCategory(2)
    ),
    new Item(
      'Chips',
      2.1,
      2,
      'per l',
      '30%',
      this.shopService.getShop(0),
      new Date(),
      this.categoryService.getCategory(0)
    ),
    new Item(
      'Banana Cavendish',
      2.87,
      2.5,
      'per kg',
      '40%',
      this.shopService.getShop(1),
      new Date(),
      this.categoryService.getCategory(2)
    ),
    new Item(
      'Lipton Ice Team 1.5L',
      2.1,
      2,
      'per l',
      '30%',
      this.shopService.getShop(0),
      new Date(),
      this.categoryService.getCategory(0)
    ),
    new Item(
      'Banana Cavendish',
      2.87,
      2.5,
      'per kg',
      '40%',
      this.shopService.getShop(1),
      new Date(),
      this.categoryService.getCategory(2)
    ),
    new Item(
      'Lipton Ice Team 1.5L',
      2.1,
      2,
      'per l',
      '30%',
      this.shopService.getShop(0),
      new Date(),
      this.categoryService.getCategory(0)
    ),
    new Item(
      'Banana Cavendish',
      2.87,
      2.5,
      'per kg',
      '40%',
      this.shopService.getShop(1),
      new Date(),
      this.categoryService.getCategory(2)
    ),
  ];
  itemsChanged = new BehaviorSubject<Item[]>(this.items);
  constructor(
    private categoryService: CategoryService,
    private shopService: ShopService, 
    private db: AngularFirestore,
  ) {}

  getItems() {
    return this.items.slice();
  }

  getItem(index: number) {
    return this.items[index];
  }

  addItem(item: Item) {
    this.items.push(item);
    this.itemsChanged.next(this.items.slice());
  }

  updateItem(index: number, newItem: Item) {
    this.items[index] = newItem;
    this.itemsChanged.next(this.items.slice());
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.itemsChanged.next(this.items.slice());
  }
}
