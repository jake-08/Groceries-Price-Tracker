import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmDeleteModel, DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

const COLUMNS_SCHEMA = [
  {
    key: 'name',
    type: 'text',
    label: 'Category Name',
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: "Edit"
  },
  {
    key: "isDelete",
    type: "isDelete",
    label: "Delete"
  }
];
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styles: [
  ]
})
export class CategoryListComponent implements OnInit {
  categories: Category[];
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);;
  columnsSchema: any = COLUMNS_SCHEMA;
  editMode = false; 
  private subscription: Subscription;
  categoryForm: FormGroup;

  constructor(private categoryService: CategoryService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
    this.subscription = this.categoryService.categoryChanged
      .subscribe(
        (categories: Category[]) => {
          this.categories = categories;
        }
      )
  }

  onEditMode(index: number) {
    this.categories[index].isEdit = true;
    const category = this.categoryService.getCategory(index);
    const categoryName = category.name;
    this.categoryForm = new FormGroup({
      'categoryName': new FormControl(categoryName, [Validators.required, this.duplicateCategory.bind(this)]),
    })
  }

  onSubmit(index: number) {
    const updatedCategory = new Category(index, this.categoryForm.value.categoryName, this.categories[index].isEdit = false)
    this.categoryService.updateCategory(index, updatedCategory);
  }

  duplicateCategory(control: FormControl): {[s: string]: boolean} {
    if (this.categories.filter(element => element.name.toLowerCase() === control.value.toLowerCase()).length > 0) {
      return {'duplicatedCategory': true};
    }
    return null;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.categoryForm.controls[controlName].hasError(errorName);
  };

  onCancel(index: number): void {
    const category = this.categoryService.getCategory(index);
    category.isEdit = false;
  }

  openCatDialog(): void {
    this.dialog.open(CategoryDialogComponent, {
      width: '300px',
      height: '250px',
      position: {top: '10%'},
      restoreFocus: false, // to remove the auto focus after submitting the dialog 
      data: { catArray: this.categories }
    })
  }

  onDeleteCategory(index: number) {
    this.categoryService.deleteCategory(index);
  }

  openDeleteDialog(index: number) { 
    const title = 'Category';
    const name = this.categoryService.getCategory(index).name;

    const dialogData = new ConfirmDeleteModel(title, name);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      maxWidth: '400px',
      position: {top: '10%'},
      autoFocus: false,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.onDeleteCategory(index);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
