import { defineStore } from 'pinia';
import { auth, db } from 'src/boot/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { ref as dbRef, set, get } from 'firebase/database';

interface UserData {
  uid: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  estado: 'Activo' | 'Inactivo';
  
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserData | null,
    isLoggedIn: false,
  }),

  actions: {
    async register(
      email: string,
      password: string,
      role: 'admin' | 'user',
      estado: 'Activo' | 'Inactivo'
    ) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await set(dbRef(db, `users/${uid}`), {
        email,
        password,
        role,
        estado,
        createdAt: new Date().toISOString(),
      });

      this.user = { uid, email, password, role, estado };
    },

    async login(email: string, password: string) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userSnapshot = await get(dbRef(db, `users/${uid}`));
      const userData = userSnapshot.val();

      if (!userData || !userData.role || !userData.estado) {
        throw new Error('No se pudo obtener los datos del usuario.');
      }

      if (userData.estado !== 'Activo') {
        throw new Error('Tu cuenta está inactiva. Contacta con el administrador.');
      }

      this.user = {
        uid,
        email,
        password,
        role: userData.role,
        estado: userData.estado,
      };
      this.isLoggedIn = true;
    },

    async logout() {
      await signOut(auth);
      this.user = null;
      this.isLoggedIn = false;
    },
  },
});
