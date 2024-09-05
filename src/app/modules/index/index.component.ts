import {Component, OnInit, ViewChild} from '@angular/core';
import {AsistenciaService} from '../../service/asistencia.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Asistencia} from '../../model/Asistencia';
import {Curso} from '../../model/Curso';
import {CursoService} from '../../service/curso.service';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {


  constructor() {
  }

  ngOnInit() {}

}
