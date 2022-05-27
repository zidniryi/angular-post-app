import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxJS
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Array<Post> = [];
  // RxJS
  private postsUpdated = new Subject<Array<Post>>();
  // Dependecy injection is a way to inject a dependency into a constructor.
  //  Kenapa pakai ini karena kalau tidak harus emmit ke banyak file
  // kita bisa langsung inject ke constructor

  constructor(private http: HttpClient) {}

  // Type <<>>
  // Subscribe Data, Err, Complete kayak Try catch
  getPosts() {
    this.http
      .get<{ message: string; posts: Array<Post> }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
    };
    // this.posts.push(post);
    this.http
      .post<{ message: string; posts: Array<Post> }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        console.log(response.posts);
      });
    this.posts.push(post);
    // Emmiting rx js
    this.postsUpdated.next([...this.posts]);
  }
}
