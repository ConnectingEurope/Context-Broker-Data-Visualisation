import { Injectable, ComponentFactoryResolver, ComponentFactory, Injector, ComponentRef } from '@angular/core';
import { PopupComponent } from 'src/app/shared/templates/popup/popup.component';
import { ModelDto } from 'src/app/shared/models/model-dto';
import { Entity } from 'src/app/shared/models/entity';

@Injectable({
    providedIn: 'root',
})
export class PopupService {

    constructor(
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
    ) { }

    public createPopupComponent(e: Entity, modelDto: ModelDto): ComponentRef<PopupComponent> {
        const compFactory: ComponentFactory<PopupComponent> = this.resolver.resolveComponentFactory(PopupComponent);
        const popupComponentRef: ComponentRef<PopupComponent> = compFactory.create(this.injector);
        popupComponentRef.instance.updatePopup(e, modelDto);
        popupComponentRef.changeDetectorRef.detectChanges();

        return popupComponentRef;
    }

}
