import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css'],
})
export class PracticeComponent implements OnInit {
  isClass = false;
  isIf = false;
  dataCar = [
    {
      name: 'BMW',
    },
    {
      name: 'Ford',
    },
    {
      name: 'Audi',
    },
    {
      name: 'Cherolet',
    },
    {
      name: 'Subaru',
    },
  ];

  num: number = 0;

  constructor() {}

  ngOnInit(): void {}

  onClickClass() {
    this.isClass = !this.isClass;
    console.log(this.isClass);
  }

  onNgIf() {
    this.isIf = !this.isIf;
  }
}
