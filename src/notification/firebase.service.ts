// src/notification/firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private static isInitialized = false;
  private readonly admin: admin.app.App;

  constructor() {
    if (!FirebaseService.isInitialized) {
      this.admin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      FirebaseService.isInitialized = true;
    }
  }

  getMessaging() {
    return admin.messaging();
  }
}
