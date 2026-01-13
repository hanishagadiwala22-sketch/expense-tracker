import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFirestoreModule
    )
  ]
});
