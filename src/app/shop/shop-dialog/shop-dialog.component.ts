import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shop } from '../shop.model';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-shop-dialog',
  templateUrl: './shop-dialog.component.html',
})
export class ShopDialogComponent implements OnInit {
  shopForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ShopDialogComponent>,
    private shopService: ShopService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.shopForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.duplicateShop.bind(this)]),
    });
  }

  onAdd() {
    if (this.shopForm.valid) {
      const newShopId = this.data['shopArray'].length;
      const newShopName = this.shopForm.value.name;
      const newShop = new Shop(newShopId, newShopName);
      this.shopService.addShop(newShop);
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  duplicateShop(control: FormControl): {[s: string]: boolean} {
    if (this.data['shopArray'].filter(element => element.name.toLowerCase() === control.value.toLowerCase()).length > 0) {
      return {'duplicatedShop': true};
    }
    return null;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.shopForm.controls[controlName].hasError(errorName);
  };
}
