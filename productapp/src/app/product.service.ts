import { DepartmentService } from './department.service';
import { Product } from './product';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Department } from './department';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly url = environment.url + "products"
  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([])
  private loaded: boolean = false

  constructor(private http: HttpClient, private departmentService: DepartmentService) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {
      combineLatest(
        this.http.get<Product[]>(this.url),
        this.departmentService.get()
      ).pipe(
        tap(([products, departments]) => console.log(products, departments)),
        map(([products, departments]) => {
          for (let p of products) {
            let ids = (p.departments as any)
            //if (p.departments)
            p.departments = ids.map((id: any) => departments.find(dep => dep._id == id))
          }
          console.log(products, departments)
          return products

        }),
        tap((products) => console.log(products))
      )
      .subscribe(this.productsSubject$)

      this.loaded = true
    }
    return this.productsSubject$.asObservable()
  }

  add(prod: Product): Observable<Product> {
    console.log(prod)
    //let department = (prod.departments as Department[]).map(d=>d._id)
    let department = (prod.departments as Department[]).map(d=>d._id)
    return this.http.post<Product>(this.url, {...prod, department})
    .pipe(
      tap((p) => {
        this.productsSubject$.getValue()
        .push({...prod, _id: p._id})
      })
      )
  }

  del(prod: Product): Observable<any> {
    return this.http.delete(`${this.url}/${prod._id}`)
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue()
          let i = products.findIndex(p => p._id === prod._id)
            if (i >= 0) {
              products.splice(i, 1)
            }
        })
      )
  }

  update(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map(d=>d._id)
    return this.http.patch<Product>(`${this.url}/${prod._id}`, {...prod, departments})
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue()
          let i = products.findIndex(p => p._id === prod._id)
            if (i >= 0) {
              products[i] = prod
            }
        })
      )
  }

}
