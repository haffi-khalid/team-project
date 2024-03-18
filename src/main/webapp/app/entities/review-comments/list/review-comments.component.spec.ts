import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReviewCommentsComponent } from './review-comments.component';
import { ReviewCommentsService } from '../service/review-comments.service';
import { of } from 'rxjs';

describe('ReviewCommentsComponent', () => {
  let component: ReviewCommentsComponent;
  let fixture: ComponentFixture<ReviewCommentsComponent>;
  let service: ReviewCommentsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewCommentsComponent],
      imports: [HttpClientTestingModule],
      providers: [ReviewCommentsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCommentsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ReviewCommentsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Corrected test to check if comments are fetched on init
  it('should fetch comments on init', () => {
    const spy = spyOn(service, 'query').and.returnValue(of([{ id: 1, content: 'Test Comment', parentID: null }]));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.comments.length).toBeGreaterThan(0);
  });
});
