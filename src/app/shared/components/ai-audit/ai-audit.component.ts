import { ChangeDetectionStrategy, Component, inject, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-ai-audit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './ai-audit.component.html',
  styleUrl: './ai-audit.component.scss'
})
export class AiAuditComponent {
  private apiService = inject(ApiService);

  bookingForm = input.required<FormGroup>();
  
  back = output<void>();
  bookingSubmit = output<void>();

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

  // AI Audit generation call
  generateInstantAudit() {
    const formVal = this.bookingForm().value;
    if (!formVal.hotelName || !formVal.location) {
      alert("Please ensure Hotel Name and Location are provided in Step 2 before generating your Audit.");
      this.back.emit();
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

    // Replace headings (###, ##, #) while preserving line boundaries
    html = html.replace(/^### (.*)$/gm, '<h4 class="text-lg font-serif font-bold text-luxury-gold mt-6 mb-2">$1</h4>');
    html = html.replace(/^## (.*)$/gm, '<h3 class="text-xl font-serif font-bold text-luxury-charcoal mt-8 mb-3 border-b border-luxury-gold/20 pb-1">$1</h3>');
    html = html.replace(/^# (.*)$/gm, '<h2 class="text-2xl font-serif font-bold text-luxury-charcoal mt-10 mb-4">$1</h2>');

    // Replace bold formatting (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-luxury-charcoal">$1</strong>');

    // Replace bullet points
    html = html.replace(/^\s*-\s*(.*)$/gm, '<li class="ml-4 list-disc text-luxury-charcoal/80 mb-2 font-light">$1</li>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Clean extra breaks around block elements and collapse excessive breaks
    html = html.replace(/(<\/(?:h2|h3|h4|li)>)<br>/g, '$1');
    html = html.replace(/(<br>){3,}/g, '<br><br>');

    return html;
  }

  submitConsultation() {
    this.bookingSubmit.emit();
  }
}
