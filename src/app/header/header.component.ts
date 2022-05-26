import { Component } from '@angular/core';

// Decorater
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  newPost: string = 'NO CONTENT2';
  enteredValue: string = '';
}
