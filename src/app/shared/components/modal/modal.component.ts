import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BookingService, BookingTab } from '../../../core/services/booking.service';
import { ApiService, ConsultPayload } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { AiAuditComponent } from '../ai-audit/ai-audit.component';

@Component({
  selector: 'app-booking-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, AiAuditComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class BookingModalComponent {
  public bookingService = inject(BookingService);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);

  isOpen = this.bookingService.isBookingModalOpen;
  activeTab = this.bookingService.activeModalTab;

  // Booking Form Control
  bookingForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    hotelName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    hotelType: new FormControl('Boutique Hotel', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    challenge: new FormControl('Increasing Direct Bookings', [Validators.required]),
    targetAudience: new FormControl('High-Net-Worth Couples', [Validators.required]),
    date: new FormControl('2026-07-06', [Validators.required]),
    time: new FormControl('14:00', [Validators.required]),
    notes: new FormControl('')
  });

  // Available Booking Dates & Times
  availableDates = [
    { label: 'Mon, Jul 6', value: '2026-07-06' },
    { label: 'Tue, Jul 7', value: '2026-07-07' },
    { label: 'Wed, Jul 8', value: '2026-07-08' },
    { label: 'Thu, Jul 9', value: '2026-07-09' },
    { label: 'Fri, Jul 10', value: '2026-07-10' }
  ];

  availableTimes = [
    '09:00', '10:30', '13:00', '14:00', '15:30', '17:00'
  ];

  closeModal() {
    this.bookingService.closeBooking();
  }

  setTab(tab: BookingTab) {
    this.bookingService.activeModalTab.set(tab);
  }

  selectDate(dateValue: string) {
    this.bookingForm.patchValue({ date: dateValue });
  }

  selectTime(timeValue: string) {
    this.bookingForm.patchValue({ time: timeValue });
  }

  // Form submission (Book Call)
  submitConsultation() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const payload = this.bookingForm.value as ConsultPayload;
    this.apiService.submitConsultation(payload)
      .subscribe({
        next: (response) => {
          this.closeModal();
          this.toastService.show(
            `Successfully scheduled direct consultation for ${payload.hotelName}! Check your email for coordinates.`,
            response.details?.meetingId || 'CC-CONFIRMED'
          );
        },
        error: (err) => {
          console.error("Booking error:", err);
          alert("Failed to secure a slot. Please check your internet connection.");
        }
      });
  }
}
