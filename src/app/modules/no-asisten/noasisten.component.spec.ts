import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoasistenComponent } from './asistencias.component';

describe('BancosComponent', () => {
  let component: NoasistenComponent;
  let fixture: ComponentFixture<NoasistenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoasistenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoasistenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
