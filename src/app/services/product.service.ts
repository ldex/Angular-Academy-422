import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  delay,
  shareReplay,
  tap,
  first,
  map,
  mergeAll,
  BehaviorSubject,
  switchMap,
  of,
  filter,
} from 'rxjs';
import { Product } from '../products/product.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = `${environment.apiUrl}/products`;
  products$: Observable<Product[]>;
  mostExpensiveProduct$: Observable<Product>

  constructor(private http: HttpClient) {
    this.initProducts();
    this.initMostExpensiveProduct();
  }

  private initMostExpensiveProduct() {
    this.mostExpensiveProduct$ =
      this
      .products$
      .pipe(
        map(products => [...products].sort((p1, p2) => p1.price > p2.price ? -1 : 1)),
        // [{p1}, {p2}, {p3}]
        mergeAll(),
        // {p1}, {p2}, {p3}
        first()
      )
  }

  initProducts() {
    const params = {
        sortBy: 'modifiedDate',
        order: 'desc'
    };

    const options = {
      params: params,
    };

    this.products$ = this.http
      .get<Product[]>(this.baseUrl, options)
      .pipe(
        delay(1500),
        tap(console.table)
      );
  }

  insertProduct(newProduct: Product): Observable<Product> {
    newProduct.modifiedDate = new Date();
    return this.http.post<Product>(this.baseUrl, newProduct).pipe(delay(1000));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  resetList() {
    this.initProducts();
  }
}
