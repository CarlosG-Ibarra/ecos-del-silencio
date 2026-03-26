import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Juego1 } from './juego1';

describe('Juego1', () => {
  let component: Juego1;
  let fixture: ComponentFixture<Juego1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Juego1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Juego1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
