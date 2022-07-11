import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth/auth.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { ItemEditComponent } from './item/item-edit/item-edit.component';
import { ItemListComponent } from './item/item-list/item-list.component';
import { ItemStartComponent } from './item/item-start/item-start.component';
import { ShopListComponent } from './shop/shop-list/shop-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/item', pathMatch: 'full' },
  { path: 'item', component: ItemStartComponent, canActivate: [AuthGuard], children: [
    { path: '', component: ItemListComponent },
    { path: 'new', component: ItemEditComponent },
    { path: 'edit/:id', component: ItemEditComponent },
  ] },
  { path: 'category', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: 'shop', component: ShopListComponent, canActivate: [AuthGuard] }, 
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
