#!/usr/bin/env python
import scapy.all as scapy
import argparse
from scapy.layers import http
# sniff 相关

def get_interface():
  parser = argparse.ArgumentParser()
  parser.add_argument("-i", "--interface", dest="interface")
  arguments = parser.parse_args()
  return arguments.interface

def sniff():
  scapy.sniff(store=False, prn=process_packet)

def process_packet(packet):
  if packet.haslayer(http.HTTPRequest):
    print("[+} Http Request >> " + bytes.decode(packet[http.HTTPRequest].Host) + bytes.decode(packet[http.HTTPRequest].Path))
    if packet.haslayer(scapy.Raw):
      load = packet[scapy.Raw].load
      print("[load] " + load)

# iface = get_interface()
sniff()