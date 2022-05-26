import { Injectable } from '@angular/core';
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
  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title: title,
      content: content,
    };
    this.posts.push(post);
    // Emmiting rx js
    this.postsUpdated.next([...this.posts]);
  }
}
