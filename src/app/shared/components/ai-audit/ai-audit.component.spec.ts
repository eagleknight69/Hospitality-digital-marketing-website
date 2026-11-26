import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AiAuditComponent } from './ai-audit.component';

describe('AiAuditComponent', () => {
  let apiServiceMock: { generateAudit: ReturnType<typeof vi.fn> };

  function buildBookingForm(overrides?: Partial<Record<string, string>>): FormGroup {
    return new FormGroup({
      hotelName: new FormControl(overrides?.['hotelName'] ?? 'Amara Sanctuary'),
      hotelType: new FormControl(overrides?.['hotelType'] ?? 'Boutique Hotel'),
      location: new FormControl(overrides?.['location'] ?? 'Udaipur, India'),
      challenge: new FormControl(overrides?.['challenge'] ?? 'Increasing Direct Bookings'),
      targetAudience: new FormControl(overrides?.['targetAudience'] ?? 'High-Net-Worth Couples'),
    });
  }

  beforeEach(async () => {
    apiServiceMock = {
      generateAudit: vi.fn().mockReturnValue(
        of({ report: '### Growth Blueprint\n- **Visuals**: Capture golden hour vistas.' }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [AiAuditComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ApiService, useValue: apiServiceMock },
      ],
    }).compileComponents();
  });

  it('should format markdown headings, bold text, and bullet points into HTML', () => {
    const fixture = TestBed.createComponent(AiAuditComponent);
    fixture.componentRef.setInput('bookingForm', buildBookingForm());
    const component = fixture.componentInstance;

    const html = component.formatMarkdown('### Chapter 1\n- **Drone Shots**: Aerial reveals');
    expect(html).toContain('<h4');
    expect(html).toContain('Chapter 1');
    expect(html).toContain('<strong');
    expect(html).toContain('Drone Shots');
    expect(html).toContain('<li');
    expect(component.formatMarkdown('')).toBe('');
  });

  it('should request an audit report and store formatted output', () => {
    const fixture = TestBed.createComponent(AiAuditComponent);
    fixture.componentRef.setInput('bookingForm', buildBookingForm());
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.generateInstantAudit();

    expect(apiServiceMock.generateAudit).toHaveBeenCalledWith({
      hotelName: 'Amara Sanctuary',
      hotelType: 'Boutique Hotel',
      location: 'Udaipur, India',
      challenge: 'Increasing Direct Bookings',
      targetAudience: 'High-Net-Worth Couples',
    });
    expect(component.isGeneratingAudit()).toBe(false);
    expect(component.aiAuditResult()).toContain('Growth Blueprint');
  });

  it('should emit back event when hotel name or location is missing', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(AiAuditComponent);
    fixture.componentRef.setInput('bookingForm', buildBookingForm({ hotelName: '', location: '' }));
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const backSpy = vi.fn();
    component.back.subscribe(backSpy);

    component.generateInstantAudit();

    expect(alertSpy).toHaveBeenCalledOnce();
    expect(backSpy).toHaveBeenCalledOnce();
    expect(apiServiceMock.generateAudit).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
