import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

// Decorater
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredContent: string = '';
  enteredTitle: string = '';
  private mode = 'create';
  private postId: string | any;
  post: Post | any;
  isLoading: boolean = false;
  form!: FormGroup;
  imagePreview!: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
          };
          console.log(postData, 'COk');
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // @Output() postCreated = new EventEmitter<Post>();
  // postCreated = new EventEmitter<Post>();

  onSavePost() {
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form?.value.title,
        this.form?.value.content,
        this.form?.value.image
      );
      this.form?.reset();
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form?.value.title,
        this.form?.value.content,
        this.form?.value.image
      );
    }
  }
  // Handle image pick
  onImagePicked(event: Event) {
    const file: string | any = (event.target as HTMLInputElement)?.files?.[0];
    this.form?.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
