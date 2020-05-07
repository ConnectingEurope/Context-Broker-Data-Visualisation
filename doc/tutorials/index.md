# Tutorials for deployment

Depending on the necessities for the deployment of the Context Broker Data Visualisation enabler, there are four different tutorials.

They are also divided between **local environment** and **FIWARE lab (or Sandbox)**.

## Content

- [Local environment](#local-environment)
  - [Tutorial 1: Enabler](#firstTutorial)
  - [Tutorial 2: Enabler + Context Broker](#secondtutorial)
  - [Tutorial 3: Enabler + Context Broker + Cygnus + STH-Comet](#thirdTutorial)
  - [Connection between Enabler and FIWARE tools](#connection-between-enabler-and-fiware-tools)
- [FIWARE lab](#fiware-lab)
  - [Tutorial 4: FIWARE lab](#fourthTutorial)
    - [Configuring the enabler](#fourthTutorial-configuration)
    - [Deploying the enabler](#fourthTutorial-deploy)
    - [Associate Floating IP ](#fourthTutorial-ip)



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

### Connection between Enabler and FIWARE tools

Tutorials 2 (Enabler + Context Broker) and 3 (complete architecture) generate new Docker's images in a local environment. The **access URLs for the tools** are:

- fiware-orion:1026
- fiware-cygnus:5080
- fiware-sth-comet:8666

However, if the tools have been deployed separately (by other FIWARE tutorials), use these URLs instead:

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

<a name="fourthTutorial-configuration"></a>
#### Configuring the enabler

Before deploying the enabler, it is necessary to configure fiware lab in the "Access & Security" tab to enable access to the generated instances.

1. Define security groups
    - Click on "Create security Group" and define the name and description of the security group.
        - **Name:** cbenabler_security_group
        - **Description:** Context Broker Data Visualisation Enabler Security Group

    - Once the security group has been created, manage rules to enable the ports needed to establish communication:
        - Add rule:
            - **Rule:** Custom TCP Rule
            - **Direction:** Ingress
            - **Open Port:** Port
            - **Port:** 80
            - **Remote:** CIDR
            - **CIDR:** 0.0.0.0/0

            This should be the result
            ![Architecture](../img/FiwareLabAddRule.png)

2. Define Floating IPs
    - Allocate IP To Project
        - **Pool:** public-ext-net-01

        Should look like in the following screenshot, once everything is configured the application will be accessible in the provided ip.
        ![Architecture](../img/FiwareLabFloatingIPs.png)

<a name="fourthTutorial-deploy"></a>
#### Deploying the enabler
There is a public Sandbox image that contains everything needed to deploy the enabler application, an instance of the image can be created from "Images" tab.

1. Look for the image cb_data_visualisation_enabler in the public section.

2. Select the image an click on the "Launch Instance" button.

3. Fill in the following information:
    - Details:
        - **Availability Zone:** assigns the zone to the instance.
        - **Instance name:** assigns the name to the instance.
        - **Flavor:** At least one medium-type image will be required, but it is possible to assign large or short-large types.
        - **Instance Count:** Number of instances to be deployed, normally 1.
        - **Instance Boot Source:** Select the option "Boot from image".
        - **Image Name:** Select the option "cb_data_visualisation_enabler".
    - Access & Security:
        - Select the security group "cbenabler_security_group".
    - Networking:
        - The "node-int-net-01" network should be in the "selected networks" section.

4. The instance launched will be visible with spawning status in the "Instances tab".
5. Once the instance is running, it will take about 5 minutes to download the latest available version of the "Context Broker Data Visualisation Enabler" and deploy it.

<a name="fourthTutorial-ip"></a>
#### Associate Floating IP
Now, the "Context Broker Data Visualisation Enabler" is deployed, but it is not accessible from the browser because it has not got an associated floating ip.

In the "Instances" tab, open the drop-down to the right of the instance with running status and click on "Asssociate Floating IP".
![Architecture](../img/FiwareLabAssociateIP.png)

Associate the IP created in the [Configuring the enabler](#fourthTutorial-configuration) section.

<a name="fourthTutorial-deploy"></a>
#### Deploying the enabler-tools
An image with the necessary set of tools has been created in case the user has not got a context broker to link the enabler. This image is available in the public "Images" section, its name is "cb_data_visualisation_enabler_tools".
Contains:
- Fiware Orion: exposed in port 1026
- Fiware Cygnus: exposed in port 5080
- Fiware STH Commet: exposed in port 8666
- MongoDB

For the image to be instantiated, a new security group must be configured in the "Access & Security" tab:
- Click on "Create security Group" and define the name and description of the security group.
    - **Name:** cbenabler_tools_security_group
    - **Description:** Context Broker Data Visualisation Enabler Tools Security Group

- Once the security group has been created, manage rules to enable the ports needed to establish communication:
    - Add rule:
        - **Rule:** Custom TCP Rule
        - **Direction:** Ingress
        - **Open Port:** Port
        - **Port:** 1026
        - **Remote:** CIDR
        - **CIDR:** 0.0.0.0/0

    - Add rule:
        - **Rule:** Custom TCP Rule
        - **Direction:** Ingress
        - **Open Port:** Port
        - **Port:** 5051
        - **Remote:** CIDR
        - **CIDR:** 0.0.0.0/0

    - Add rule:
        - **Rule:** Custom TCP Rule
        - **Direction:** Ingress
        - **Open Port:** Port
        - **Port:** 5080
        - **Remote:** CIDR
        - **CIDR:** 0.0.0.0/0

    - Add rule:
        - **Rule:** Custom TCP Rule
        - **Direction:** Ingress
        - **Open Port:** Port
        - **Port:** 8666
        - **Remote:** CIDR
        - **CIDR:** 0.0.0.0/0

Now, the image must be launched from "Images" tab:
1. Look for the image "cb_data_visualisation_enabler_tools" in the public section.

2. Select the image an click on the "Launch Instance" button.

3. Fill in the following information:
    - Details:
        - **Availability Zone:** assigns the zone to the instance.
        - **Instance name:** assigns the name to the instance.
        - **Flavor:** At least one medium-type image will be required, but it is possible to assign large or short-large types.
        - **Instance Count:** Number of instances to be deployed, normally 1.
        - **Instance Boot Source:** Select the option "Boot from image".
        - **Image Name:** Select the option "cb_data_visualisation_enabler_tools".
    - Access & Security:
        - Select the security group "cbenabler_tools_security_group".
    - Networking:
        - The "node-int-net-01" network should be in the "selected networks" section.

4. The instance launched will be visible with spawning status in the "Instances tab".
5. Once the instance is running, it will take about 5 minutes to download the latest available version of the "Context Broker Data Visualisation Enabler" and deploy it.

6. It will not be necessary to assign a Floating Ip, sice the instances have an internal IP that allows communicattion between them.
Example:
![Architecture](../img/FiwareLabEnablerAndTools.png)

Communication between the enabler and the enabler_tools is now possible
![Architecture](../img/FiwareLabEnablerAndToolsExample.png)

[Top](#tutorials-for-deployment)
