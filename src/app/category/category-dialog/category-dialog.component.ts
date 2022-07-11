import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/category/category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
})
export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private catService: CategoryService
  ) {}

  ngOnInit(): void {

    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, this.duplicateCategory.bind(this)]),
    });
  }

  onAdd() {
    if (this.categoryForm.valid) {
      const newCategoryId = this.data['catArray'].length;
      const newCategoryName = this.categoryForm.value.name;
      const newCategory = new Category(newCategoryId, newCategoryName);
      this.catService.addCategory(newCategory);
      this.dialogRef.close();
    }
  }

  duplicateCategory(control: FormControl): {[s: string]: boolean} {
    if (this.data['catArray'].filter(element => element.name.toLowerCase() === control.value.toLowerCase()).length > 0) {
      return {'duplicatedCategory': true};
    }
    return null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.categoryForm.controls[controlName].hasError(errorName);
  };
}
