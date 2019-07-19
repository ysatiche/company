import numpy as np
import pandas as pd
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.wrappers.scikit_learn import KerasClassifier
from keras.utils import np_utils
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import KFold
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
import os
import itertools
import math
np.set_printoptions(threshold=np.nan)
import matplotlib.pyplot as plt
import tensorflow as tf
import shutil
import json
from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
import plotly.graph_objs as go
import cufflinks as cf
cf.go_offline()
init_notebook_mode(connected=True)
from keras import optimizers
tf.logging.set_verbosity(tf.logging.ERROR)
import warnings

warnings.filterwarnings('ignore')
clean_start = True

data = pd.read_csv('Conic-Section_dataset.csv', index_col=False)
data = data.sample(frac=1, random_state=42).reset_index()
data.drop(['index'], 1, inplace=True)

X = data.values[:, :12]
Y = data.values[:, 12]

# encode class values as int
encoder = LabelEncoder()
encoder.fit(Y)
encoder_Y = encoder.transform(Y)

# convert integers to dmmy variables
dummy_y = np_utils.to_categorical(encoder_Y)

# create model
def baseline_model():
  model = Sequential()
  model.add(Dense(128, input_dim=12, activation='relu'))
  model.add(Dropout(0.2))
  model.add(Dense(256, activation='relu'))
  model.add(Dropout(0.3))
  model.add(Dense(64, activation='relu'))
  model.add(Dropout(0.5))
  model.add(Dense(4, activation='relu'))
  model.add(Dropout(0.5))
  model.add(Dense(4, activation='softmax'))
  # compile model
  Adadelta = optimizers.Adadelta(lr = 1)
  model.compile(loss='categorical_crossentropy', optimizer=Adadelta, metrics=['accuracy'])
  return model

model = baseline_model()
history = model.fit(x=X,y=dummy_y,validation_split=0.2,shuffle=True, epochs=100, batch_size=12)
train_loss = history.history['loss']
val_loss = history.history['val_loss']

train_acc = history.history['acc']
val_acc = history.history['val_acc']

def plotter(training,validation,title):
  plt.figure(figsize=(10,10))
  n = len(training)
  x = np.linspace(0,200,n)
  training = np.array(training)
  validation = np.array(validation)
  plt.plot(x, training, 'g-', label = 'training', linewidth =2)
  plt.plot(x, validation, 'r', label = 'validation')
  plt.grid(True)
  plt.xlabel('Number of Epoch')
  plt.ylabel(title,fontsize=12)
  plt.title(title,fontsize=24)
  plt.legend()
  #saveFile = title + '.svg'
  #plt.savefig(saveFile)
  plt.show()

plotter(train_loss,val_loss,'Loss')


