# -*- coding: UTF-8 -*-
import matplotlib.pyplot as plt
import numpy as np
import math
import pandas as pd
import blackboard_shape
# generator shape data

def createParabola(focal_length, centre, rotation):
  t = np.linspace(-math.pi, math.pi, 100)
  x_parabola = focal_length * t**2
  y_parabola = 2 * focal_length * t
  if rotation is not None:
    x_parabola, y_parabola = rotateCoordinates(x_parabola, y_parabola, rotation)
  x_parabola = x_parabola + centre[0]
  y_parabola = y_parabola + centre[1]
  return x_parabola, y_parabola

def createCircle(radius, centre):
  theta = np.linspace(0, 2*math.pi,100)
  x_circle = radius * np.cos(theta) + centre[0]
  y_circle = radius * np.sin(theta) + centre[1]
  return x_circle, y_circle

def createEllipse(major_axis, minor_axis, centre, rotation):
  theta = np.linspace(0, 2*math.pi,100)
  x_ellipse = major_axis * np.cos(theta) 
  y_ellipse = minor_axis * np.sin(theta) 
  if rotation is not None:
      x_ellipse, y_ellipse = rotateCoordinates(x_ellipse,y_ellipse, rotation)
  x_ellipse = x_ellipse + centre[0]
  y_ellipse = y_ellipse + centre[1]
  return x_ellipse, y_ellipse

def createHyperbola(major_axis, conjugate_axis, centre, rotation):
  theta = np.linspace(0, 2*math.pi,100)
  x_hyperbola = major_axis * 1/np.cos(theta) + centre[0]
  y_hyperbola = conjugate_axis * np.tan(theta) + centre[1]
  if rotation is not None:
      x_hyperbola, y_hyperbola = rotateCoordinates(x_hyperbola, y_hyperbola, rotation)
  x_hyperbola = x_hyperbola + centre[0]
  y_hyperbola = y_hyperbola + centre[1]
  return x_hyperbola, y_hyperbola

def rotateCoordinates(x_data, y_data, rot_angle):
  x_ = x_data*math.cos(rot_angle) - y_data*math.sin(rot_angle)
  y_ = x_data*math.sin(rot_angle) + y_data*math.cos(rot_angle)
  return x_,y_

# plot 
def plotter(x_data, y_data, title):
  fig = plt.figure(figsize=[10, 10])
  plt.plot(x_data, y_data, 'b--')
  plt.xlabel('X-axis', fontsize=14)
  plt.ylabel('Y-axis', fontsize=14)
  plt.ylim(-18, 18)
  plt.xlim(-18, 18)
  plt.axhline(y=0, color='k')
  plt.axvline(x=0, color='k')
  plt.grid(True)
  saveFile = title + '.svg'
  plt.savefig(saveFile)
  plt.show()

def get_n_samples(x_data, y_data, n):
  indexes = np.round(np.linspace(0, 99, n)).astype('int')
  return x_data[indexes], y_data[indexes]

def get_random_index(array_size):
  index =  np.random.choice(array_size, 1)
  return index[0]

def build_dataset(x_, y_, shape):
  data = []
  row = {}
  for i in range(len(x_)):
    row['x' + str(i+1)] = x_[i]
    row['y' + str(i+1)] = y_[i]
  row['shape'] = shape
  data.append(row)
  return data

# plot parabola
# angle = [0, math.pi/4, math.pi*2/3, math.pi*4/3]
# j=0
# for i in angle:
#   j=j+1
#   x_parabola, y_parabola = createParabola(focal_length=1.8, centre=[-3+j,-4+j], rotation=i)
#   temp = 'Parabola '+str(j)
#   fig1 = plotter(x_parabola, y_parabola, temp)


# batch generator
sample_count = 6
# Parabola
focal_length_array = np.linspace(1, 20, 100)
centre_x_arr = np.linspace(-12, 12, 100)
centre_y_arr = np.linspace(-12, 12, 100)
rotation_array = np.linspace(2*math.pi, 100)

parabola_dataset = pd.DataFrame()

for i in range(1000):
  focal_length = focal_length_array[get_random_index(len(focal_length_array))]
  centre_x = centre_x_arr[get_random_index(len(centre_x_arr))]
  centre_y = centre_y_arr[get_random_index(len(centre_y_arr))]
  rotation = rotation_array[get_random_index(len(rotation_array))]
  x,y = createParabola(focal_length= focal_length, centre= [centre_x, centre_y],rotation= rotation)
  x_, y_ = get_n_samples(x, y, sample_count)
  data = build_dataset(x_, y_, '0')
  parabola_dataset = parabola_dataset.append(data, ignore_index=True)

# Ellipse
major_axis_array = np.linspace(1,20,100)
minor_axis_array = np.linspace(1,20,100)
centre_x_arr = np.linspace(-12, 12, 100)
centre_y_arr = np.linspace(-12, 12, 100)
rotation_array = np.linspace(2*math.pi, 100)

ellipse_dataset = pd.DataFrame()

for i in range(1000):
  major_axis = major_axis_array[get_random_index(len(major_axis_array))]
  minor_axis = minor_axis_array[get_random_index(len(minor_axis_array))]
  centre_x = centre_x_arr[get_random_index(len(centre_x_arr))]
  centre_y = centre_y_arr[get_random_index(len(centre_y_arr))]
  rotation = rotation_array[get_random_index(len(rotation_array))]
  x,y = createEllipse(major_axis=major_axis, minor_axis=minor_axis, centre= [centre_x,centre_y], rotation= rotation)
  x_,y_ = get_n_samples(x, y, sample_count)
  data = build_dataset(x_, y_, '1')
  ellipse_dataset = ellipse_dataset.append(data, ignore_index=True)

# Hyperbola
major_axis_array = np.linspace(1,20,100)
conjugate_axis_array = np.linspace(1,20,100)
centre_x_arr = np.linspace(-12, 12, 100)
centre_y_arr = np.linspace(-12, 12, 100)
rotation_array = np.linspace(2*math.pi, 100)

hyperbola_dataset = pd.DataFrame()

for i in range(1000):
  major_axis = major_axis_array[get_random_index(len(major_axis_array))]
  conjugate_axis = conjugate_axis_array[get_random_index(len(conjugate_axis_array))]
  centre_x = centre_x_arr[get_random_index(len(centre_x_arr))]
  centre_y = centre_y_arr[get_random_index(len(centre_y_arr))]
  rotation = rotation_array[get_random_index(len(rotation_array))]
  x,y = createHyperbola(major_axis=major_axis, conjugate_axis=conjugate_axis, centre= [centre_x,centre_y], rotation= rotation)
  x_,y_ = get_n_samples(x, y, sample_count)
  data = build_dataset(x_, y_, '0')
  hyperbola_dataset = hyperbola_dataset.append(data, ignore_index=True)

# Circle
radius_array = np.linspace(1,20,100)
centre_x_arr = np.linspace(-12, 12, 100)
centre_y_arr = np.linspace(-12, 12, 100)

circle_dataset = pd.DataFrame()

for i in range(1000):
  radius = radius_array[get_random_index(len(radius_array))]
  centre_x = centre_x_arr[get_random_index(len(centre_x_arr))]
  centre_y = centre_y_arr[get_random_index(len(centre_y_arr))]
  x,y = createCircle(radius = radius, centre= [centre_x,centre_y])
  x_,y_ = get_n_samples(x, y, sample_count)
  data = build_dataset(x_, y_, '1')
  circle_dataset = circle_dataset.append(data, ignore_index=True)

# blackboard_shape

# 三角形
triangle_x_arr = np.linspace(20,800,100)
triangle_y_arr = np.linspace(20,800,100)

# for i in range(1000):
#   triangle_start_x = np.random.randint(20, 800)
#   triangle_start_y = np.random.randint(20, 800)
#   triangle_end_x = np.random.randint(60, 1000)
#   triangle_end_y = np.random.randint(60, 600)
#   arr = blackboard_shape._getTrianglePointsArr({'x': triangle_start_x, 'y': triangle_start_y}, {'x': triangle_end_x, 'y': triangle_end_y})
#   x = []
#   y = []
#   for p in arr:
#     x.append(p['x'])
#     y.append(p['y'])
#   x = np.array(x)
#   y = np.array(y)
#   x_,y_ = get_n_samples(x, y, sample_count)
#   data = build_dataset(x_, y_, 'triangle')
#   circle_dataset = circle_dataset.append(data, ignore_index=True)

combined_dataset = pd.concat([parabola_dataset, ellipse_dataset, hyperbola_dataset, circle_dataset])
combined_dataset.to_csv('dataset.csv', index=False)