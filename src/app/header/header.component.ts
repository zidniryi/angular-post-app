import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

// Decorater
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  userIsAuthenticated = false;
  private authListenerSubs: Subscription | undefined;

  newPost: string = 'NO CONTENT2';
  enteredValue: string = '';

  ngOnInit(): void {
    this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy(): void {}

  onLogout() {
    this.authService.logout();
  }
}
