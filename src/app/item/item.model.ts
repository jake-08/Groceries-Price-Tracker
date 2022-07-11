import { Category } from "../category/category.model";
import { Shop } from "../shop/shop.model";

export class Item {
    constructor(
    public name: string,
    public price: number,
    public unitPrice: number,
    public unitMeasure: string,
    public discount: string,
    public shop: Shop,
    public date: Date,
    public category: Category,
    ) {}
}