import {Component, OnInit, ViewChild} from '@angular/core';
import {Inventario} from '../../model/Inventario';
import {InventarioService} from '../../service/cantina/inventario.service';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {switchMap} from 'rxjs';
import {LibroService} from '../../service/biblioteca/libro.service';
import {UsuarioCantinaService} from '../../service/cantina/usuario-cantina.service';
import {UsuarioCantina} from '../../model/UsuarioCantina';
import {Transaccion} from '../../model/Transaccion';
import {TransaccionService} from '../../service/cantina/transaccion.service';

@Component({
  selector: 'app-libro',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  titulo = 'Ventas';
  productos: Inventario[];
  displayedColumns: string[] = [
    'imagen',
    'nombre',
    'cantidad',
    'precio',
    'acciones'
  ];
  dataSource!: MatTableDataSource<Inventario>;
  carrito: Inventario[] = [];
  public readonly TEXT_LENGTH: number = 20;
  displayProductos = 'PRODUCTOS';
  isLoading = false;

  constructor(private inventarioService: InventarioService,
              private router: Router,
              private spinnerService: NgxSpinnerService,
              private libroService: LibroService,
              private usuarioCantinaService: UsuarioCantinaService,
              private transaccionService: TransaccionService) {
  }


  ngOnInit() {
    this.getInventarios();
  }

  addToCart(producto) {
    // Buscar si el producto ya existe en el carrito
    const itemExistente = this.carrito.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      // Si el producto ya está en el carrito, incrementa la cantidad
      itemExistente.cantidad += 1;
      Swal.fire({
        title: 'Cantidad Actualizada!',
        text: 'Se incrementó la cantidad del producto: ' + itemExistente.producto.nombre,
        icon: 'success'
      });
    } else {
      // Si no está, agregar el producto con cantidad = 1
      producto.cantidad = 1;
      this.carrito.push(producto);
      Swal.fire({
        title: 'Ir al carrito?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `Seguir Comprando`
      }).then((result) => {
        if (result.isConfirmed) {
          this.irCarrito();
        }
      });
    }
    console.log(this.carrito); // Para verificar el estado del carrito
  }


  getInventarios() {
    this.inventarioService.getInventarios().subscribe({
      next: (value) => {
        this.productos = value.message;
      },
      error: console.log,
    });
  }

  goToProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  removeFromCart(product) {
    this.carrito = this.carrito.filter(item => item.producto.id !== product.producto.id);
    this.irCarrito();
  }

  calculateTotal() {
    return this.carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }

  goToCheckout() {
    // Navega a la página de resumen de la compra
    this.displayProductos = 'RESUMEN';
  }

  volver() {
    this.displayProductos = 'PRODUCTOS';
  }

  irCarrito() {
    this.dataSource = new MatTableDataSource(this.carrito);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.displayProductos = 'CARRITO';
  }

  procesarCompra() {
    this.isLoading = true;
    this.spinnerService.show();

    this.libroService.getRFID().pipe(
      switchMap((response: any) => {
        const rfid = response.message;
        return this.usuarioCantinaService.getUsuarioByUid(rfid);
      })
    ).subscribe({
      next: (responseRfid: any) => {
        const usuarioCantina: UsuarioCantina = responseRfid.message;
        if (usuarioCantina) {
          this.isLoading = false;
          this.spinnerService.hide();
          const transaccion: Transaccion = new Transaccion(null, usuarioCantina, this.carrito, null, new Date(), null);
          // Guardar todos los préstamos uno por uno
          this.transaccionService.saveTransaccion(transaccion).subscribe({
            next: (responseTransaccion) => {
              if (responseTransaccion.error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: responseTransaccion.error,
                });
              } else {
                // Finalización exitosa
                this.carrito = [];
                this.displayProductos = 'PRODUCTOS';
                Swal.fire({
                  title: 'Guardado!',
                  text: 'Compra exitosa',
                  icon: 'success'
                });
              }
            },
            error: console.log
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No existe Usuario',
          });
          this.isLoading = false;
          this.spinnerService.hide();
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
        this.isLoading = false;
        this.spinnerService.hide();
      }
    });
  }

  increaseQuantity(row: any) {
    row.cantidad += 1;
    this.updateTable();
  }

  // Disminuir la cantidad de un producto
  decreaseQuantity(row: any) {
    if (row.cantidad > 1) {
      row.cantidad -= 1;
    } else {
      this.removeFromCart(row);
    }
    this.updateTable();
  }

  updateTable() {
    this.dataSource.data = [...this.dataSource.data];
  }

}
