import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private platformId = inject(PLATFORM_ID);
  scrolled = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onScroll.bind(this));
      // Run once initially
      this.onScroll();
    }
  }

  private onScroll() {
    if (typeof window !== 'undefined') {
      this.scrolled.set(window.scrollY > 50);
    }
  }
}
