import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { Demo} from './demo/demo';
export const routes: Routes = [
  { path: 'demo', component: Demo },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },

  // 🔹 Authentication
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  // 🔹 Dashboards
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },

  // 🔹 Fallback route
  { path: '**', redirectTo: 'signup' } // optional, redirects unknown paths
];
