import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxJS
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      // transformedPosts is new object array
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return { ...this.posts.find((p) => p.id === id) };
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http
      .put<{ message: string; post: Post }>(
        `http://localhost:3000/api/posts/${id}`,
        post
      )
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostsIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostsIndex] = post;
        // Locally
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        // Update deleted Post
        const updatePost = this.posts.filter((post) => post.id !== postId);
        this.posts = updatePost;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
