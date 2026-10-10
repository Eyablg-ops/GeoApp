// Template de configuration à copier vers `environment.ts` (et `environment.prod.ts`).
// Ces fichiers réels sont ignorés par Git et ne doivent jamais être versionnés.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'VOTRE_CLE_API_FIREBASE',
    authDomain: 'VOTRE_PROJET.firebaseapp.com',
    projectId: 'VOTRE_PROJET',
    storageBucket: 'VOTRE_PROJET.firebasestorage.app',
    messagingSenderId: 'VOTRE_SENDER_ID',
    appId: 'VOTRE_APP_ID',
    measurementId: 'VOTRE_MEASUREMENT_ID',
  },
};
