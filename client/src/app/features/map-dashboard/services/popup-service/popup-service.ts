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

    public getPopupContent(e: any, cometUrl: string): ComponentRef<PopupComponent> {
        const compFactory: ComponentFactory<PopupComponent> = this.resolver.resolveComponentFactory(PopupComponent);
        const popupComponentRef: ComponentRef<PopupComponent> = compFactory.create(this.injector);
        popupComponentRef.instance.updatePopup(e, cometUrl);
        popupComponentRef.changeDetectorRef.detectChanges();

        return popupComponentRef;
    }
}
