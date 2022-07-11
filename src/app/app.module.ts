import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './shared/header/header.component';
import { DeleteDialogComponent } from './shared/delete-dialog/delete-dialog.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthComponent } from './auth/auth/auth.component';
import { ItemStartComponent } from './item/item-start/item-start.component';
import { ItemListComponent } from './item/item-list/item-list.component';
import { ItemEditComponent } from './item/item-edit/item-edit.component';
import { CategoryDialogComponent } from './category/category-dialog/category-dialog.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { ShopListComponent } from './shop/shop-list/shop-list.component';
import { ShopDialogComponent } from './shop/shop-dialog/shop-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemTableResponsiveDirective } from './item/item-table-responsive.directive';
import { ErrorStateMatcher, MAT_DATE_LOCALE, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DeleteDialogComponent,
    FooterComponent,
    AuthComponent,
    ItemStartComponent,
    ItemListComponent,
    ItemEditComponent,
    CategoryDialogComponent,
    CategoryListComponent,
    ShopListComponent,
    ShopDialogComponent,
    ItemTableResponsiveDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  exports: [ItemTableResponsiveDirective],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}],
  bootstrap: [AppComponent]
})
export class AppModule { }
