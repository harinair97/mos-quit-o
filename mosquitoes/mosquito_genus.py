#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Oct 20 14:45:57 2018

@author: harinair97
"""

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Oct 20 08:00:14 2018

@author: harinair97
"""









# Random Forest

# Importing the libraries
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# Importing the dataset
dataset = pd.read_csv('mosquito_genus.csv')
#X = dataset.iloc[:, [0, 5]].values
X=dataset[['Latitude','Longitude','Precipitation','Temperature','Soil Moisture','Elevation']]
y = dataset.iloc[:, 6].values




## Taking care of missing data
#from sklearn.preprocessing import Imputer
#imputer = Imputer(missing_values = 'null', strategy = 'mean', axis = 0)
#imputer = imputer.fit(X[:, 0])
#X[:,0] = imputer.transform(X[:,0])


#dataset[0].fillna('', inplace=True)
#
#
#
#dataset[0] = dataset[0].replace(np.nan, '', regex=True)


#Encoding Categorical data
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
labelencoder_X=LabelEncoder()
y=labelencoder_X.fit_transform(y)


#onehotencoder = OneHotEncoder(categorical_features=[0])
#X=onehotencoder.fit_transform(X).toarray()









# Splitting the dataset into the Training set and Test set
from sklearn.cross_validation import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)













# Feature Scaling
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)



# Fitting Random Forest Classification to the Training set
from sklearn.ensemble import RandomForestClassifier
classifier = RandomForestClassifier(n_estimators = 10, criterion = 'entropy', random_state = 0)
classifier.fit(X_train, y_train)











# Predicting the Test set results
y_pred = classifier.predict(X_test)

#
#x_predict=[[80,1000,0.268,865,0.52,29]]
#
#y_predict=classifier.predict(x_predict)


# Making the Confusion Matrix
from sklearn.metrics import confusion_matrix
cm = confusion_matrix(y_test, y_pred)


#
## Visualising the Training set results
#from matplotlib.colors import ListedColormap
#
#X_set, y_set = X_train, y_train
#X1, X2 = np.meshgrid(np.arange(start = X_set[:, 0].min() - 1, stop = X_set[:, 0].max() + 1, step = 0.01),
#                     np.arange(start = X_set[:, 1].min() - 1, stop = X_set[:, 1].max() + 1, step = 0.01))
#plt.contourf(X1, X2, classifier.predict(np.array([X1.ravel(), X2.ravel()]).T).reshape(X1.shape),
#             alpha = 0.75, cmap = ListedColormap(('red', 'green')))
#plt.xlim(X1.min(), X1.max())
#plt.ylim(X2.min(), X2.max())
#for i, j in enumerate(np.unique(y_set)):
#    plt.scatter(X_set[y_set == j, 0], X_set[y_set == j, 1],
#                c = ListedColormap(('red', 'green'))(i), label = j)
#plt.title('Random Forest(Training set)')
#plt.xlabel('Factors')
#plt.ylabel('Mosquito Ratio')
#plt.legend()
#plt.show()


from sklearn.externals import joblib
joblib.dump(classifier, 'model.json')







