import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeatPage } from './seat.page';

describe('SeatPage', () => {
  let component: SeatPage;
  let fixture: ComponentFixture<SeatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
