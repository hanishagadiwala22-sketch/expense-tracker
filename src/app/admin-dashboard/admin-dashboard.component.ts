import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>Welcome, Admin {{ fullName }}!</h1>
      <p>You have administrative privileges.</p>

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
export class AdminDashboardComponent implements OnInit {
  fullName = '';

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    // 🔹 Get fullName from navigation state
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    this.fullName = state?.fullName || 'Admin';
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
