import { Component, TemplateRef } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CarouselModule, TooltipModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [BsModalService]
})
export class AppComponent {
    title = 'client';

    constructor(private modalService: BsModalService) { }

    modalRef?: BsModalRef;
    openModal(template: TemplateRef<void>) {
        this.modalRef = this.modalService.show(template);
    }
}
