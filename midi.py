# midi.py
import os
from django.conf import settings
from pyensemble.models import Stimulus


def record_midi(request, wargs, **kwargs):
    timeline = []

    # Calculates # of beat for continous
    beats_per_minute = 85  # as an example
    trial_duration_ms = 3000  # trial duration in milliseconds
    beats_per_second = beats_per_minute / 60
    trial_duration_seconds = trial_duration_ms / 1000
    total_beats = int(beats_per_second * trial_duration_seconds)

    trial = {
        'type': 'record-midi',
        'stimulus': os.path.join(settings.MEDIA_URL, stimulus.location.url),
        'click_to_start': True,
        'trial_duration': 3000, # ms
        'metronome_bpm': 85,  # beats per minute 
        'metronome_delay': 3000,  # ms
        'metronome_beats': total_beats, # number of beats
    }

    if trial['click_to_start']:
        trial['prompt'] = '<a id="start_button" class="btn btn-primary" role="button" href="#">Start sound</a>'
    
    timeline.append(trial)

    js_files = ['path/to/record_midi.js'] # reference to JavaScript file

    return timeline, stimulus_id



      

