import { Component, signal } from '@angular/core';
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
export class App {
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
        // console.log('Route changed ->', nav.urlAfterRedirects, 'isAuthPage=', this.isAuthPage);
      });
  }

  private checkIfAuthRoute(url: string | null): boolean {
    if (!url) return false;
    // normalize (remove query/fragment)
    const path = url.split('?')[0].split('#')[0];
    return this.authRoutes.some(r => path === r || path.startsWith(r + '/'));
  }
}
