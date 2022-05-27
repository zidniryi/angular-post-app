import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  // @Input() posts: Array<Post> = []; //If not using @Input() then we can use this
  posts: Array<Post> = [];
  postSub: Subscription = new Subscription();

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    // Subscribe
    this.postSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Array<Post>) => {
        console.log(posts);
        this.posts = posts;
      });
  }

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
