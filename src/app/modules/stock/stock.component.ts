import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {Stock} from '../../model/prestamo/Stock';
import {StockService} from '../../service/prestamo/stock.service';
import {Item} from '../../model/prestamo/Item';
import {ItemService} from '../../service/prestamo/item.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {

  titulo = 'Stocks';
  displayedColumnsItems: string[] = [
    'id',
    'nombre',
    'descripcion',
    'acciones'
  ];

  displayedColumnsStock: string[] = [
    'id',
    'item',
    'cantidadTotal',
    'cantidadDisponible',
    'acciones'
  ];

  displayTable = 1;
  dataSourceItems!: MatTableDataSource<Item>;
  dataSourceStocks!: MatTableDataSource<Stock>;
  items: Item[] = [];
  stocks: Stock[] = [];
  stockSelected: Stock;
  isLoading = false;
  nombreBoton = 'Guardar';

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  constructor(private dialog: MatDialog,
              private stockService: StockService,
              private itemService: ItemService) {
  }

  ngOnInit() {
    this.getStocks();
    this.getItems();
  }

  agregarStock() {
    this.nombreBoton = 'Guardar';
    this.stockSelected = this.getEmptyStock();
    this.displayTable = 2;
  }

  volver() {
    this.displayTable = 1;
    this.getStocks();
  }

  getItems() {
    this.itemService.getItems().subscribe({
      next: (value) => {
        this.items = value.message;
        this.dataSourceItems = new MatTableDataSource(value.message);
        this.dataSourceItems.sort = this.sort;
        this.dataSourceItems.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getStocks() {
    this.stockService.getStock().subscribe({
      next: (value) => {
        this.stocks = value.message;
        this.dataSourceItems = new MatTableDataSource(value.message);
        this.dataSourceItems.sort = this.sort;
        this.dataSourceItems.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceItems.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceItems.paginator) {
      this.dataSourceItems.paginator.firstPage();
    }
  }

  borrar(stock: Stock) {
    Swal.fire({
      title: 'Realmente deseas borrar el stock?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesoBorrar(stock);
      }
    });
  }

  procesoBorrar(stock: Stock) {
    this.stockService.deleteStock(stock.id).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Eliminado!',
          text: 'El stock ha sido eliminado correctamente.',
          icon: 'success'
        });
        this.getStocks(); // Actualizar la lista de libros después de eliminar.
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        });
        this.getStocks();
      }
    })
  }

  editar(stock: Stock) {
    this.nombreBoton = 'Actualizar';
    this.stockSelected = stock;
    this.displayTable = 2;
  }

  guardar() {
    if (this.stockSelected.id) {
      this.stockService.updateStock(this.stockSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Actualizado!',
            text: 'Se actualizo el libro correctamente',
            icon: 'success'
          });
          this.stockSelected = this.getEmptyStock();
          this.getStocks();
          this.displayTable = 1;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
        }
      });
    } else {
      this.stockService.saveStock(this.stockSelected).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardo el libro correctamente',
            icon: 'success'
          });
          this.stockSelected = this.getEmptyStock();
          this.getStocks();
          this.displayTable = 1;
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
        }
      });
    }
  }

  mostrarItemsTable() {
    this.displayTable = 3;
  }

  seleccionarItem(item: any) {
    this.stockSelected.item = item;
    this.displayTable = 2;
  }

  private getEmptyStock(): Stock {
    const item: Item = new Item(null, '');
    return new Stock(null, item, 0, 0, false);
  }
}
