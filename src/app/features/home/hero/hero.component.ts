import { ChangeDetectionStrategy, Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';

export interface HeroSlide {
  image: string;
  title: string;
  hotel: string;
}

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  private bookingService = inject(BookingService);

  activeSlide = signal<number>(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  slides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80',
      title: 'Grand Heritage Estates',
      hotel: 'The Château Reid, Dordogne'
    },
    {
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80',
      title: 'Seaside Infinity Vistas',
      hotel: 'Viceroy Caldera, Santorini'
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
      title: 'Private Cliff Sanctuaries',
      hotel: 'Belvedere Cliffs, Amalfi Coast'
    },
    {
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80',
      title: 'Bespoke Luxury Interiors',
      hotel: 'Amara Sanctuary, Utah Desert'
    }
  ];

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.stopCarousel();
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000); // Slowly transitions every 6 seconds to create a calm, luxurious experience
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide() {
    this.activeSlide.update(curr => (curr + 1) % this.slides.length);
  }

  prevSlide() {
    this.activeSlide.update(curr => (curr - 1 + this.slides.length) % this.slides.length);
    this.startCarousel(); // Reset timer after manual interaction
  }

  setSlide(idx: number) {
    this.activeSlide.set(idx);
    this.startCarousel(); // Reset timer after manual interaction
  }

  openBooking(tab: 'schedule' | 'brand' | 'audit' = 'schedule') {
    this.bookingService.openBooking(tab);
  }
}
