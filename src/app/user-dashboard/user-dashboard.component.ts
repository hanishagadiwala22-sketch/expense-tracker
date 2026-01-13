import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>Welcome, {{ fullName }}!</h1>
      <p>You are logged in as a <strong>{{ role }}</strong>.</p>

      <button (click)="logout()">Logout</button>
    </div>
  `,
  styles: [`
    .dashboard-container {
      text-align: center;
      margin-top: 50px;
      font-family: Arial, sans-serif;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  fullName = '';
  role = '';

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    // 🔹 Get welcome info from navigation state
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    this.fullName = state?.fullName || 'User';
    this.role = state?.role || 'user';
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
