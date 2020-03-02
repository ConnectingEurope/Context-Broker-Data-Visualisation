import { Injectable } from '@angular/core';
import { AirQualityObserved } from 'src/app/shared/data-models/air-quality-observed';

@Injectable({
    providedIn: 'root',
})
export class PopupService {

    public getPopup(modelKey: string, entity: any): string {
        switch (modelKey) {
            case 'airQualityObserved': return this.getAirQualityObservedPopup(entity);
        }
    }

    private getAirQualityObservedPopup(e: AirQualityObserved): string {
        return '<b>NO: </b>' + (Number(e.NO) ? e.NO : '-') + '<br />';
    }

}
