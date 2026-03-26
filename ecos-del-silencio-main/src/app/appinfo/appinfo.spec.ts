import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Appinfo } from './appinfo';

describe('Appinfo', () => {
  let component: Appinfo;
  let fixture: ComponentFixture<Appinfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Appinfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Appinfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
