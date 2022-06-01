import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
// import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
  // If not using Binding Dependecy Injection we can use this
  // storedPosts: Array<Post> = [];
  // onPostAdded(post: Post) {
  //   this.storedPosts.push(post);
  // }
}
