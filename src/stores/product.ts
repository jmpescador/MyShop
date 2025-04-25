// src/stores/product.ts
import { defineStore } from 'pinia';
import { db } from 'src/boot/firebase';
import {
  ref as dbRef,
  push,
  get,
  update,
  remove,
} from 'firebase/database';

export interface Producto {
  uid: string;
  nombre: string;
  foto: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  estado: 'Disponible' | 'Agotado';
}

export const useProductStore = defineStore('product', {
  state: () => ({
    productos: [] as Producto[],
    selectedProduct: null as Producto | null,
  }),

  actions: {
    // Registrar nuevo producto
    async registerProducto(producto: Omit<Producto, 'uid'>) {
      const newRef = await push(dbRef(db, 'productos'), producto);
      await this.fetchProductos();
      return newRef.key;
    },

    // Obtener todos los productos
    async fetchProductos() {
      const snapshot = await get(dbRef(db, 'productos'));
      const data = snapshot.val();
      this.productos = data
        ? Object.keys(data).map((uid) => ({
            uid,
            ...data[uid],
          }))
        : [];
    },

    // Obtener un solo producto por UID
    async fetchProducto(uid: string) {
      const snapshot = await get(dbRef(db, `productos/${uid}`));
      const data = snapshot.val();
      this.selectedProduct = data ? { uid, ...data } : null;
    },

    // Editar producto
    async updateProducto(producto: Producto) {
      await update(dbRef(db, `productos/${producto.uid}`), {
        nombre: producto.nombre,
        foto: producto.foto,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria: producto.categoria,
        estado: producto.estado,
      });
      await this.fetchProductos();
    },

    // Eliminar producto
    async deleteProducto(uid: string) {
      await remove(dbRef(db, `productos/${uid}`));
      await this.fetchProductos();
    },
  },
});
