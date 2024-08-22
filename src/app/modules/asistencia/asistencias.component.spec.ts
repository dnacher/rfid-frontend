import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasComponent } from './asistencias.component';

describe('BancosComponent', () => {
  let component: AsistenciasComponent;
  let fixture: ComponentFixture<AsistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
