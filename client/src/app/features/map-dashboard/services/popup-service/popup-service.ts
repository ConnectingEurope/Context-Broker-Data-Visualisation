import { Injectable, ComponentFactoryResolver, ComponentFactory, Injector, ComponentRef } from '@angular/core';
import { PopupComponent } from 'src/app/shared/templates/popup/popup.component';
import * as L from 'leaflet';

@Injectable({
    providedIn: 'root',
})
export class PopupService {

    constructor(
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
    ) { }

    public getPopup(e: any): L.Popup {
        const compFactory: ComponentFactory<PopupComponent> = this.resolver.resolveComponentFactory(PopupComponent);
        const popupComponentRef: ComponentRef<PopupComponent> = compFactory.create(this.injector);
        popupComponentRef.instance.entity = e;
        popupComponentRef.changeDetectorRef.detectChanges();

        const div: HTMLDivElement = document.createElement('div');
        div.appendChild(popupComponentRef.location.nativeElement);

        const popup: L.Popup = L.popup();
        popup.setContent(div);

        return popup;
    }
}
