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

from config.config import EfConfig
from efexception import EfException
from efeea import EfEea
from efiware import Efiware

import threading
import json
import time
import datetime


class EfManager(threading.Thread):
    """
    General IO management class
    """

    def run(self):
        """
        Start timer
        """
        # Endless loop
        while True:
            for country in EfConfig.COUNTRY_CODES:
                for polluant, ul_key in EfConfig.POLLUTION_PARAMETERS.items():
                    # Query polluant
                    try:
                        stations = self.eea.query(country, polluant)
                        print(str(len(stations)) + " stations received")

                        for code, station in stations.items():                            
                            ul_string = "lat|" + station["lat"]
                            ul_string += "|lon|" + station["lon"]
                            ul_string += "|" + ul_key + "|" + station[EfConfig.POLLUTION_PARAMETERS[polluant]]

                            print(ul_string)

                            timestamp = station["timestamp"]
                            entity = EfConfig.FIWARE_ENTITY + "_" + code
                            Efiware(EfConfig.FIWARE_APIKEY, entity, timestamp, ul_string)

                            date_time = datetime.datetime.now()
                            print(date_time.strftime("%Y-%m-%dT%H:%M:%S") + " : " + polluant + " from " + code + " successfully transmitted to FIWARE")

                            time.sleep(0.2)                    

                    except Exception as ex:
                        print(str(ex))

            print("Ending update")

            # Trigger every hour at minute 30
            while datetime.datetime.now().minute != 30:
                time.sleep(60)


    def __init__(self):
        """
        Class constructor
        """
        threading.Thread.__init__(self)
        
        ## Configure thread as daemon
        self.daemon = True

        ## EEA object
        self.eea = EfEea()
