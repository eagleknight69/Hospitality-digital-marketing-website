import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConsultPayload {
  name: string;
  email: string;
  hotelName: string;
  hotelType: string;
  location: string;
  challenge: string;
  targetAudience: string;
  date: string;
  time: string;
  notes?: string;
}

export interface ConsultResponse {
  success: boolean;
  details: {
    meetingId?: string;
  };
}

export interface AuditPayload {
  hotelName: string;
  hotelType: string;
  location: string;
  challenge: string;
  targetAudience: string;
}

export interface AuditResponse {
  report: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  submitConsultation(payload: ConsultPayload): Observable<ConsultResponse> {
    return this.http.post<ConsultResponse>('/api/consult', payload);
  }

  generateAudit(payload: AuditPayload): Observable<AuditResponse> {
    return this.http.post<AuditResponse>('/api/audit', payload);
  }
}
