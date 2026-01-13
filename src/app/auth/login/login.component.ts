import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 🔹 Login method
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    // 🔹 Sign in with Firebase
    this.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        const uid = res.user?.uid;
        if (!uid) throw new Error('User ID not found');

        // 🔹 Get user info from Firestore
        return this.firestore.collection('users').doc(uid).get().toPromise();
      })
      .then(doc => {
        this.loading = false;

        // ⚡ Check doc exists
        if (!doc || !doc.exists) {
          this.errorMessage = 'User data not found. Please signup first.';
          return;
        }

        const data: any = doc.data();
        if (!data) {
          this.errorMessage = 'User data is empty. Please signup again.';
          return;
        }

        const { fullName, role } = data;

        // 🔹 Redirect based on role with welcome info
        const navigationExtras = { state: { fullName, role } };

        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard'], navigationExtras);
        } else {
          this.router.navigate(['/user-dashboard'], navigationExtras);
        }

      })
      .catch(err => {
        this.loading = false;

        // 🔴 Friendly error messages
        if (err.code === 'auth/user-not-found') {
          this.errorMessage = 'No account found with this email.';
        } else if (err.code === 'auth/wrong-password') {
          this.errorMessage = 'Incorrect password.';
        } else {
          this.errorMessage = err.message;
        }
      });
  }

  // 🔹 Navigate to signup page
  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
