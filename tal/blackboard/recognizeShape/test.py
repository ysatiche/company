import numpy as np
import pandas as pd
from keras.models import Sequential
from keras.layers import Dense
from keras.models import load_model

def accuracy_score(y_true, y_predict):
  '''计算y_true和y_predict之间的准确率'''
  assert y_true.shape[0] == y_predict.shape[0], \
  "the size of y_true must be equal to the size of y_predict"

  return sum(y_true == y_predict) / len(y_true)

model = load_model('my_model.h5')
data = pd.read_csv('./blackboard-shape/utils/data.csv', index_col=False)
print(data.shape)
data = data.sample(frac=1, random_state=42).reset_index()
data.drop(['index'], 1, inplace=True)
# predict
X = data.values[:, :100]
Y = data.values[:, 100]
print(np.argmax(model.predict(X), axis=1))
print(Y)
print(accuracy_score(Y, np.argmax(model.predict(X), axis=1)))
