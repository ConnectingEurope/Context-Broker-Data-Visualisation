#########################################################################
# Copyright (c) 2018 panStamp <contact@panstamp.com>
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
# Date: Sep 18 2019
#########################################################################

from config.config import EfConfig
from efexception import EfException

import json
import requests
import csv
import io


class EfHttpClient(object):
    """
    HTTP client
    """

    def get(self):
        """
        Run HTTP get request
        """
        try:
            result = requests.get(self.url, headers=self.header, params=self.parameters, data=self.payload)

            if result.status_code == 200:
                reader = csv.DictReader(io.StringIO(result.text), delimiter=',')
                return reader
            else:
                raise EfException("Unable to reach server via HTTP. Status: " + result.status_code + " . Reason: " + result.reason)

        except Exception as ex:
            raise EfException(str(ex))


    def post(self):
        """
        Run HTTP post request
        """
        try:
            result = requests.post(self.url, headers=self.header, params=self.parameters, data=self.payload)

            if result.status_code in [200, 201]:
                try:
                    return result.json()
                except:
                    return result.text
            else:
                raise EfException("Unable to reach server via HTTP. Status: " + result.status_code + " . Reason: " + result.reason)

        except Exception as ex:
            raise EfException(str(ex))


    def __init__(self, header, url, params="", payload=""):
        '''
        Constructor

        @param header: Dictionary of HTTP request headers
        @param url: URL to be reached
        @param params: Dictionary of HTTP request parameters
        @param payload: HTTP payload
        '''
        ## HTTP headers
        self.header = header

        ## URL
        self.url = url

        ## HTTP parameters
        self.parameters = params

        ## HTTP payload
        self.payload = payload


if __name__ == '__main__':

    headers = {"Content-type" : "text/csv"}
    url = EfConfig.EEA_URL + "/" + "ES_NO2.csv"
    client = EfHttpClient(headers, url)
    res = client.get()

    print(res.fieldnames)

    for row in res:
        print(row)

    print(res)



