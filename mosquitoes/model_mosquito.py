#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Oct 20 11:20:55 2018

@author: harinair97
"""
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.externals import joblib


def funct():
    clf = joblib.load('model.json')
    x_predict=[[80,10,0.26,86,0.2,22]]
    y_predict=clf.predict(x_predict)
    print(y_predict)
    return y_predict

funct()