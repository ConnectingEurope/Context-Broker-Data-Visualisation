import json
import requests
import time
import random

#BUS_DATA_URL = 'https://datosabiertos.malaga.eu/recursos/transporte/EMT/EMTlineasUbicaciones/lineasyubicacionesfiware.geojson'
PARKING_DATA_URL = 'https://datosabiertos.malaga.eu/recursos/aparcamientos/ocupappublicosmun/ocupappublicosmunfiware.json'
SECONDS_TO_SLEEP = 6
CONTEXT_BROKER_URL = 'http://localhost:1026/v2/entities'
parking_headers = {'Content-Type': 'application/json',
                   'fiware-service': 'parking'}
#transport_headers = {'Content-Type': 'application/json', 'fiware-service': 'transport'}

PARKINGS = {}


def import_parkings_data():
    parkings_data = requests.get(PARKING_DATA_URL)
    if parkings_data:
        for parking in parkings_data.json():
            r = requests.post(
                CONTEXT_BROKER_URL,
                data=json.dumps(parking),
                headers=parking_headers)
            print(r)


def update_parkings_data():
    parkings_data = requests.get(PARKING_DATA_URL)
    if parkings_data:
        for parking in parkings_data.json():
            parking_id = parking.get('id')
            update_url = CONTEXT_BROKER_URL + '/' + \
                parking_id + '/attrs/availableSpotNumber/value'
            # available_spots = parking.get('availableSpotNumber').get('value')
            # if parking_id in PARKINGS:
            #     available_spots = PARKINGS[parking_id]
            #     while PARKINGS[parking_id] == available_spots:
            #         available_spots = random.randint(10, 99)
            # else:
            #     available_spots = random.randint(10, 99)
            # PARKINGS[parking_id] = available_spots
            available_spots = random.randint(10, 99)
            r = requests.put(
                update_url,
                data=str(available_spots),
                headers={'Content-Type': 'text/plain',
                         'fiware-service': 'parking'}
            )
            print(r)


if __name__ == '__main__':
    existent_parkings_data = requests.get(
        CONTEXT_BROKER_URL,
        headers={'fiware-service': 'parking'}
    )
    if not existent_parkings_data.json():
        print('There is not data for parkings. Importing...\n')
        import_parkings_data()
    while True:
        print('Updating data of the parkings...\n')
        update_parkings_data()
        print('Sleeping ' + str(SECONDS_TO_SLEEP) + ' seconds...\n')
        time.sleep(SECONDS_TO_SLEEP)
