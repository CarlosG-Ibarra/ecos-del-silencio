import { Component, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Footer } from './footer/footer';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('ecos-del-silencio');
  public isAuthPage = false;

  private authRoutes = ['/login', '/register', '/forgot-password'];

  constructor(private router: Router) {
    this.isAuthPage = this.checkIfAuthRoute(this.router.url);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const nav = e as NavigationEnd;
        this.isAuthPage = this.checkIfAuthRoute(nav.urlAfterRedirects || nav.url);
      });
  }

  ngOnInit() {
    let lastScareTime = 0;
    const cooldown = 10000; // 10 seconds cooldown between jumpscares
    const scareChance = 0.5; // 30% chance
    let lastHoverCheck = 0;
    const checkInterval = 2000; // check once per second

    document.addEventListener('mouseover', (e) => {
      const now = Date.now();

      if (now - lastHoverCheck < checkInterval) return;
      lastHoverCheck = now;

      if (now - lastScareTime < cooldown) return;

      const target = e.target as HTMLElement;
      if (!target) return;

      // Only on hoverable or interactive elements
      const isHoverable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'IMG' ||
        target.classList.contains('hoverable') ||
        getComputedStyle(target).cursor === 'pointer';

      // Random chance
      if (isHoverable && Math.random() < scareChance) {
        lastScareTime = now;
        this.triggerJumpscare();
      }
    });

    // Manual trigger (press "J")
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'j') {
        this.triggerJumpscare();
      }
    });
  }

  private triggerJumpscare() {
    // Prevent multiple scares at once
    if (document.querySelector('.jumpscare')) return;

    const jumpscare = document.createElement('div');
    jumpscare.classList.add('jumpscare');
    jumpscare.innerHTML = `
      <img src="/assets/jumpscare3.jpg" alt="Jumpscare" />
      <audio autoplay src="/assets/jumpscare-sound.mp3"></audio>
    `;

    // Disable scroll
    document.body.style.overflow = 'hidden';
    document.body.appendChild(jumpscare);

    // Remove after 1.5s
    setTimeout(() => {
      jumpscare.remove();
      document.body.style.overflow = '';
    }, 1500);
  }

  private checkIfAuthRoute(url: string | null): boolean {
    if (!url) return false;
    const path = url.split('?')[0].split('#')[0];
    return this.authRoutes.some(r => path === r || path.startsWith(r + '/'));
  }
}
