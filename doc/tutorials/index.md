# Tutorials for deployment

Depending on the necessities for the deployment of the Context Broker Data Visualisation enabler, there are four different tutorials.

They are also divided between **local environment** and **FIWARE lab (or Sandbox)**.

## Content

- [Local environment](#local-environment)
  - [Tutorial 1: Enabler](#firstTutorial)
  - [Tutorial 2: Enabler + Context Broker](#secondtutorial)
  - [Tutorial 3: Enabler + Context Broker + Cygnus + STH-Comet](#thirdTutorial)
  - [Connection between Enabler and FIWARE tools](#connectionNote)
- [FIWARE lab](#fiware-lab)
  - [Tutorial 4: FIWARE lab](#fourthTutorial)

## Local environment

The first three tutorials are focused to a deployment in a local environment.

Depending on the **necessity of the tools** to be deployed, it should be better to select the most adequated tutorial.

They are ordered by the number of tools that are deployed, being the third one the most complete of them.

As a pre-requisite, **it is needed to have installed [Docker](https://www.docker.com/)** before starting with any of the **tutorials in a local environment**.

[Top](#tutorials-for-deployment)

<a name="firstTutorial"></a>

### Tutorial 1: Enabler

This option is recommended for those who want to deploy the enabler in a local environment and **already have a Context Broker** or want to use an **external Context Broker (possibly, in a server)**. So they only need to deploy the enabler.

The steps for the deployment are the following:

1. Check Docker is running on the computer.

2. Open a terminal and go to the folder: **workspace/tutorials/enabler**

    ```bash
    cd workspace/tutorials/enabler
    ```

3. In case of having **Windows** run the script called **deploy_windows.bat**:

    ```bash
    deploy_windows.bat
    ```

    In case of having **Linux** run the script called **deploy_linux.sh**

    ```bash
    sh deploy_linux.sh
    ```

4. Now, the needed images are being downloaded from DockerHub and they will be started after the download.

5. Ejecute the following command in the terminal:

    ```bash
    docker ps
    ```

6. There should be **two new containers in Docker**:

    - cbenabler
    - cbenabler-server

7. Go to the web browser and try to access to the enabler in the following URL:

    ```url
    localhost
    ```

[Top](#tutorials-for-deployment)

<a name="secondTutorial"></a>

### Tutorial 2: Enabler + Context Broker

This second option is recommended for those who want to deploy the enabler in a local environment and they **don't have any Context Broker for testing**, so they are **interested in real-time data** and need one Context Broker. Additionally, they are **not interested in historical data**.

The steps for the deployment are the following:

1. Check Docker is running on the computer.

2. Open a terminal and go to the folder: **workspace/tutorials/enabler_orion**

    ```bash
    cd workspace/tutorials/enabler_orion
    ```

3. In case of having **Windows** run the script called **deploy_windows.bat**:

    ```bash
    deploy_windows.bat
    ```

    In case of having **Linux** run the script called **deploy_linux.sh**

    ```bash
    sh deploy_linux.sh
    ```

4. Now, the needed images are being downloaded from DockerHub and they will be started after the download.

5. Ejecute the following command in the terminal:

    ```bash
    docker ps
    ```

6. There should be **four new containers in Docker**:

    - cbenabler
    - cbenabler-server
    - fiware-orion
    - db-mongo

7. Go to the web browser and try to access to the enabler in the following URL:

    ```url
    localhost
    ```

[Top](#tutorials-for-deployment)

<a name="thirdTutorial"></a>

### Tutorial 3: Enabler + Context Broker + Cygnus + STH-Comet

This third option is recommended for those who want to deploy the enabler in a local environment and they are **interested in both real-time data (Context Broker) and historical data (Cygnus and STH-Comet)**.

This one is the most complete tutorial for local environments. It will guide the user in how to **deploy the complete architecture of the enabler**:

![Architecture](../img/Architecture.png)

More information related with the architecture can be found [here](../technical/index.md/#architecture).

The steps for the deployment are the following:

1. Check Docker is running on the computer.

2. Open a terminal and go to the folder: **workspace/tutorials/enabler_orion_cygnus_sth**

    ```bash
    cd workspace/tutorials/enabler_orion_cygnus_sth
    ```

3. In case of having **Windows** run the script called **deploy_windows.bat**:

    ```bash
    deploy_windows.bat
    ```

    In case of having **Linux** run the script called **deploy_linux.sh**

    ```bash
    sh deploy_linux.sh
    ```

4. Now, the needed images are being downloaded from DockerHub and they will be started after the download.

5. Ejecute the following command in the terminal:

    ```bash
    docker ps
    ```

6. There should be **six new containers in Docker**:

    - cbenabler
    - cbenabler-server
    - fiware-orion
    - fiware-cygnus
    - fiware-sth-comet
    - db-mongo

7. Go to the web browser and try to access to the enabler in the following URL:

    ```url
    localhost
    ```

[Top](#tutorials-for-deployment)

<a name="connectionNote"></a>

### Connection between Enabler and FIWARE tools

In tutorials 2 and 3, when configuring FIWARE tools in the configuration page of the Enabler, you must use the following URLs:

- fiware-orion:1026
- fiware-cygnus:5080
- fiware-sth-comet:8666

However, if you want to access to one of these tools from your host, use these URLs instead:

- localhost:1026
- localhost:5080
- localhost:8666

[Top](#tutorials-for-deployment)

## FIWARE lab

The last tutorial is focused on the deployment of the enabler in the **FIWARE lab** (or Sandbox).

As pre-requisite, a FIWARE lab account is needed in order to access. For that, access to [this link](https://cloud.lab.fiware.org/auth/login/) and click on the **Request Community Account** button.

After the registration, the deployment can be carried out following the [Tutorial 4](#tutorial-4:-fiware-lab).

[Top](#tutorials-for-deployment)

<a name="fourthTutorial"></a>

### Tutorial 4: FIWARE lab

TO DO

[Top](#tutorials-for-deployment)
