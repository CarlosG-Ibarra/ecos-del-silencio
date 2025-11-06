import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Juego2 } from './juego2';

describe('Juego2', () => {
  let component: Juego2;
  let fixture: ComponentFixture<Juego2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Juego2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Juego2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
