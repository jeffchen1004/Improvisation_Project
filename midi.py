# midi.py
import os
from django.conf import settings
from pyensemble.models import Stimulus


def record_midi(request, metronome_beats=None, **kwargs):
    timeline = []


    # Set default values for parameters
    trial_duration = kwargs.get('trial_duration', 3000)  # in ms
    metronome_bpm = kwargs.get('metronome_bpm', 85)      # beats per minute
    metronome_delay = kwargs.get('metronome_delay', 3000)  # delay before metronome starts

    # Calculates # of beat for continous
    beats_per_minute = metronome_bpm  # as an example
    trial_duration_ms = metronome_delay  # trial duration in milliseconds
    beats_per_second = beats_per_minute / 60
    trial_duration_seconds = trial_duration_ms / 1000
    total_beats = int(beats_per_second * trial_duration_seconds)

    trial = {
        'type': 'record-midi',
        'click_to_start': True,
        'trial_duration': trial_duration, # ms
        'metronome_bpm': metronome_bpm,  # beats per minute 
        'metronome_delay': metronome_delay,  # ms
        'metronome_beats': metronome_beats if metronome_beats is not None else total_beats
    }

    if trial['click_to_start']:
        trial['prompt'] = '<a id="start_button" class="btn btn-primary" role="button" href="#">Start sound</a>'
    
    timeline.append(trial)
    

    
    js_files = ['jspsych/plugin/jspsych-record-midi.js'] # reference to JavaScript file

    return timeline



      

