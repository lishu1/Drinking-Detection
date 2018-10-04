#!/usr/bin/python

from sht1x.Sht1x import Sht1x as SHT1x 
import RPi.GPIO as GPIO
import spidev
import time
import os
import sys
import subprocess
 
dataPin = 11
clkPin = 7
base = 834
full = 848
none = 804
liter = 500

sht1x = SHT1x(dataPin,clkPin,SHT1x.GPIO_BOARD)

# Open SPI bus
spi = spidev.SpiDev()
spi.open(0,0)
 
# Function to read SPI data from MCP3008 chip
# Channel must be an integer 0-7
def ReadChannel(channel):
  adc = spi.xfer2([1,(8+channel)<<4,0])
  data = ((adc[1]&3) << 8) + adc[2]
  return data

# Define sensor channels
weight_channel = 0
 
# Define delay between readings
delay = 1

count = 0
weight_sum = 0
weight = 0
 
while True:

  # Read the temperature and humidity data
  temperature = sht1x.read_temperature_C()
  humidity = sht1x.read_humidity() 

  # Read the fsr data
  weight_level = ReadChannel(weight_channel)
  if(weight_level>none):
    count = count + 1
    weight_sum = weight_sum+weight_level
    if(count == 4):
      weight_level = float(weight_sum)/4
      if(weight_level>base):
        weight = float(weight_level-base)/float(full-base)*liter
  else:
    count = 0
    weight_sum = 0
  

  # Print out results
  tmp = time.strftime('%Y-%m-%d %H:%M:%S')
  tmp = tmp.replace(':','-')
  tmp = tmp.replace(' ','-')
  with open("command",'w') as f:
    f.write("#!/bin/bash \necho \"%f-%f-%f#%s\" | nc -u -w1 linux3.cs.nctu.edu.tw 5566" % (temperature,humidity,weight,tmp))
  subprocess.call(['./command'])

  print "--------------------------------------------"
  print("#!/bin/bash \necho \"%f-%f-%f#%s\" | nc -u -w1 linux3.cs.nctu.edu.tw 5566" % (temperature,humidity,weight,tmp))
  print("Weight: {}".format(weight_level))
 
  # Wait before repeating loop
  time.sleep(delay)
