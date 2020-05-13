#!/usr/bin/python3


import json
import requests
import time
import random

parking_service = 'testparking'
environment_service = 'testenvironment'

DATA_URL = 'https://raw.githubusercontent.com/ConnectingEurope/Context-Broker-Data-Visualisation/develop/tutorials/enabler_orion_cygnus_sth/test-data/madrid-environment-data.json'
SECONDS_TO_SLEEP = 3600
CONTEXT_BROKER_URL = 'http://localhost:1026/v2/entities'
ENVIRONMENT_HEADERS = {'Content-Type': 'application/json', 'fiware-service': environment_service}
SUBSCRIPTION_URL = 'http://localhost:1026/v2/subscriptions'
CREATE_SUBSCRIPTIONS = True
NOTIFY_SUBS_URL = 'http://fiware-cygnus:5051/notify'
HISTORICAL_ATTRS = ['NO', 'NO2', 'NOx', 'O3', 'BEN', 'CH4', 'EBE', 'NHMC', 'PM10', 'TCH', 'TOL', 'PM2.5', 'SO2', 'CO']

PARKING_DATA_URL = 'https://raw.githubusercontent.com/ConnectingEurope/Context-Broker-Data-Visualisation/develop/tutorials/enabler_orion_cygnus_sth/test-data/malaga-parking-data.json'
parking_headers = {'Content-Type': 'application/json', 'fiware-service': parking_service}
PROVIDERS = ['TEF', 'TYP', 'CPA', 'AJV']
'''
    Initial import of the environment data, creating the entities in the local CB.
'''


def import_environment_data():
    environment_data = requests.get(DATA_URL)

    if environment_data:
        for env in environment_data.json():
            r = requests.post(
                CONTEXT_BROKER_URL + '?options=keyValues',
                data=json.dumps(env),
                headers=ENVIRONMENT_HEADERS)
            print('Creation of entity, response_code: ' + str(r.status_code) + ' - ' + str(r))

        # Create the subscription for the current entity and its attributes
        if CREATE_SUBSCRIPTIONS:
            subscription_json = {
                "description": "Notify STH-Comet changes of environment",
                "subject": {
                    "entities": [
                        {
                            "type": "AirQualityObserved",
                            "idPattern": "Madrid-AirQualityObserved.*"
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
                    "attrs": HISTORICAL_ATTRS
                }
            }
            subs = requests.post(
                SUBSCRIPTION_URL,
                data=json.dumps(subscription_json),
                headers=ENVIRONMENT_HEADERS
            )
            print('Subscription response code: ' + str(subs.status_code))


'''
    Update of the already existent entities with the current values.
'''


def update_environment_data():
    environment_data = requests.get(DATA_URL)
    if environment_data:
        for env in environment_data.json():
            # Copy the original result and deletes the key which may not be updated
            env_copy = env.copy()
            del env_copy['id']
            del env_copy['type']
            env_id = env.get('id')
            for attr in HISTORICAL_ATTRS:
                try:
                    if env_copy[attr]:
                        env_copy[attr] = {'type': 'Number', 'value': random.randint(0, 10), 'metadata': {}}
                except:
                    pass

            update_url = CONTEXT_BROKER_URL + '/' + env_id + '/attrs'
            r = requests.put(
                update_url,
                data=json.dumps(env_copy),
                headers=ENVIRONMENT_HEADERS
            )
            print(r)


def get_random_provider():
    return PROVIDERS[random.randint(0, len(PROVIDERS) - 1)]

'''
    Initial import of the parkings data, creating the entities in the local CB.
'''
def import_parkings_data():
    parkings_data = requests.get(PARKING_DATA_URL)

    if parkings_data:
        print(parkings_data)
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
            available_spots = random.randint(10, 99)
            r = requests.put(
                update_url,
                data=str(available_spots),
                headers={'Content-Type': 'text/plain', 'fiware-service': parking_service}
            )
            print(r)


if __name__ == '__main__':
    existent_environment_data = 0
    existent_parkings_data = 0
    while not existent_environment_data and not existent_parkings_data:
        try:
            existent_environment_data = requests.get(CONTEXT_BROKER_URL, headers={'fiware-service': environment_service})
            existent_parkings_data = requests.get(CONTEXT_BROKER_URL, headers={'fiware-service': parking_service})
        except:
            print('sleeping')
            time.sleep(60)

    if not existent_parkings_data.json():
        print('There is not data for parkings. Importing...\n')
        import_parkings_data()

    if not existent_environment_data.json():
        print('There is not data for environment. Importing...\n')
        import_environment_data()

    while True:
        print('Updating data of the environment...\n')
        update_environment_data()
        update_parkings_data()
        print('Sleeping ' + str(SECONDS_TO_SLEEP) + ' seconds...\n')
        time.sleep(SECONDS_TO_SLEEP)
