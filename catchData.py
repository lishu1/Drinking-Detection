import sys
import socket
import time
import re
import os

port = int(sys.argv[1])
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM);
s.bind(("0.0.0.0", port))

validPattern = re.compile("^[0-9\-\.\#]+$")

sqlcmd_template = """mysql -h dbhome.cs.nctu.edu.tw -u hycheng_cs -p123456 -D hycheng_cs -e "INSERT INTO cs_project(Time, Temperature, Humidity, Weight) VALUES (STR_TO_DATE('{}', '%Y-%m-%d-%H-%i-%s'), {}, {}, {});" """

while(True):
	msg, addr = s.recvfrom(4096)
	print "from: %s" % (addr,)
	print "receive: %s" % msg
	
	if(validPattern.match(msg) is None):
		continue
	
	data = msg.split("#")
	if len(data) is not 2:
		continue
	
	info = data[0].split("-");
	if len(info) is not 3:
		continue

	os.system(sqlcmd_template.format(data[1], info[0], info[1], info[2]))
	time.sleep(0.1)
