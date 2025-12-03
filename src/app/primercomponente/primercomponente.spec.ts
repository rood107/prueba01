import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Primercomponente } from './primercomponente';

describe('Primercomponente', () => {
  let component: Primercomponente;
  let fixture: ComponentFixture<Primercomponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Primercomponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Primercomponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
