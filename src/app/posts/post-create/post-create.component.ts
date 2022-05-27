import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

// Decorater
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  enteredContent: string = '';
  enteredTitle: string = '';
  constructor(public postsService: PostsService) {}

  // @Output() postCreated = new EventEmitter<Post>();
  // postCreated = new EventEmitter<Post>();

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(
      Math.random().toString(),
      form.value.title,
      form.value.content
    );
    form.resetForm();
  }
}
