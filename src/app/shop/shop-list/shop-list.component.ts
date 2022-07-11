import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmDeleteModel, DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { ShopDialogComponent } from '../shop-dialog/shop-dialog.component';
import { Shop } from '../shop.model';
import { ShopService } from '../shop.service';

const COLUMNS_SCHEMA = [
  {
    key: 'name',
    type: 'text',
    label: 'Shop Name',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: 'Edit',
  },
  {
    key: "isDelete",
    type: "isDelete",
    label: "Delete"
  }
];
@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styles: [
  ]
})
export class ShopListComponent implements OnInit {
  shops: Shop[];
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  private subscription: Subscription;
  shopForm: FormGroup;

  constructor(private shopService: ShopService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.shops = this.shopService.getShops();
    this.subscription = this.shopService.shopChanged.subscribe(
      (shops: Shop[]) => {
        this.shops = shops;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onEditMode(index: number) {
    this.shops[index].isEdit = true;
    const shop = this.shopService.getShop(index);
    const shopName = shop.name;
    this.shopForm = new FormGroup({
      'shopName': new FormControl(shopName, [Validators.required, this.duplicateShop.bind(this)]),
    })
  }

  onSubmit(index: number) {
    const updatedShop = new Shop(index, this.shopForm.value.shopName, this.shops[index].isEdit = false)
    this.shopService.updateShop(index, updatedShop);
  }

  duplicateShop(control: FormControl): {[s: string]: boolean} {
    if (this.shops.filter(element => element.name.toLowerCase() === control.value.toLowerCase()).length > 0) {
      return {'duplicatedShop': true};
    }
    return null;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.shopForm.controls[controlName].hasError(errorName);
  };

  openShopDialog(): void {
    this.dialog.open(ShopDialogComponent, {
      width: '300px',
      height: '250px',
      position: { top: '10%' },
      restoreFocus: false, // to remove the auto focus after submitting the dialog 
      data: { shopArray: this.shops }
    });
  }

  onCancel(index: number): void {
    const category = this.shopService.getShop(index);
    category.isEdit = false;
  }

  onDeleteShop(index: number) {
    this.shopService.deleteShop(index);
  }

  openDeleteDialog(index: number) { 
    const title = 'Item';
    const name = this.shopService.getShop(index).name;

    const dialogData = new ConfirmDeleteModel(title, name);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      maxWidth: '400px',
      position: {top: '10%'},
      autoFocus: false,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.onDeleteShop(index);
      }
    })

  }
}
