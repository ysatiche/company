import matplotlib.pyplot as plt
import numpy as np
import math
import pandas as pd
import copy

# type ['parallelogram', 'triangle', 'circle']

def _getLinePointsArr (start, end):
  baseLen = 2
  pointsArr = []
  xCalc = end['x'] - start['x']
  yCalc = end['y'] - start['y']
  arrLen = abs(xCalc) * baseLen
  if xCalc == 0:
    arrLen = abs(yCalc) * baseLen
  pointsArr.append(start)
  for i in range(int(arrLen)):
    prePoint = pointsArr[i]
    pointsArr.append({
      'x': prePoint['x'] + xCalc / arrLen,
      'y': prePoint['y'] + yCalc / arrLen
    })
  return pointsArr

def _getCircle(start, end):
  center = {
    'x': (end['x'] + start['x']) / 2,
    'y': (end['y'] + start['y']) / 2
  }
  a = abs((end['x'] - start['x']) / 2)
  b = abs((end['y'] - start['y']) / 2)
  return _circle(center, a, b)

def _circle(center, a, b, semiCircle):
  baseCircleLen = 5
  pointsArr = []
  r = (b, a)[a > b]
  ratioX = a / r
  ratioY = b / r
  # 上半圆，暂定 count = baseCircleLen * r
  count = baseCircleLen * r
  step = math.pi / count
  angle = 0
  for i in range(count):
    pointsArr.append({
      'x': center['x'] + r * math.cos(angle) * ratioX,
      'y': center['y'] - r * math.sin(angle) * ratioY
    })
    angle += step
  if semiCircle == 'up':
    return pointsArr
  arr = []
  angle = 0
  for i in range(count):
    arr.append({
      'x': center['x'] + r * Math.cos(angle) * ratioX,
      'y': center['y'] + r * Math.sin(angle) * ratioY
    })
    angle += step
  if semiCircle == 'down':
    return arr
  return pointsArr + arr

# 平行四边形
def getParallelogram (start, end):
  pointsArr = []
  w = end['x'] - start['x']
  offset = w / 4
  p1 = {
    'x': start['x'] + offset,
    'y': start['y']
  }
  p2 = {
    'x': end['x'],
    'y': start['y']
  }
  p3 = {
    'x': end['x'] - offset,
    'y': end['y']
  }
  p4 = {
    'x': start['x'],
    'y': end['y']
  }
  arr = _getLinePointsArr({ 'x': p1['x'], 'y': p1['y'] }, { 'x': p2['x'], 'y': p2['y'] })
  pointsArr = pointsArr + arr
  arr = _getLinePointsArr({ 'x': p2['x'], 'y': p2['y'] }, { 'x': p3['x'], 'y': p3['y'] })
  pointsArr = pointsArr + arr
  arr = _getLinePointsArr({ 'x': p3['x'], 'y': p3['y'] }, { 'x': p4['x'], 'y': p4['y'] })
  pointsArr = pointsArr + arr
  arr = _getLinePointsArr({ 'x': p4['x'], 'y': p4['y'] }, { 'x': p1['x'], 'y': p1['y'] })
  pointsArr = pointsArr + arr
  return pointsArr

# 三角形
def _getTrianglePointsArr (start, end):
  pointsArr = []
  p1 = {
    'x': (end['x'] + start['x']) / 2,
    'y': start['y']
  }
  p2 = {
    'x': start['x'],
    'y': end['y']
  }
  p3 = end
  arr = _getLinePointsArr({ 'x': p1['x'], 'y': p1['y'] }, { 'x': p2['x'], 'y': p2['y'] })
  pointsArr = pointsArr + arr
  arr = _getLinePointsArr({ 'x': p2['x'], 'y': p2['y'] }, { 'x': p3['x'], 'y': p3['y'] })
  pointsArr = pointsArr + arr
  arr = _getLinePointsArr({ 'x': p3['x'], 'y': p3['y'] }, { 'x': p1['x'], 'y': p1['y'] })
  pointsArr = pointsArr + arr
  indexes = np.round(np.linspace(0, len(pointsArr) - 1, 100)).astype('int')
  return np.array(pointsArr)[indexes]
