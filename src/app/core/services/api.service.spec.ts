import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiService, AuditPayload, ConsultPayload } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should POST consultation booking payload to /api/consult', () => {
    const payload: ConsultPayload = {
      name: 'Elena Rostova',
      email: 'elena@grandpalace.example',
      hotelName: 'Grand Palace Resort',
      hotelType: 'Ultra-Luxury Resort',
      location: 'Lake Como, Italy',
      challenge: 'Increasing Direct Bookings',
      targetAudience: 'High-Net-Worth Couples',
      date: '2026-07-06',
      time: '14:00',
      notes: 'Launching new lakeside suites',
    };

    let responseMeetingId: string | undefined;
    service.submitConsultation(payload).subscribe((res) => {
      expect(res.success).toBe(true);
      responseMeetingId = res.details.meetingId;
    });

    const req = httpTesting.expectOne('/api/consult');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ success: true, details: { meetingId: 'CC-TEST1234' } });

    expect(responseMeetingId).toBe('CC-TEST1234');
  });

  it('should POST growth audit payload to /api/audit', () => {
    const payload: AuditPayload = {
      hotelName: 'Caldera Retreat',
      hotelType: 'Boutique Hotel',
      location: 'Santorini, Greece',
      challenge: 'OTA Commission Leakage',
      targetAudience: 'High-Net-Worth Couples',
    };

    let report = '';
    service.generateAudit(payload).subscribe((res) => {
      report = res.report;
    });

    const req = httpTesting.expectOne('/api/audit');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ report: '### Luxury Digital Audit: Caldera Retreat' });

    expect(report).toContain('Caldera Retreat');
  });
});
