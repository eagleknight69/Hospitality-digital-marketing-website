import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  private bookingService = inject(BookingService);

  services = [
    {
      title: 'Photography & Videography',
      icon: 'photo_camera',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      desc: 'High-end visual storytelling, drone captures, luxury property shoots, cinematic reels, and promotional teasers tailored to elite hotels.'
    },
    {
      title: 'Social Media Management',
      icon: 'share',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
      desc: 'Esthetic grid curation, high-engagement content scheduling, daily social management, and premium influencer integrations.'
    },
    {
      title: 'Performance Marketing',
      icon: 'trending_up',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      desc: 'Hyper-targeted paid advertising funnels across Google and Meta, engineered to reduce OTA dependence and drive direct room booking ROI.'
    },
    {
      title: 'Website Development',
      icon: 'language',
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
      desc: 'Custom, ultra-rapidly loading websites integrated with clean booking engines to turn casual browsers into direct hotel guests.'
    },
    {
      title: 'Branding & Creative Services',
      icon: 'auto_awesome',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
      desc: 'Bespoke corporate logos, visual brand identity architecture, custom restaurant menus, banners, and offline marketing collateral.'
    },
    {
      title: '360 VR Tour',
      icon: 'view_in_ar',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      desc: 'Immersive, ultra-high-definition interactive virtual walkthroughs that allow prospective guests and event hosts to explore your suites and banquets.'
    }
  ];

  onServiceClick() {
    this.bookingService.openBooking('brand');
  }

  openBooking(tab: 'schedule' | 'brand' | 'audit' = 'brand') {
    this.bookingService.openBooking(tab);
  }
}
