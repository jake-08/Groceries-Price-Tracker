import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/category/category.model';
import { CategoryService } from 'src/app/category/category.service';
import { Item } from 'src/app/item/item.model';
import { ItemService } from 'src/app/item/item.service';
import {
  ConfirmDeleteModel,
  DeleteDialogComponent,
} from 'src/app/shared/delete-dialog/delete-dialog.component';
import { Shop } from 'src/app/shop/shop.model';
import { ShopService } from 'src/app/shop/shop.service';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styles: [],
})
export class ItemListComponent implements OnInit, OnDestroy {
  items: Item[];
  categories: Category[];
  categorySelected: number = null;
  shopSelected: number = null;
  filterEntered: string = null;
  shops: Shop[];
  itemTableData = new MatTableDataSource<Item>();
  displayedColumns: string[] = [
    'name',
    'price',
    'unitPrice',
    'category',
    'date',
    'action',
  ];
  private itemSubscription: Subscription;
  private catSubscription: Subscription;
  private shopSubscription: Subscription;

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private shopService: ShopService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private db: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.db.collection('items').valueChanges().subscribe(result => {
      console.log(result[0]['category'])
    })

    this.items = this.itemService.getItems();
    this.categories = this.categoryService.getCategories();
    this.shops = this.shopService.getShops();

    this.itemTableData.data = this.items;

    this.itemSubscription = this.itemService.itemsChanged.subscribe(
      (items: Item[]) => {
        this.itemTableData.data = items;
      }
    );

    this.catSubscription = this.categoryService.categoryChanged.subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      }
    );

    this.shopSubscription = this.shopService.shopChanged.subscribe(
      (shops: Shop[]) => {
        this.shops = shops;
      }
    );
  }

  ngOnDestroy(): void {
    this.itemSubscription.unsubscribe();
    this.catSubscription.unsubscribe();
    this.shopSubscription.unsubscribe();
  }

  onNewItem() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditItem(index: number) {
    this.router.navigate(['edit', index], { relativeTo: this.route });
  }

  onDeleteItem(index: number) {
    this.itemService.deleteItem(index);
  }

  openDeleteDialog(index: number) {
    const title = 'Item';
    const name = this.itemService.getItem(index).name;

    const dialogData = new ConfirmDeleteModel(title, name);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      maxWidth: '400px',
      position: { top: '10%' },
      autoFocus: false,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.onDeleteItem(index);
      }
    });
  }

  clear() {
    this.shopSelected = null;
    this.categorySelected = null;
    this.filterEntered = null;
    this.itemTableData = new MatTableDataSource(this.items);
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    this.itemTableData.filter = filter;
  }

  onCategoryChange(): void {
    // if shop is not selected, filter the categories only, else consider shop selection as well
    if (this.shopSelected == null) {
      // if all categories is selected, show all, otherwise, filter using the selected category
      if (this.categorySelected == -1) {
        this.itemTableData = new MatTableDataSource(this.items); //
      } else {
        const filter = this.filterByCategory(this.categorySelected);
        this.itemTableData = new MatTableDataSource(filter);
      }
    } else {
      // if both category and shop selected are not show all, call the both filter function
      // if both category and shop selected are selected show all, show all
      // if either category or shop is selected show all, just filter using one
      if (this.categorySelected != -1 && this.shopSelected != -1) {
        const filter = this.onSelectBothShopAndCategory(
          this.categorySelected,
          this.shopSelected
        );
        this.itemTableData = new MatTableDataSource(filter);
      } else if (this.categorySelected == -1 && this.shopSelected == -1) {
        this.itemTableData = new MatTableDataSource(this.items);
      } else {
        if (this.shopSelected == -1) {
          const filter = this.filterByCategory(this.categorySelected);
          this.itemTableData = new MatTableDataSource(filter);
        } else {
          const filter = this.filterByShop(this.shopSelected);
          this.itemTableData = new MatTableDataSource(filter);
        }
      }
    }
  }

  onShopChange(): void {
    if (this.categorySelected == null) {
      if (this.shopSelected == -1) {
        this.itemTableData = new MatTableDataSource(this.items);
      } else {
        const filter = this.filterByShop(this.shopSelected);
        this.itemTableData = new MatTableDataSource(filter);
      }
    } else {
      if (this.shopSelected != -1 && this.categorySelected != -1) {
        const filter = this.onSelectBothShopAndCategory(
          this.categorySelected,
          this.shopSelected
        );
        this.itemTableData = new MatTableDataSource(filter);
      } else if (this.categorySelected == -1 && this.shopSelected == -1) {
        this.itemTableData = new MatTableDataSource(this.items);
      } else {
        if (this.categorySelected == -1) {
          const filter = this.filterByShop(this.shopSelected);
          this.itemTableData = new MatTableDataSource(filter);
        } else {
          const filter = this.filterByCategory(this.categorySelected);
          this.itemTableData = new MatTableDataSource(filter);
        }
      }
    }
  }

  private onSelectBothShopAndCategory(
    categorySelected: number,
    shopSelected: number
  ) {
    const filterCategory = _.filter(this.items, (item) => {
      return item.category.id == categorySelected;
    });
    const filterShop = _.filter(filterCategory, (item) => {
      return item.shop.id == shopSelected;
    });
    return filterShop;
  }

  private filterByCategory(categorySelected: number) {
    const filter = _.filter(this.items, (item) => {
      return item.category.id == categorySelected;
    });
    return filter;
  }

  private filterByShop(shopSelected: number) {
    const filter = _.filter(this.items, (item) => {
      return item.shop.id == shopSelected;
    });
    return filter;
  }
}
