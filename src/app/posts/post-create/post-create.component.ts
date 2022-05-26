import { Component } from '@angular/core';

// Decorater
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
})
export class PostCreateComponent {
  newPost: string = 'NO CONTENT2';
  enteredValue: string = '';

  onAddPost() {
    if (this.enteredValue.length > 0) {
      this.newPost = this.enteredValue;
    } else {
      alert('Please enter some text');
    }
  }
}
