import { DepartmentService } from './../department.service';
import { Department } from './../department';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  depName: string = ""
  departments: Department[] = []
  depEdit: Department | any = null
  private unsubscribe$: Subject<any> = new Subject()

  constructor(private departmentService: DepartmentService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.departmentService.get()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((deps) => this.departments = deps)
  }

  save() {
    if (this.depEdit) {
      this.departmentService.update({name: this.depName, _id: this.depEdit._id})
        .subscribe(
          (dep) => {
            this.notify('updated!')
          }, (err) => {
            this.notify('Error!')
            console.error(err)
          }
        )
    } else {
      this.departmentService.add({name: this.depName})
        .subscribe(
          (dep) => {
            console.log(dep)
            this.clearFields()
            this.notify('Inserted!')
          },
          (err) => {
            this.notify('Error!')
            console.error(err)
          }
        )
    }
  }

  cancel() {
    this.clearFields()
  }

  clearFields() {
    this.depName = ""
    this.depEdit = null
  }

  deleteDep(dep: Department) {
    this.departmentService.del(dep)
      .subscribe(
        () => this.notify('Removed!'),
        (err) => console.log(err)
      )
  }

  editDep(dep: Department) {
    this.depName = dep.name
    this.depEdit = dep
  }

  notify(msg: string) {
    this.snackBar.open(msg, "OK", {duration: 3000})
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
  }

}
