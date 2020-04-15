import json
import requests
import time

DATA_URL = 'https://streams.lab.fiware.org/v2/entities?type=AirQualityObserved'
DATA_HEADERS = {'fiware-service': 'environment', 'fiware-servicepath': '/Madrid'}
SECONDS_TO_SLEEP = 3600
CONTEXT_BROKER_URL = 'http://localhost:1026/v2/entities'
ENVIRONMENT_HEADERS = {'Content-Type': 'application/json', 'fiware-service': 'environment'}

'''
    Initial import of the environment data, creating the entities in the local CB.
'''
def import_environment_data():
    environment_data = requests.get(DATA_URL, headers=DATA_HEADERS)
    if environment_data:
        for env in environment_data.json():
            r = requests.post(
                CONTEXT_BROKER_URL,
                data=json.dumps(env),
                headers=ENVIRONMENT_HEADERS)
            print (r)

'''
    Update of the already existent entities with the current values.
'''
def update_environment_data():
    environment_data = requests.get(DATA_URL, headers=DATA_HEADERS)
    if environment_data:
        for env in environment_data.json():
            # Copy the original result and deletes the key which may not be updated
            env_copy = env.copy()
            del env_copy['id']
            del env_copy['type']
            env_id = env.get('id')
            update_url = CONTEXT_BROKER_URL + '/' + env_id + '/attrs'
            r = requests.put(
                update_url,
                data=json.dumps(env_copy),
                headers=ENVIRONMENT_HEADERS
            )
            print (r)

if __name__ == '__main__':

    # Check if the entities are already created in the CB
    existent_environment_data = requests.get(
        CONTEXT_BROKER_URL,
        headers={'fiware-service': 'environment'}
    )
    if not existent_environment_data.json():
        print ('There is not data for environment. Importing...\n')
        import_environment_data()
    while True:
        print ('Updating data of the environment...\n')
        update_environment_data()
        print('Sleeping ' + str(SECONDS_TO_SLEEP) + ' seconds...\n')
        time.sleep(SECONDS_TO_SLEEP)