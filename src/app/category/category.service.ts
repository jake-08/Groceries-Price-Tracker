import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Category } from "./category.model";

@Injectable({providedIn: 'root'})
export class CategoryService {
    private categories: Category[] = [
        new Category(0,'Drinks'),
        new Category(1,'Diary'),
        new Category(2,'Meat'),
        new Category(3,'Bread'),
        new Category(4,'Fruit'),
    ]
    categoryChanged = new BehaviorSubject<Category[]>(this.categories);

    getCategories() {
        return this.categories.slice();
    }

    getCategory(index: number) {
        return this.categories[index];
    }

    addCategory(category: Category) {
        this.categories.push(category);
        this.categoryChanged.next(this.categories.slice());
    }

    updateCategory(index: number, newCategory: Category) {
        this.categories[index] = newCategory;
        this.categoryChanged.next(this.categories.slice());
    }

    deleteCategory(index: number) {
        this.categories.splice(index, 1);
        this.categoryChanged.next(this.categories.slice());
    }
    
}