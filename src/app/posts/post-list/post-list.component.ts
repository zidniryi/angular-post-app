import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  isLoading: boolean = false;
  totalPosts: number = 0;
  postsPerPage: number = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage: number = 1;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    // Subscribe
    this.postSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Array<Post>; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

  // Handling pagination
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
