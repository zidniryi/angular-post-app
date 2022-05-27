import { Component } from '@angular/core';

// Decorater
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  newPost: string = 'NO CONTENT2';
  enteredValue: string = '';
}
