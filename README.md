# CB-Baseline

To setup the context broker:

1. Go to docker/context_broker
2. Execute the file "cb_create.bat"

To provide the context broker with data:

1. Install Python 3 if you don't have it (include pip in the installation and be sure to add python to the path)
2. Go to external/eea_fiware
3. Execute in a command line "python eea_fiware.py"
4. Install every needed library required in step 3

To execute both the client and the server:

1. Go to the respective folder
2. Open a console
3. Execute npm install
4. Execute npm start

After this, you can look at "localhost:5200".
