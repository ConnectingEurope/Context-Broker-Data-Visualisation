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
from efhttpclient import EfHttpClient

import json
from datetime import datetime


class EfEea(object):
    """
    EEA HTTP agent
    """


    def query(self, country, polluant):
        '''
        Query observation data

        @param country: country code
        @param polluant: polluant to be queried

        @return ordered dictionary contained the requested information
        '''
        url = ""
        try:
            url = EfConfig.EEA_URL + "/" + country + "_" + polluant + ".csv"
            headers = {"Content-type" : "text/csv"}
            client = EfHttpClient(headers, url)
            
            print("Downloading from " + url + "...")
            res = client.get()

            stations = {}
            for row in res:
                station_code = row["station_code"]
                ref_time = row["value_datetime_end"]
                timestamp = datetime.strptime(ref_time, "%Y-%m-%d %H:%M:%S%z")
                conc = row["value_numeric"]                    
                # Retain only the latest reading from each station
                update = True

                if conc != '':
                    if station_code in stations:
                        ts = stations[station_code]["timestamp"]
                        
                        if ts > timestamp:
                            update = False

                    if update:
                        lat = row["samplingpoint_y"]
                        lon = row["samplingpoint_x"]                                                                              
                        measurement = {"timestamp": timestamp,"lat": lat, "lon": lon, EfConfig.POLLUTION_PARAMETERS[polluant]: conc}
                        stations[station_code] = measurement

            return stations

        except:
            raise EfException("Unable to get data URL from " + url)


    def __init__(self):
        '''
        Constructor
        '''
        pass
