import mne
from mne.preprocessing import (ICA, create_eog_epochs, create_ecg_epochs, corrmap)
import sys


raw = mne.io.read_raw_brainvision('D:\\prova_app_tesi\\server\\file\\'+sys.argv[1], eog=('HEOGL', 'HEOGR', 'VEOGb'), misc='auto', scale=1.0, preload=True, verbose=False)

ica = ICA(n_components=10, max_iter='auto', random_state=97)
ica.fit(raw)

raw.load_data()

ica.plot_sources(raw, show_scrollbars=False)
ica.plot_components()
