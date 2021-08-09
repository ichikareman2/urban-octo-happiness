import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTaskViewComponent } from './daily-task-view.component';

describe('DailyTaskViewComponent', () => {
  let component: DailyTaskViewComponent;
  let fixture: ComponentFixture<DailyTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyTaskViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
