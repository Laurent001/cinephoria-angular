import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntranetPage } from './intranet.page';

describe('IntranetPage', () => {
  let component: IntranetPage;
  let fixture: ComponentFixture<IntranetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IntranetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
