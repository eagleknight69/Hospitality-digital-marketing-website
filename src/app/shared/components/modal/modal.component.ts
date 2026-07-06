import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BookingService, BookingTab } from '../../../core/services/booking.service';
import { ApiService, ConsultPayload } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-booking-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
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

  // AI Audit States
  aiAuditResult = signal<string>('');
  isGeneratingAudit = signal(false);
  auditStepIndex = signal(0);
  auditSteps = [
    'Analyzing property position & competitors...',
    'Reviewing visual storytelling opportunities...',
    'Generating performance-marketing ad hooks...',
    'Designing UX/UI direct conversion outline...',
    'Finalizing bespoke luxury digital blueprint...'
  ];

  currentAuditStepText = computed(() => {
    return this.auditSteps[this.auditStepIndex()];
  });

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

  // AI Audit generation call
  generateInstantAudit() {
    const formVal = this.bookingForm.value;
    if (!formVal.hotelName || !formVal.location) {
      alert("Please ensure Hotel Name and Location are provided in Step 2 before generating your Audit.");
      this.setTab('brand');
      return;
    }

    this.isGeneratingAudit.set(true);
    this.aiAuditResult.set('');
    this.auditStepIndex.set(0);

    // Simulate animated loading steps
    const stepInterval = setInterval(() => {
      this.auditStepIndex.update(idx => {
        if (idx < this.auditSteps.length - 1) {
          return idx + 1;
        } else {
          clearInterval(stepInterval);
          return idx;
        }
      });
    }, 1500);

    const payload = {
      hotelName: formVal.hotelName!,
      hotelType: formVal.hotelType!,
      location: formVal.location!,
      challenge: formVal.challenge!,
      targetAudience: formVal.targetAudience!
    };

    this.apiService.generateAudit(payload)
      .subscribe({
        next: (res) => {
          clearInterval(stepInterval);
          this.isGeneratingAudit.set(false);
          this.aiAuditResult.set(this.formatMarkdown(res.report));
        },
        error: (err) => {
          clearInterval(stepInterval);
          this.isGeneratingAudit.set(false);
          this.aiAuditResult.set(`### Growth Audit Outline

Unfortunately, the server was unable to stream the full AI report in real-time. Here is a curated outline based on your inputs:

1. **Brand Identity Shift**: Highlight the ${payload.hotelType} experience of ${payload.hotelName} located in ${payload.location}. Focus on editorial storytelling to capture travelers.
2. **Web Booking Optimization**: Simplify key landing pages and optimize site load times under 1s to capture elite audiences.
3. **Primary Challenge Drive**: To overcome **${payload.challenge}**, we recommend a structured 3-tiered Instagram & Google Search paid ad funnel focused on high-spending demographics, bypassing traditional OTAs.
`);
          console.error("Audit Generation Error:", err);
        }
      });
  }

  // Minimal Markdown to HTML Helper
  formatMarkdown(md: string): string {
    if (!md) return '';
    let html = md;
    
    // Replace headings (###, ##, #)
    html = html.replace(/### (.*?)(\n|$)/g, '<h4 class="text-lg font-serif font-bold text-luxury-gold mt-6 mb-2">$1</h4>');
    html = html.replace(/## (.*?)(\n|$)/g, '<h3 class="text-xl font-serif font-bold text-luxury-charcoal mt-8 mb-3 border-b border-luxury-gold/20 pb-1">$1</h3>');
    html = html.replace(/# (.*?)(\n|$)/g, '<h2 class="text-2xl font-serif font-bold text-luxury-charcoal mt-10 mb-4">$1</h2>');
    
    // Replace bold formatting (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-luxury-charcoal">$1</strong>');
    
    // Replace bullet points
    html = html.replace(/^\s*-\s*(.*?)(\n|$)/gm, '<li class="ml-4 list-disc text-luxury-charcoal/80 mb-2 font-light">$1</li>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Clean double line breaks
    html = html.replace(/(<br>){3,}/g, '<br><br>');

    return html;
  }
}
