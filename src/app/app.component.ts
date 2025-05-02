import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

import { RouterOutlet } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private exitModal: any;

  constructor(private router: Router) {
    this.initializeBackButtonBehavior();
  }

  initializeBackButtonBehavior() {
    if (Capacitor.getPlatform() === 'android') {
      CapacitorApp.addListener('backButton', () => {
        const currentUrl = this.router.url;

        if (currentUrl === '/') {
          // Mostrar modal para confirmar salida
          // Mostrar diálogo de confirmación
          this.showExitModal();
        } else {
          window.history.back();
        }
      });
    }
  }

  showExitModal() {
    const modalElement = document.getElementById('exitAppModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      // Guardamos para poder cerrarlo desde confirmExit
      this.exitModal = modal;
    }
  }

  confirmExit() {
    if (this.exitModal) {
      this.exitModal.hide();
    }
    CapacitorApp.exitApp();
  }
}
