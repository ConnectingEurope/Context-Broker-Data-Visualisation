import { Injectable } from '@angular/core';
import { AirQualityObserved } from 'src/app/shared/data-models/fiware/specific/air-quality-observed';
import { OffStreetParking } from 'src/app/shared/data-models/fiware/specific/offStreetParking';

@Injectable({
    providedIn: 'root',
})
export class PopupService {

    public getPopup(modelKey: string, entity: any): string {
        switch (modelKey) {
            case 'airQualityObserved': return this.getAirQualityObservedPopup(entity);
            case 'offStreetParking': return this.getOffStreetParkingPopup(entity);
        }
    }

    private getAirQualityObservedPopup(e: AirQualityObserved): string {
        return 'Air Quality Observed';
    }

    private getOffStreetParkingPopup(e: OffStreetParking): string {
        return 'Off Street Parking';
    }

}
