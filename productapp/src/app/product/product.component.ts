import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DepartmentService } from './../department.service';
import { ProductService } from './../product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Product } from '../product';
import { Department } from '../department';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    departments: [[], Validators.required]
  })

  products: Product[] = []
  departments: Department[] = []

  @ViewChild('form') form!: NgForm

  private unsubscribe$: Subject<any> = new Subject<any>()

  constructor(private productService: ProductService, private fb: FormBuilder,
              private departmentService: DepartmentService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.productService.get()
    .pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe((prods) => this.products = prods)
    this.departmentService.get()
    .pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe((deps) => this.departments = deps)
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
  }

  save() {
    let data = this.productForm.value
    console.log(data)
    if (data._id != null) {
      //console.log(data._id + "if")
      this.productService.update(data)
        .subscribe()
    } else {
      console.log(data._id)
      this.productService.add(data)
        .subscribe()
    }

    this.resetForm()
  }

  editProd(p: Product) {
    this.productForm.setValue(p)
  }

  deleteProd(p: Product) {
    this.productService.del(p)
      .subscribe(
        () => this.notify("Deleted!"),
          (err) => console.log(err)

      )
  }

  notify(msg: string) {
    this.snackBar.open(msg, "OK", {duration: 3000})
  }

  resetForm() {
    //this.productForm.reset()
    this.form.resetForm()
  }

  funct() {
    console.log(this.productForm.getRawValue())
  }

}
