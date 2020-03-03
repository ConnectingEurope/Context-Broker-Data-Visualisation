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

from efmanager import EfManager
from efexception import EfException
from config.config import EfConfig

import sys
import os
import time
import signal
import sdnotify


VERSION = "0.1.0"

WATCHDOG_INTERVAL = 10  # Watchdog refreshing interval in seconds

def signal_handler(signal, frame):
    """
    Handle signal received
    """
    sys.exit(0)


if __name__ == '__main__':
   
    # Catch possible SIGINT signals
    signal.signal(signal.SIGINT, signal_handler)

    print(EfConfig.PROC_NAME + " " + VERSION)

    try:
        af_manager = EfManager()
        af_manager.start()
    except EfException as ex:
        ex.show()
        
    # Inform systemd that we've finished our startup sequence
    n = sdnotify.SystemdNotifier()
    n.notify("READY=1")

    while True:
        n.notify("WATCHDOG=1")
        time.sleep(WATCHDOG_INTERVAL)

        
