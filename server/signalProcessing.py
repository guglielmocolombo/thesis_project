import mne
from mne.preprocessing import (ICA, create_eog_epochs, create_ecg_epochs, corrmap)
import os
import pandas as pd
import sys
import numpy as np
from scipy.integrate import simps


picks=['Fp1','Fz','F3','F7', 'FT9', 'FC5','FC1','C3','T7','TP9','CP5','CP1','P3','P7','O1','Oz','O2','P4','P8',
 'TP10','CP6','CP2','Cz','C4','T8','FT10','FC6','FC2','F4','F8','Fp2','AF7','AF3','AFz','F1','F5','FT7','FC3','C1','C5','TP7','CP3','P1','P5','PO7','PO3','POz','PO4',
 'PO8','P6','P2','CPz','CP4','TP8','C6','C2','FC4','FT8','F6','AF8','AF4','F2','FCz']
df = pd.DataFrame()

start = [1, 4, 8, 13, 30]
stop = [4, 8, 13, 30, 100]
index = 0


fil = sys.argv[1]
icaComponents = sys.argv[2].split(',')


raw = mne.io.read_raw_brainvision('D:\\prova_app_tesi\\server\\file\\' + fil, eog=('HEOGL', 'HEOGR', 'VEOGb'), misc='auto', scale=1.0, preload=True, verbose=False)
raw.notch_filter(60, picks=picks, method='spectrum_fit', filter_length='auto', phase='zero')


################################################## ICA PROCESSING ####################################################
icaComp_dict = { 'ICA000': 0, 'ICA001': 1, 'ICA002': 2, 'ICA003': 3, 'ICA004': 4, 'ICA005': 5, 'ICA006': 6, 'ICA007': 7,
                  'ICA008': 8, 'ICA009': 9 }
if icaComponents[0]!='void':
    ica = ICA(n_components=10, max_iter='auto', random_state=97)
    ica.fit(raw)
    raw.load_data()
    
    exclude = []
    for comp in icaComponents:
        exclude.append(icaComp_dict[comp])

    ica.exclude = exclude
    ica.apply(raw)
#######################################################################################################################

        
array_val = []
psd, freqs = mne.time_frequency.psd_welch(raw, fmin=0, fmax=100, tmin=None, tmax=None, n_fft=2048, n_overlap=0, n_per_seg=None, picks=picks, proj=False, n_jobs=1,
                                     reject_by_annotation=True, average='mean', window='hamming', verbose=None)
freq_res = freqs[1] - freqs[0] 
for fmin, fmax in zip(start, stop):
    idx_delta = np.logical_and(freqs >= fmin, freqs <= fmax)
    for i in range(len(psd)):
        delta_power = simps(psd[i][idx_delta], dx=freq_res)
        array_val.append(delta_power)
                    
print(array_val)

