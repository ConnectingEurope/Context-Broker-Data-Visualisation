#########################################################################
# Copyright (c) 2019 panStamp <contact@panstamp.com>
#
# This file is part of the RESPIRA-FIWARE project.
#
# panStamp  is free software; you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# any later version.
#
# panStamp is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with panStamp; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301
# USA
#
# Author: Daniel Berenguer
# Date: Sep 27 2019
#########################################################################


class EfConfig(object):
    """
    EEA FIWARE bridge configuration class
    """

    #####################################################################
    # General settings
    #####################################################################

    # Log enable
    LOG_ENABLE = False

    # Process name
    PROC_NAME = "EEA FIWARE bridge"

    # Country codes to be queried
    COUNTRY_CODES = ["ES"]

    # Dictionary of parameters to be retrieved from service and the corresponding UltraLight nomenclature
    POLLUTION_PARAMETERS = {"NO2": "no2", "SO2": "so2", "CO": "co", "O3": "o3",
                            "NO": "no", "C6H6": "c6h6", "PM2.5": "pm2.5", "PM10": "pm10", "AQI": "q"}

    #####################################################################
    # EEA settings
    #####################################################################

    # AEMET observation URL
    EEA_URL = "http://discomap.eea.europa.eu/map/fme/latest"

    #####################################################################
    # FIWARE settings
    #####################################################################

    # FIWARE service
    FIWARE_SERVICE = "openiot"

    # FIWARE service group creation URL
    FIWARE_SERVGROUP_URL = "http://localhost:4041/iot/services"

    # FIWARE UL IoT agent URL
    FIWARE_UL_URL = "http://localhost:7896/iot/d"

    # FIWARE API Key
    FIWARE_APIKEY = "patata"

    # FIWARE entity names
    FIWARE_ENTITY = "EEA_POLLUTION"

    # FIWARE datamodel
    FIWARE_DATAMODEL = {"lat": "latitude", "lon": "longitude", "co": "CO", "so2": "SO2",
                        "no": "NO", "no2": "NO2", "o3": "O3", "pm2": "PM2.5", "pm10": "PM10", "q": "airQualityIndex"}

    # Which of the above parameters are strings
    FIWARE_DATAMODEL_STRINGS = []
