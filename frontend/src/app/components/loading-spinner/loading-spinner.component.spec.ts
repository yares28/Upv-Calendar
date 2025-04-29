import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default properties', () => {
    expect(component.overlay).toBeTrue();
    expect(component.size).toBe(40);
    expect(component.color).toBe('#758f76');
    expect(component.message).toBe('');
  });

  it('should apply overlay class when overlay is true', () => {
    component.overlay = true;
    fixture.detectChanges();
    
    const container = fixture.debugElement.query(By.css('.spinner-container'));
    expect(container.nativeElement.classList).toContain('overlay');
    expect(container.nativeElement.classList).not.toContain('inline');
  });

  it('should apply inline class when overlay is false', () => {
    component.overlay = false;
    fixture.detectChanges();
    
    const container = fixture.debugElement.query(By.css('.spinner-container'));
    expect(container.nativeElement.classList).toContain('inline');
    expect(container.nativeElement.classList).not.toContain('overlay');
  });

  it('should show message when provided', () => {
    component.message = 'Loading data...';
    fixture.detectChanges();
    
    const messageElement = fixture.debugElement.query(By.css('.spinner-message'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toContain('Loading data...');
  });

  it('should not show message element when no message is provided', () => {
    component.message = '';
    fixture.detectChanges();
    
    const messageElement = fixture.debugElement.query(By.css('.spinner-message'));
    expect(messageElement).toBeNull();
  });

  it('should apply custom size', () => {
    component.size = 60;
    fixture.detectChanges();
    
    const container = fixture.debugElement.query(By.css('.spinner-container'));
    const styles = window.getComputedStyle(container.nativeElement);
    
    // Check if the custom property is being set
    expect(container.nativeElement.style.getPropertyValue('--spinner-size')).toBe('60px');
  });

  it('should apply custom color', () => {
    component.color = '#ff0000';
    fixture.detectChanges();
    
    const container = fixture.debugElement.query(By.css('.spinner-container'));
    
    // Check if the custom property is being set
    expect(container.nativeElement.style.getPropertyValue('--spinner-color')).toBe('#ff0000');
  });
}); 