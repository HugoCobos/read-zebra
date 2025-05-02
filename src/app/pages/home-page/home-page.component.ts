import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
})
export default class HomePageComponent {
  routeCards = routes
    .filter(
      (route) =>
        route.path && route.path !== '' && route.path !== '**' && route.data
    )
    .map((route) => ({
      path: route.path,
      label: route.data!['label'],
      icon: route.data!['icon'],
    }));
}
