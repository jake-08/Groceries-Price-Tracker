import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html'
})
export class DeleteDialogComponent implements OnInit {
  title: string;
  name: string

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DeleteDialogComponent) { 
    this.title = data.title;
    this.name = data.name;
  }

  ngOnInit(): void {
  }
}

export class ConfirmDeleteModel {
  constructor(public title: string, public name: string){}
}
