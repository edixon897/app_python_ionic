import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalProoPage } from './modal-proo.page';

describe('ModalProoPage', () => {
  let component: ModalProoPage;
  let fixture: ComponentFixture<ModalProoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalProoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
