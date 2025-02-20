import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@appwrite.io/pink';
import '@appwrite.io/pink-icons';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
