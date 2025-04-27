import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [BsModalService]
})
export class AppComponent {
}
