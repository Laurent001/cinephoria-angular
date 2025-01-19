import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentPage } from './incident.page';

describe('IncidentPage', () => {
  let component: IncidentPage;
  let fixture: ComponentFixture<IncidentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
