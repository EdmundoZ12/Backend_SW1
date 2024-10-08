import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';


  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: 'gs://agendaescolar-cd300.appspot.com'
  });

export default admin;