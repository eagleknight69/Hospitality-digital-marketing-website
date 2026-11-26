import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../core/services/booking.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  year: number;
  category: 'Resorts & Lodges' | 'Heritage & Palace' | 'Villas & Suites' | 'Fine Dining & Cafes';
  image: string;
  description: string;
  services: string[];
  metrics?: { value: string; label: string };
  scenicPhotoCredit?: string;
}

@Component({
  selector: 'app-portfolio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit, AfterViewInit, OnDestroy {
  private bookingService = inject(BookingService);
  private scroller = inject(ViewportScroller);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('cinemaContainer') cinemaContainer!: ElementRef;

  // Visibility flag for scroll-to-play auto triggers
  isCinemaVisible = signal(false);
  isVideoPlaying = signal(true);
  private intersectionObserver?: IntersectionObserver;

  // Dynamic counting matrix stats (will be animated in ngOnInit)
  hotelsCount = signal(0);
  websitesCount = signal(0);
  experienceCount = signal(0);
  countriesCount = signal(0);
  private animFrameId?: number;

  // Immersive video carousel data using high-fidelity copyright-free 4K YouTube assets
  videoCarousel = [
    {
      title: 'Coral Atoll Private Island',
      location: 'PALAWAN ARCHIPELAGO, PHILIPPINES',
      id: 'xeXV1KoX034',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      description: 'Ultra-luxury secluded resort drone loop capturing pristine turquoise shorelines, powdery white sand, and elite villas.'
    },
    {
      title: 'Emerald Lagoon Sanctuary',
      location: 'NORTH MALÉ ATOLL, MALDIVES',
      id: 'W4YfDg-dKzk',
      coverImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
      description: 'Spectacular overwater luxury island sweeps showing iconic coral lagoons, elegant palm fringes, and endless ocean horizons.'
    },
    {
      title: 'Cliffside Canopy Reserve',
      location: 'SUMBA ISLAND, INDONESIA',
      id: 'H1CIBqDeWQ0',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      description: 'Wild cliffside panoramas and eco-luxe canopy villas reflecting untouched raw nature balanced with elite hospitality.'
    },
    {
      title: 'Azure Overwater Atoll',
      location: 'NOONU ATOLL, MALDIVES',
      id: '278IRQ6HSi4',
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      description: 'Stunning high-definition tracking of overwater water-slide villas, reticulated coral reefs, and tranquil beachheads.'
    }
  ];

  activeVideoIndex = signal(0);

  // Stories in Motion Vertical Instagram Reels List using fast and smooth Pexels/Mixkit vertical video assets with sound
  reels = signal([
    {
      id: 'reel-1',
      brand: 'MARIGOLD',
      title: 'POV: Private coastal sands & ocean waves',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-vertical-40019-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      duration: '0:15',
      isPlaying: false,
      isMuted: true
    },
    {
      id: 'reel-2',
      brand: 'THE DUNES',
      title: 'Cinematic morning rays & soothing forest creeks',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-vertical-40018-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      duration: '0:20',
      isPlaying: false,
      isMuted: true
    },
    {
      id: 'reel-3',
      brand: 'MAYFAIR',
      title: 'The gentle sound of pristine waterfall flows',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-vertical-40010-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80',
      duration: '0:30',
      isPlaying: false,
      isMuted: true
    },
    {
      id: 'reel-4',
      brand: 'AZURE ISLAND',
      title: 'Peaceful fresh rain droplets against elite suites',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-drops-on-window-vertical-40011-large.mp4',
      coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
      duration: '0:25',
      isPlaying: false,
      isMuted: true
    }
  ]);

  reelsScrollProgress = signal(25);

  // Stats for the hero section
  stats = [
    { value: '1900+', label: 'Hotels Served' },
    { value: '500+', label: 'Websites Built' },
    { value: '16+', label: 'Years Experience' },
    { value: '50+', label: 'Countries' }
  ];

  // Selected Category filter signal
  selectedCategory = signal<string>('All');

  // Active Lightbox Project signal (null when closed)
  activeLightboxIndex = signal<number | null>(null);

  // List of Categories
  categories = [
    'All',
    'Resorts & Lodges',
    'Heritage & Palace',
    'Villas & Suites',
    'Fine Dining & Cafes'
  ];

  // Categorised Capabilities ("What We Create" section)
  capabilities = [
    {
      icon: 'photo_camera',
      title: 'Cinematic Storytelling',
      desc: 'High-production photography and immersive drone visuals that capture the soul and architecture of your hospitality property, optimized to command premium rates.',
      image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: 'important_devices',
      title: 'Bespoke Digital Platforms',
      desc: 'Custom-engineered website experiences with streamlined user journeys, lightning-fast loads, and sensory branding that bypass high OTA commissions.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: 'campaign',
      title: 'Performance Marketing',
      desc: 'Targeted high-net-worth customer acquisition campaigns featuring bespoke content, high-converting copy, and full-funnel booking rate optimization.',
      image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: 'auto_awesome',
      title: 'Full-Scale Brand Overhaul',
      desc: 'A complete sensory reconstruction of your brand style, logo, voice, and visual assets, preparing your hotel to enter the elite luxury sector.',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Portfolio items of stunning, high-res scenic hotel photography
  projects = signal<PortfolioProject[]>([
    {
      id: 'p-jaisalmer',
      title: 'Golden Sandstone Heritage Palace',
      location: 'JAISALMER, INDIA',
      year: 2024,
      category: 'Heritage & Palace',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
      description: 'A complete brand transformation and premium website campaign capturing the golden sandstone architecture and royal desert heritage of Jaisalmer.',
      services: ['Brand Photography', 'Drone videography', 'Custom Website Design', 'SEO Campaign'],
      metrics: { value: '+62%', label: 'Direct Booking Growth' }
    },
    {
      id: 'p-santorini',
      title: 'Dawn Over Caldera Suites',
      location: 'SANTORINI, GREECE',
      year: 2024,
      category: 'Villas & Suites',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85',
      description: 'Capturing the white-washed luxury cave suites overlooking the Santorini caldera, featuring specialized sunrise lighting sessions.',
      services: ['Interior Photography', 'Sunset Videography', 'Sensory Branding'],
      metrics: { value: '42%', label: 'Increase in Premium Suite Bookings' }
    },
    {
      id: 'p-nepal',
      title: 'The Everest Retreat',
      location: 'HIMALAYAS, NEPAL',
      year: 2023,
      category: 'Resorts & Lodges',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85',
      description: 'A visual documentation of high-altitude alpine hospitality, translating the raw grandeur of Everest into a luxury mountain lodge brand.',
      services: ['Extreme Climate Photography', '8K Reel Promo', 'Social Campaigns'],
      metrics: { value: '2.4M+', label: 'Organic Views on Launch' }
    },
    {
      id: 'p-guwahati',
      title: 'Guwahati Forest Canopy Sanctuary',
      location: 'GUWAHATI, ASSAM',
      year: 2024,
      category: 'Resorts & Lodges',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1600&q=85',
      description: 'An eco-luxury private canopy villa layout positioned deep in the natural forests of Assam, bringing raw biodiversity into high-end focus.',
      services: ['Night Pool Photography', 'Cinematic Walkthrough', 'Booking Funnel Design'],
      metrics: { value: '14.8x', label: 'First Quarter ROAS' }
    },
    {
      id: 'p-maldives',
      title: 'Azure Lagoon Overwater Oasis',
      location: 'MALE, MALDIVES',
      year: 2023,
      category: 'Villas & Suites',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=85',
      description: 'Scenic turquoise lagoon drone mapping and overwater villa lifestyle capture that highlights endless oceanic horizons.',
      services: ['Overwater Drone Sessions', 'Lifestyle Casting', 'Interactive Hotel Web Tour'],
      metrics: { value: '-30%', label: 'OTA Commission Savings' }
    },
    {
      id: 'p-kyoto',
      title: 'Kyoto Imperial Sukiya Ryokan',
      location: 'KYOTO, JAPAN',
      year: 2024,
      category: 'Heritage & Palace',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
      description: 'A deep sensory celebration of traditional Japanese minimal design, paper screen geometry, and tranquil moss gardens.',
      services: ['Fine Art Photography', 'Bespoke Brand Identity', 'Print Quality Assets'],
      metrics: { value: '98%', label: 'Suites Occupancy Rate' }
    },
    {
      id: 'p-dubai',
      title: 'Al-Rimal Heritage Oasis',
      location: 'DUBAI DESERT, UAE',
      year: 2024,
      category: 'Resorts & Lodges',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=85',
      description: 'Luxury dune-dwelling Bedouin suites showcasing remote wilderness, firelit private plunge pools, and private falconry experiences.',
      services: ['Wildlife Photography', 'Direct Booking Landing Page', 'Social Ads Branding'],
      metrics: { value: '110%', label: 'Lead Volume Increase' }
    },
    {
      id: 'p-tuscany',
      title: 'Val d\'Orcia Fine Dining Pavilion',
      location: 'TUSCANY, ITALY',
      year: 2023,
      category: 'Fine Dining & Cafes',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
      description: 'Culinary cataloging of Michelin-starred vineyard gastronomy, rustic renaissance pavilions, and sun-drenched al fresco dining tables.',
      services: ['Macro Food Styling', 'Wine Cellar Lighting', 'Exclusive Member Booklet'],
      metrics: { value: '+48%', label: 'Table Booking Speedup' }
    },
    {
      id: 'p-paris',
      title: 'Le Café de L\'Opéra Heritage',
      location: 'PARIS, FRANCE',
      year: 2024,
      category: 'Fine Dining & Cafes',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=85',
      description: 'Capturing the golden-lit baroque ceiling work, fresh French patisserie displays, and intimate bistro styling of iconic Parisian hotel cafés.',
      services: ['Low-Light Interior Photography', 'Bespoke Instagram Feed Design', 'Direct Booking Integration'],
      metrics: { value: '+75%', label: 'Walk-in Direct Revenue' }
    }
  ]);

  // Computed signal to filter projects dynamically
  filteredProjects = computed(() => {
    const category = this.selectedCategory();
    if (category === 'All') {
      return this.projects();
    }
    return this.projects().filter(p => p.category === category);
  });

  // Current project loaded into the lightbox based on index
  currentLightboxProject = computed(() => {
    const idx = this.activeLightboxIndex();
    if (idx === null) return null;
    return this.filteredProjects()[idx] || null;
  });

  // Filter projects by category selection
  setCategory(category: string) {
    this.selectedCategory.set(category);
    this.activeLightboxIndex.set(null); // Close lightbox if open
  }

  // Open the lightbox for a project item in the filtered list
  openLightbox(idx: number) {
    this.activeLightboxIndex.set(idx);
    // Temporarily lock scroll
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  // Close the lightbox
  closeLightbox() {
    this.activeLightboxIndex.set(null);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  // Go to previous image in lightbox
  prevLightbox(event?: Event) {
    if (event) event.stopPropagation();
    const idx = this.activeLightboxIndex();
    if (idx === null) return;
    const len = this.filteredProjects().length;
    this.activeLightboxIndex.set((idx - 1 + len) % len);
  }

  // Go to next image in lightbox
  nextLightbox(event?: Event) {
    if (event) event.stopPropagation();
    const idx = this.activeLightboxIndex();
    if (idx === null) return;
    const len = this.filteredProjects().length;
    this.activeLightboxIndex.set((idx + 1) % len);
  }

  // Open booking modal with customized initial tab or inquiry details
  openInquiry() {
    this.closeLightbox();
    this.bookingService.openBooking('schedule');
  }

  // Open generic booking
  openBooking(tab: 'schedule' | 'brand' | 'audit' = 'schedule') {
    this.bookingService.openBooking(tab);
  }

  setVideo(idx: number) {
    this.activeVideoIndex.set(idx);
    this.isVideoPlaying.set(true);
  }

  ngOnInit() {
    // Elegant frame-based matrix count-up animation
    const duration = 1800; // 1.8 seconds duration
    const start = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      this.hotelsCount.set(Math.floor(ease * 1900));
      this.websitesCount.set(Math.floor(ease * 500));
      this.experienceCount.set(Math.floor(ease * 16));
      this.countriesCount.set(Math.floor(ease * 50));

      if (progress < 1) {
        this.animFrameId = requestAnimationFrame(animate);
      }
    };

    if (typeof window !== 'undefined') {
      this.animFrameId = requestAnimationFrame(animate);
    } else {
      // Fallback for SSR/Server context
      this.hotelsCount.set(1900);
      this.websitesCount.set(500);
      this.experienceCount.set(16);
      this.countriesCount.set(50);
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getVideoEmbedUrl(id: string): SafeResourceUrl {
    // vq=hd1080 requests maximum available quality (1080p HD)
    const url = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&enablejsapi=1&rel=0&iv_load_policy=3&showinfo=0&vq=hd1080`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  togglePlay(idx: number, video: HTMLVideoElement) {
    this.reels.update(current => {
      return current.map((item, i) => {
        if (i === idx) {
          if (video.paused) {
            video.play().catch(err => console.log('Video play interrupted:', err));
            return { ...item, isPlaying: true };
          } else {
            video.pause();
            return { ...item, isPlaying: false };
          }
        }
        return item;
      });
    });
  }

  toggleMute(idx: number, video: HTMLVideoElement, event: Event) {
    event.stopPropagation();
    this.reels.update(current => {
      return current.map((item, i) => {
        if (i === idx) {
          video.muted = !video.muted;
          return { ...item, isMuted: video.muted };
        }
        return item;
      });
    });
  }

  scrollReels(container: HTMLElement, direction: 'left' | 'right') {
    const scrollAmount = 320 + 24; // Card width (approx 320px) + gap
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  onReelsScroll(container: HTMLElement) {
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll > 0) {
      const progress = (container.scrollLeft / maxScroll) * 100;
      // Map progress beautifully to a scale between 20% and 100% width
      this.reelsScrollProgress.set(20 + (progress * 0.80));
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isCinemaVisible.set(entry.isIntersecting);
        });
      }, {
        threshold: 0.15 // Trigger when 15% of the section is visible
      });

      if (this.cinemaContainer) {
        this.intersectionObserver.observe(this.cinemaContainer.nativeElement);
      }
    }
  }

  ngOnDestroy() {
    if (this.animFrameId && typeof window !== 'undefined') {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  scrollToTop() {
    this.scroller.scrollToPosition([0, 0]);
  }
}
