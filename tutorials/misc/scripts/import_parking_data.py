import json
import requests
import time

PARKING_DATA_URL = 'https://datosabiertos.malaga.eu/recursos/aparcamientos/ocupappublicosmun/ocupappublicosmunfiware.json'
SECONDS_TO_SLEEP = 300
CONTEXT_BROKER_URL = 'http://localhost:1026/v2/entities'
parking_headers = {'Content-Type': 'application/json', 'fiware-service': 'parking'}
SUBSCRIPTION_URL = 'http://localhost:1026/v2/subscriptions'
CREATE_SUBSCRIPTIONS = True
NOTIFY_SUBS_URL = 'http://cygnus:5051/notify'

'''
    Initial import of the parkings data, creating the entities in the local CB.
'''
def import_parkings_data():
    parkings_data = requests.get(PARKING_DATA_URL)
    if parkings_data:
        for parking in parkings_data.json():

            # Create the entity in the Context Broker
            r = requests.post(
                CONTEXT_BROKER_URL,
                data=json.dumps(parking),
                headers=parking_headers)
            print ('Creation of entity, response_code: ' + str(r.status_code))

            # Create the subscription for the current entity and its attributes
            if CREATE_SUBSCRIPTIONS and r.status_code == 201:
                subscription_json = {
                    "description": "Notify STH-Comet changes of " + parking.get('id'),
                    "subject": {
                        "entities": [
                            {
                                "type": parking.get('type'),
                                "id": parking.get('id')
                            }
                        ],
                        "condition": {
                            "attrs": []
                        },
                    },
                    "notification": {
                        "http": {
                            "url": NOTIFY_SUBS_URL
                        },
                        "attrs": [
                            "availableSpotNumber"
                        ]
                    }
                }
                subs = requests.post(
                    SUBSCRIPTION_URL,
                    data=json.dumps(subscription_json),
                    headers=parking_headers
                )
                print('Subscription response code: ' + str(subs.status_code))

'''
    Update of the already existent entities with the current values.
'''
def update_parkings_data():
    parkings_data = requests.get(PARKING_DATA_URL)
    if parkings_data:
        for parking in parkings_data.json():
            parking_id = parking.get('id')
            update_url = CONTEXT_BROKER_URL + '/' + parking_id + '/attrs/availableSpotNumber/value'
            available_spots = parking.get('availableSpotNumber').get('value')
            r = requests.put(
                update_url,
                data=str(available_spots),
                headers={'Content-Type': 'text/plain', 'fiware-service': 'parking'}
            )
            print (r)

if __name__ == '__main__':

    # Check if the entities are already created in the CB
    existent_parkings_data = requests.get(
        CONTEXT_BROKER_URL,
        headers={'fiware-service': 'parking'}
    )
    if not existent_parkings_data.json():
        print ('There is not data for parkings. Importing...\n')
        import_parkings_data()
    while True:
        print ('Updating data of the parkings...\n')
        update_parkings_data()
        print('Sleeping ' + str(SECONDS_TO_SLEEP) + ' seconds...\n')
        time.sleep(SECONDS_TO_SLEEP)
