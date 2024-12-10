import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, EMPTY, combineLatest, Subscription, tap, catchError, startWith, count, map, debounceTime, filter, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

import { Product } from '../product.interface';
import { ProductService } from '../../services/product.service';
import { FavouriteService } from '../../services/favourite.service';
import { AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    imports: [RouterLink, AsyncPipe, UpperCasePipe, SlicePipe, CurrencyPipe]
})
export class ProductListComponent {

  title: string = 'Products';
  selectedProduct: Product;
  errorMessage;
  autoRefreshEnabled = false;

  switchAutoRefresh() {
    this.autoRefreshEnabled = !this.autoRefreshEnabled
  }

  private autoRefreshList() {
    timer(0, 2000) // auto-refresh interval in ms
        .pipe(
          takeUntilDestroyed(),
          filter(() => this.autoRefreshEnabled), // only if auto-refresh checkbox is checked
          tap(() => this.reset())
    ).subscribe();
  }

  products$: Observable<Product[]>
  productsNumber$: Observable<number>
  mostExpensiveProduct$: Observable<Product>

  constructor(
    private productService: ProductService,
    private favouriteService: FavouriteService,
    private router: Router) {
      this.products$ = this
      .productService
      .products$

      this.productsNumber$ = this
              .products$
              .pipe(
                map(products => products.length),
                startWith(0)
              )

      this.mostExpensiveProduct$ = this
                    .productService
                    .mostExpensiveProduct$;
      this.autoRefreshList()
  }

  get favourites(): number {
    return this.favouriteService.getFavouritesNb();
  }

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  currentPage = 1;

  previousPage() {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.currentPage--;
    this.selectedProduct = null;
  }

  nextPage() {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.currentPage++;
    this.selectedProduct = null;
  }

  loadMore() {
    this.productService.initProducts()
  }

  onSelect(product: Product) {
    this.selectedProduct = product;
    this.router.navigateByUrl('/products/' + product.id);
  }

  reset() {
    this.productService.resetList();
    this.resetPagination()
  }

  resetPagination() {
    this.start = 0;
    this.end = this.pageSize;
    this.currentPage = 1;
  }
}
