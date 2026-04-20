import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Juego3 } from './juego3';

describe('Juego3', () => {
  let component: Juego3;
  let fixture: ComponentFixture<Juego3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Juego3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Juego3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
