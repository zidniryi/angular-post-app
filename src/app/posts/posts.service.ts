import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxJS
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Array<Post> = [];
  // RxJS
  private postsUpdated = new Subject<{
    posts: Array<Post>;
    postCount: number;
  }>();
  // Dependecy injection is a way to inject a dependency into a constructor.
  //  Kenapa pakai ini karena kalau tidak harus emmit ke banyak file
  // kita bisa langsung inject ke constructor

  // Inject HTTP, and Route Loader
  constructor(private http: HttpClient, private router: Router) {}

  // Type <<>>
  // Subscribe Data, Err, Complete kayak Try catch
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            post: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      // transformedPosts is new object array
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.post;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: '',
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
    // .subscribe(() => {
    //   // Update deleted Post
    //   const updatePost = this.posts.filter((post) => post.id !== postId);
    //   this.posts = updatePost;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }
}
