import { defineStore } from 'pinia';
import type { Producto } from './product'; // Importamos la interfaz base


export interface ProductoEnCarrito extends Producto {
  cantidad: number;
}

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    productos: [] as ProductoEnCarrito[],
  }),

  actions: {
    addProduct(producto: Producto) {
      const existe = this.productos.find(p => p.uid === producto.uid);
      if (!existe) {
        this.productos.push({ ...producto, cantidad: 1 });
      } else {
        existe.cantidad += 1;
      }
    },

    deleteProduct(uid: string) {
      this.productos = this.productos.filter(p => p.uid !== uid);
    },

    vaciarCarrito() {
      this.productos = [];
    },
  },
});
