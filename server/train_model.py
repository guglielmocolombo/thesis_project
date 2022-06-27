from itertools import count
from sklearn.metrics import make_scorer, confusion_matrix
from sklearn.model_selection import GridSearchCV
from sklearn import metrics
import os
import pandas as pd
import numpy as np
import mne
import sys
import joblib
import seaborn as sns

import matplotlib.pyplot as plt; plt.rcdefaults()
import numpy as np
import matplotlib.pyplot as plt
import math

from scipy.integrate import simps
from sklearn.svm import SVR
from sklearn.metrics import make_scorer, confusion_matrix
from sklearn.model_selection import GridSearchCV

from sklearn.preprocessing import StandardScaler


def print_ConfusionMatrix(cf_matrix):
    
    ax = sns.heatmap(cf_matrix, annot=True, cmap='Blues')
    ax.set_title('Seaborn Confusion Matrix with labels\n\n');
    ax.set_xlabel('\nPredicted Values')
    ax.set_ylabel('Actual Values ');
    ## Ticket labels - List must be in alphabetical order
    ax.xaxis.set_ticklabels(['False','True'])
    ax.yaxis.set_ticklabels(['False','True'])
    ## Display the visualization of the Confusion Matrix.
    plt.figure()

def perform_grid_search(model_, hyper_params_grid, score_function,X_train,y_train,X_test,y_test):
   # score_function = make_scorer(compute_rmse)
    search = GridSearchCV(model_, hyper_params_grid, scoring=score_function, n_jobs=-1, cv=5)
    result = search.fit(X_train, y_train)
    prediction = result.predict(X_test)
    
        
    from sklearn.metrics import confusion_matrix
    cf_matrix = confusion_matrix(y_test, prediction)
    print_ConfusionMatrix(cf_matrix)


    from sklearn import metrics
    accuracy = metrics.accuracy_score(y_test, prediction)
    precision = metrics.precision_score(y_test, prediction, pos_label= 0)
    recall = metrics.recall_score(y_test, prediction, pos_label = 0)
    f1 = metrics.f1_score(y_test, prediction, pos_label = 0)
    
    return search, accuracy, precision, recall, f1


def select_features(X_train, Y_train,X_test,n_feat,target):

    x1 = X_train
    x1[target] = Y_train

    cor = x1.corr()
    #sns.heatmap(cor, annot=True, cmap=plt.cm.Reds)
    
    trg_cor = (abs(cor[target]).sort_values()) #valori dell variabili  
    if n_feat >= len(X_train.columns):
        slc_feat = X_train.columns
    
    start = (len(X_train.columns)-n_feat-1)
    stop = len(X_train.columns)-1
    
    slc_feat = trg_cor[start:stop].index
    X_train = X_train[slc_feat]
    X_test = X_test[slc_feat]
    
    return X_train, X_test


def standardize_data(df):
    
    target = df['target']
    df = df.drop('target', axis = 1)

    scaler = StandardScaler()
    df = pd.DataFrame(scaler.fit_transform(df))

    df['target'] = target
    return df


picksy = ['Fp1','Fz', 'F3','F7','Iz','FC5','FC1','C3','T7', 'TP9','CP5','CP1','P3','P7', 'O1', 'Oz','O2','P4','P8','TP10', 'CP6','CP2','Cz','C4','T8','FT10', 'FC6','FC2','F4','F8','Fp2','AF7','AF3','AFz','F1','F5','FT7','FC3','C1','C5','TP7','CP3','P1','P5','PO7','I1', 'POz','I2','PO8','P6','P2','CPz','CP4','TP8', 'C6','C2','FC4','FT8','F6','AF8','AF4','F2','FCz']
models = sys.argv[1].split(',')
picks = sys.argv[2].split(',')
modelName = sys.argv[3]


"""
models = ["Random Forest Classifier"]
picks = ["F1", "Fz", "Cz", "C4", "C1"]
modelName = "PORCODIO"
"""


start = [1, 4, 8, 13, 30]
stop = [4, 8, 13, 30, 100]


############################################# CONTROL PATIENTS ##########################################################
arr = os.listdir('D:\\prova_app_tesi\\server\\patients_file')

df = pd.DataFrame()
for file in arr:
    if '.vhdr' in file:
        raw = mne.io.read_raw_brainvision('D:\\prova_app_tesi\\server\\patients_file\\'+file, eog=('HEOGL', 'HEOGR', 'VEOGb'), misc='auto', scale=1.0, preload=True, verbose=None)
        raw.notch_filter(60, picks=picks, method='spectrum_fit', filter_length='auto', phase='zero')
        
        array_val = []
        psd, freqs = mne.time_frequency.psd_welch(raw, fmin=0, fmax=100, tmin=None, tmax=None, n_fft=2048, n_overlap=0, n_per_seg=None, picks=picks, proj=False, n_jobs=1,
                                     reject_by_annotation=True, average='mean', window='hamming', verbose=None)
        freq_res = freqs[1] - freqs[0] 
        for fmin, fmax in zip(start, stop):
                idx_delta = np.logical_and(freqs >= fmin, freqs <= fmax)
                for i in range(len(psd)):
                    delta_power = simps(psd[i][idx_delta], dx=freq_res)
                    array_val.append(delta_power)
                    
        df2 = pd.DataFrame([array_val])
        df = df.append(df2, ignore_index = True)

target = np.ones(df.shape[0])
df['target'] = target.astype(int)

###################################### PATIENTS FILES #########################################################################

arr = os.listdir('D:\\prova_app_tesi\\server\\controls_file')
df_controls = pd.DataFrame()

start = [1, 4, 8, 13, 30]
stop = [4, 8, 13, 30, 100]

for file in arr:
    if '.vhdr' in file:
        raw = mne.io.read_raw_brainvision('D:\\prova_app_tesi\\server\\controls_file\\'+file, eog=('HEOGL', 'HEOGR', 'VEOGb'), misc='auto', scale=1.0, preload=True, verbose=None)
        raw.notch_filter(60, picks=picks, method='spectrum_fit', filter_length='auto', phase='zero')
        
        array_val = []
        psd, freqs = mne.time_frequency.psd_welch(raw, fmin=0, fmax=100, tmin=None, tmax=None, n_fft=2048, n_overlap=0, n_per_seg=None, picks=picks, proj=False, n_jobs=1,
                                     reject_by_annotation=True, average='mean', window='hamming', verbose=None)
        freq_res = freqs[1] - freqs[0] 
        
        for fmin, fmax in zip(start, stop):
                idx_delta = np.logical_and(freqs >= fmin, freqs <= fmax)
                for i in range(len(psd)):
                    delta_power = simps(psd[i][idx_delta], dx=freq_res)
                    array_val.append(delta_power)
        df2 = pd.DataFrame([array_val])
        df_controls = df_controls.append(df2, ignore_index = True)

target = np.zeros(df_controls.shape[0])
df_controls['target'] = target.astype(int)


df = df.append(df_controls, ignore_index=True)

df = df.dropna(axis = 1) #delete coulmns if one of the signals has not that channel

mean = df.mean().values.flatten().tolist()
std = df.std().values.flatten().tolist()

df = standardize_data(df)
########################################### SPLIT TRAIN TEST ###################################################
from sklearn.model_selection import train_test_split

target = df['target']
df_dropped = df.drop('target', axis=1)
x_train, x_test, y_train, y_test = train_test_split(df_dropped, target, test_size = 0.20)

#x_train, x_test = select_features(x_train, y_train, x_test, 70, 'target')

######################################### MODEL TRAINING ###################################################
accuracy = []
precision = []
recall = []
f1 = []

if "Logistic Regression" in models:
    from sklearn.linear_model import LogisticRegression

    model = LogisticRegression()
    hyper_params_grid = { 'C': [0.5, 0.7, 1, 2, 3],'penalty': ['l1', 'l2'], 'solver': ['lbfgs'], 'max_iter':[2000] }
    grid, acc, rec, prec, f1_score = perform_grid_search(model,hyper_params_grid,'f1',x_train ,y_train, x_test ,y_test )

    accuracy.append(acc)
    precision.append(prec)
    recall.append(rec)
    f1.append(f1_score)

    model = grid.best_estimator_
    joblib.dump(model, 'D:\\prova_app_tesi\\server\\new_model\\'+modelName+'_LogisticRegression')


if "Random Forest Classifier" in models:
    from sklearn.ensemble import RandomForestClassifier

    model = RandomForestClassifier()
    hyper_params_grid = { 'criterion' :['gini'], 'max_depth':[2, 5, 7, 10], 'min_samples_leaf': [5, 10, 15], 'max_features': ['auto', 'sqrt', 'log2'], 'class_weight': ['balanced', 'balanced_subsample'] }
    grid, acc, rec, prec, f1_score = perform_grid_search(model,hyper_params_grid,'f1',x_train ,y_train, x_test ,y_test )

    accuracy.append(acc)
    precision.append(prec)
    recall.append(rec)
    f1.append(f1_score)
    
    model = grid.best_estimator_
    joblib.dump(model, 'D:\\prova_app_tesi\\server\\new_model\\'+modelName+'_RandomForestClassifier')

if "K-Nearest Neighbors" in models:
    from sklearn.neighbors import KNeighborsClassifier

    model = KNeighborsClassifier()
    hyper_params_grid = { 'n_neighbors': [2, 5, 10, 20],  'weights':['uniform', 'distance'], 'algorithm': ['auto', 'ball_tree', 'kd_tree', 'brute']  }
    grid_predictions, acc, prec, rec, f1_score = perform_grid_search(model,hyper_params_grid,'f1',x_train ,y_train, x_test ,y_test )

    accuracy.append(acc)
    precision.append(prec)
    recall.append(rec)
    f1.append(f1_score)
    
    model = grid.best_estimator_
    joblib.dump(model, 'D:\\prova_app_tesi\\server\\new_model\\'+modelName+'_K-NearestNeighbors')

if "Linear Discriminant Analysis" in models:
    from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

    model = LinearDiscriminantAnalysis()
    hyper_params_grid = { 'solver': ['svd', 'lsqr', 'eigen']  }
    grid_predictions, acc, prec, rec, f1_score = perform_grid_search(model,hyper_params_grid,'f1',x_train ,y_train, x_test ,y_test )

    accuracy.append(acc)
    precision.append(prec)
    recall.append(rec)
    f1.append(f1_score)
    
    model = grid.best_estimator_
    joblib.dump(model, 'D:\\prova_app_tesi\\server\\new_model\\'+modelName+'_LinearDiscriminantAnalysis')

if "Support Vector Machine" in models:
    from sklearn.svm import SVC

    model = SVC(class_weight = 'balanced')
    hyper_params_grid = { 'C':[0.3, 0.5, 0.8, 1, 2], 'kernel': ['linear', 'poly', 'rbf', 'sigmoid'], 'gamma': ['scale', 'auto']  }
    grid_predictions, acc, prec, rec, f1_score = perform_grid_search(model,hyper_params_grid,'f1',x_train ,y_train, x_test ,y_test )

    accuracy.append(acc)
    precision.append(prec)
    recall.append(rec)
    f1.append(f1_score)
    
    model = grid.best_estimator_
    joblib.dump(model, 'D:\\prova_app_tesi\\server\\new_model\\'+modelName+'_SupportVectorMachine')



######################################################################################################

width = 0.40

objects = tuple(models)
y_pos = np.arange(len(objects))
y_pos = y_pos*2.4
plt.bar(y_pos-0.2, accuracy, width)
plt.bar(y_pos+0.2, precision, width)
plt.bar(y_pos+0.6, recall, width)
plt.bar(y_pos-0.6, f1, width)

plt.xticks(y_pos, models)
plt.xlabel("Machine Learning Methods")
plt.ylabel("Perfomrmance Metrics")
plt.legend(["Accuracy", "Precision", "Recall", "F1"])
plt.title("High Correlated with Target")
plt.show()

print(std[0:(len(std)-1)])
print(mean[0:(len(mean)-1)])
to_select = x_train.columns.values.flatten().tolist()

to_peek = []
count = 1
for pick in picks:
    counter = 0
    for channel in picksy:
        counter = counter + 1
        if pick == channel:
            break

    for elem in to_select:
        if elem >= 5*count:
            count = count + 1
            break
        elif elem >= 5*count - 5:
            to_peek.append( (counter*5)-5 +  elem%5)

print(to_peek)

        
            



