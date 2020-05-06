import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {

    public getCategoryKey(type: string): string {
        switch (type) {
            case 'Alert':
                return 'alerts';

            case 'Park':
            case 'Garden':
            case 'FlowerBed':
            case 'GreenspaceRecord':
                return 'smartEnvironment';

            case 'AeroAllergenObserved':
            case 'AirQualityObserved':
            case 'WaterQualityObserved':
            case 'NoiseLevelObserved':
                return 'environment';

            case 'PointOfInterest':
            case 'Beach':
            case 'Museum':
            case 'TouristInformationCenter':
                return 'pointOfInterest';

            case 'Open311:ServiceType':
            case 'Open311:ServiceRequest':
                return 'civicIssuesTracking';

            case 'Streetlight':
            case 'StreetlightGroup':
            case 'StreetlightModel':
            case 'StreetlightControlCabinet':
                return 'streetLighting';

            case 'Device':
            case 'DeviceModel':
                return 'device';

            case 'TrafficFlowObserved':
            case 'CrowdFlowObserved':
            case 'BikeHireDockingStation':
            case 'EVChargingStation':
            case 'Road':
            case 'RoadSegment':
            case 'Vehicle':
            case 'VehicleModel':
                return 'transport';

            case 'KeyPerformanceIndicator':
                return 'indicators';

            case 'WasteContainerIsle':
            case 'WasteContainerModel':
            case 'WasteContainer':
                return 'wasteManagement';

            case 'OffStreetParking':
            case 'ParkingAccess':
            case 'OnStreetParking':
            case 'ParkingGroup':
            case 'ParkingSpot':
                return 'parking';

            case 'WeatherAlert':
            case 'WeatherObserved':
            case 'WeatherForecast':
                return 'weather';

            default:
                return 'generic';
        }
    }

}
