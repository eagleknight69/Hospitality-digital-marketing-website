import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  setPageTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  updateMeta(name: string, content: string) {
    this.meta.updateTag({ name, content });
  }
}
