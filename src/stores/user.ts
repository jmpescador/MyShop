import { defineStore } from 'pinia';
import { db } from 'src/boot/firebase';
import {
  ref as dbRef,
  get,
  update,
  remove,
} from 'firebase/database';

export interface User {
  uid: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  estado: 'Activo' | 'Inactivo';
}

export const useUserStore = defineStore('user', {
  state: () => ({
    usuarios: [] as User[],
    selectedUser: null as User | null,
  }),

  actions: {
    async fetchUsuarios() {
      const snapshot = await get(dbRef(db, 'users'));
      const data = snapshot.val();
      if (data) {
        this.usuarios = Object.keys(data).map((uid) => ({
          uid,
          ...data[uid],
        }));
      } else {
        this.usuarios = [];
      }
    },

    async fetchUsuario(uid: string) {
      const snapshot = await get(dbRef(db, `users/${uid}`));
      const data = snapshot.val();
      if (data) {
        this.selectedUser = {
          uid,
          ...data,
        };
      } else {
        this.selectedUser = null;
      }
    },

    async updateUsuario(usuario: User) {
      await update(dbRef(db, `users/${usuario.uid}`), {
        email: usuario.email,
        password: usuario.password,
        role: usuario.role,
        estado: usuario.estado,
      });
      await this.fetchUsuarios();
    },

    async updateEstadoUsuario(uid: string, nuevoEstado: 'Activo' | 'Inactivo') {
      await update(dbRef(db, `users/${uid}`), {
        estado: nuevoEstado,
      });
    },

    async deleteUsuario(uid: string) {
      await remove(dbRef(db, `users/${uid}`));
      await this.fetchUsuarios();
    },
  },
});
