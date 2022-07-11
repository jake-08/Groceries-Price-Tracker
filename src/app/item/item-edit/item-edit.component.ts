import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/category/category.model';
import { CategoryService } from 'src/app/category/category.service';
import { ShopDialogComponent } from 'src/app/shop/shop-dialog/shop-dialog.component';
import { Shop } from 'src/app/shop/shop.model';
import { ShopService } from 'src/app/shop/shop.service';
import { CategoryDialogComponent } from '../../category/category-dialog/category-dialog.component';
import { Item } from '../item.model';
import { ItemService } from '../item.service';

interface Discount {
  value: string;
}

interface UnitMeasure {
  value: string;
}

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
})
export class ItemEditComponent implements OnInit, OnDestroy {

  unitMesaure: UnitMeasure[] = [
    { value: 'per kg' },
    { value: 'per l' },
    { value: 'each' },
    { value: 'per 500g' },
    { value: 'per 500ml' },
    { value: 'per 100g' },
    { value: 'per 100ml' },
    { value: 'per 100ea' },
    { value: 'per 10ml' },
    { value: '2 for 3' },
    { value: '3 for 5' },
  ]

  categories: Category[];
  shops: Shop[];
  itemForm: FormGroup;
  id: number;
  maxDate = new Date();
  editMode = false;
  private catSubscription: Subscription;
  private shopSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private shopService: ShopService,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
      }
    );
    this.catSubscription = this.categoryService.categoryChanged.subscribe((categories: Category[]) => {
      this.categories = categories;
    })

    this.shopSubscription = this.shopService.shopChanged.subscribe((shops: Shop[]) => {
      this.shops = shops;
    })

    this.categories = this.categoryService.getCategories();
    this.shops = this.shopService.getShops();
  }

  ngOnDestroy(): void {
    this.catSubscription.unsubscribe();
    this.shopSubscription.unsubscribe();
  }

  private initForm() {
    let itemName = '';
    let itemPrice: number;
    let unitPrice: number;
    let selectedCategory: number;
    let selectedShop: number;
    let selectedDiscount: number;
    let selectedMeasure = this.unitMesaure[0].value;
    let selectedDate: Date = this.maxDate;
    if (this.editMode) {
      const item = this.itemService.getItem(this.id);
      itemName = item.name;
      itemPrice = item.price;
      unitPrice = item.unitPrice;
      if (item['category']) {
        selectedCategory = item.category.id;
      }
      if (item['shop']) {
        selectedShop = item.shop.id;
      }
      selectedDiscount = +item.discount.slice(0, -1);
      selectedMeasure = item.unitMeasure;
      selectedDate = item.date;
    }
    this.itemForm = new FormGroup({
      'name': new FormControl(itemName, Validators.required),
      'price': new FormControl(itemPrice, Validators.required),
      'unitPrice': new FormControl(unitPrice, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'unitMeasure': new FormControl(selectedMeasure, Validators.required),
      'category': new FormControl(selectedCategory, Validators.required),
      'shop': new FormControl(selectedShop, Validators.required),
      'discount': new FormControl(selectedDiscount, Validators.required),
      'purchaseDate': new FormControl(selectedDate)
    })
  }

  onSubmit() {
    const formObj: Item = {
      'name': this.itemForm.value.name,
      'price': this.itemForm.value.price,
      'unitPrice': this.itemForm.value.unitPrice,
      'unitMeasure': this.itemForm.value.unitMeasure,
      'category': this.categoryService.getCategory(this.itemForm.value.category),
      'shop': this.shopService.getShop(this.itemForm.value.shop),
      'discount': this.itemForm.value.discount + "%",
      'date': this.itemForm.value.purchaseDate,
    }
    if (this.editMode) {
      console.log(this.itemForm)
      this.itemService.updateItem(this.id, formObj);
    } else {
      this.itemService.addItem(formObj);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.itemForm.controls[controlName].hasError(errorName);
  };

  openCatDialog(): void {
    this.dialog.open(CategoryDialogComponent, {
      width: '300px',
      height: '250px',
      position: { top: '10%' },
      restoreFocus: false,
      data: { catArray: this.categories }
    });
  }

  openShopDialog(): void {
    this.dialog.open(ShopDialogComponent, {
      width: '300px',
      height: '250px',
      position: { top: '10%' },
      restoreFocus: false,
      data: { shopArray: this.shops }
    });
  }
}
