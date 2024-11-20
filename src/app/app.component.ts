import { Component, VERSION } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [RouterLink, RouterLinkActive, RouterOutlet]
})
export class AppComponent {
  version = VERSION.full;
}
