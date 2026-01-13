import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm() {
    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        terms: [false, Validators.requiredTrue]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password, role } = this.signupForm.value;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        const uid = res.user?.uid;

        // Save user info in Firestore
        return this.firestore.collection('users').doc(uid).set({
          fullName,
          email,
          role,
          createdAt: new Date()
        }).then(() => ({ uid, role, fullName }));
      })
      .then(userData => {
        this.loading = false;
        this.successMessage = 'Account created successfully!';
        this.signupForm.reset();

        // Use NavigationExtras to pass welcome data
        const navigationExtras = { state: { fullName: userData.fullName, role: userData.role } };

        // Redirect based on role
        if (userData.role === 'admin') {
          this.router.navigate(['/admin-dashboard'], navigationExtras);
        } else {
          this.router.navigate(['/user-dashboard'], navigationExtras);
        }
      })
      .catch(err => {
        this.loading = false;
        if (err.code === 'auth/email-already-in-use') {
          this.errorMessage = 'This email is already registered. Please login.';
        } else if (err.code === 'auth/weak-password') {
          this.errorMessage = 'Password should be at least 6 characters.';
        } else {
          this.errorMessage = err.message;
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
