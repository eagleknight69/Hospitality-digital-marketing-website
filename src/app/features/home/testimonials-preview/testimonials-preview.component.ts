import { ChangeDetectionStrategy, Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  hotel: string;
  image: string;
  stars: number;
}

@Component({
  selector: 'app-testimonials-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './testimonials-preview.component.html',
  styleUrl: './testimonials-preview.component.scss'
})
export class TestimonialsPreviewComponent implements OnInit, OnDestroy {
  activeTestimonial = signal<number>(0);
  private intervalId?: ReturnType<typeof setInterval>;
  
  testimonials: Testimonial[] = [
    {
      quote: "Working with Camera Cloud completely transformed our direct-booking profile. We saw a 42% decrease in booking commissions to OTAs in the first 90 days. The cinematography they produced captures the soul of our property like no other agency could.",
      author: "Laurent Delacroix",
      role: "General Manager",
      hotel: "Château de Maraval, Dordogne Valley",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      stars: 5
    },
    {
      quote: "The bespoke digital booking interface designed by Camera Cloud elevated our website into a digital extension of our 5-star physical experience. Direct reservation values increased by 35% on average because guests are visually captivated.",
      author: "Alessia Moretti",
      role: "Marketing Director",
      hotel: "Belvedere Cliff Resort, Amalfi Coast",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      stars: 5
    },
    {
      quote: "Their dual-strength model is brilliant. They do not just write copy and run ads; they produce the actual high-end photography and video that elite guests respond to. Camera Cloud is the ultimate direct booking driver in the luxury market.",
      author: "Marcus Van Den Berg",
      role: "Managing Partner",
      hotel: "Serengeti Ridge Luxury Tents, Tanzania",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      stars: 5
    }
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.intervalId = setInterval(() => {
      this.nextTestimonial();
    }, 6000);
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextTestimonial() {
    this.activeTestimonial.update(current => (current + 1) % this.testimonials.length);
  }

  prevTestimonial() {
    this.activeTestimonial.update(current => (current - 1 + this.testimonials.length) % this.testimonials.length);
  }
}
