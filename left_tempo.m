% Input 
% params = struct ('MIDI_NOTE_NUMBER_COL', 4, 'MIN_SEPARATION_BEATS', 0.5, 'MAX_LFT_HND_NOTE_NUM', 60, 'ONSET_BEAT_COL', 1);
% params.MIN_SEPARATION_BEATS = 2;
% grouped_chords = group_chords(nmat, params);


% Set Struct and Parameters
% MIDI_NOTE_NUMBER_COL = 4
% MIN_SEPARATION_BEATS = 0.5
% MAX_LFT_HND_NOTE_NUM = 60 
% ONSET_BEAT_COL = 1

function [left_first_beat] = left_tempo(nmat, params)

% Default Value
if nargin < 2 

    params = struct ('MIDI_NOTE_NUMBER_COL', 4, 'MIN_SEPARATION_BEATS', 0.5, 'MAX_LFT_HND_NOTE_NUM', 60, 'ONSET_BEAT_COL', 1);
end

% Customized Value
% Check if input is customized
if isstruct(params)
    list_of_params = fieldnames(params);
    for i = 1:length(list_of_params)
        field_name = list_of_params{i};

        % Check if parameter is altered
        if isfield(params, field_name)
            params.(field_name) = params.(field_name);
        end
    end
end

MIDI_NOTE_NUMBER_COL = params.MIDI_NOTE_NUMBER_COL;
MIN_SEPARATION_BEATS = params.MIN_SEPARATION_BEATS;
MAX_LFT_HND_NOTE_NUM = params. MAX_LFT_HND_NOTE_NUM;
ONSET_BEAT_COL = params.ONSET_BEAT_COL;


% Create logical mask where 20 <= pitch value < 60 is true(1)
% Can vary based on MIDI setting 
left_hand_note_mask = (nmat (:,MIDI_NOTE_NUMBER_COL) < MAX_LFT_HND_NOTE_NUM) ;

% Eliminate unwanted pitch values in nmat
left_hand_events = nmat(left_hand_note_mask,:) ;

% Find beat diff > MIN_SEPATATION_BEATS
beat_diff = diff(left_hand_events(:,ONSET_BEAT_COL)) ; 
chord_events = find(beat_diff > MIN_SEPARATION_BEATS);

% Create matrix to store the left hand events; +1 accounts for last chord
left_first_beat = zeros(length(chord_events)+1, 7) ;

% Loop variable from values 1 to length(chord_events)+1
for chord_idx = 1:length(chord_events) + 1 
    % Start of chord
    % Group for 1st chord
    if chord_idx == 1
        start_chord_idx = 1 ;

% Keep looping values / -1 account for last chord ; +1 last note to start
% of chord
    else
        start_chord_idx = chord_events(chord_idx-1) + 1 ;

    end

    % First chord to the second to last chord
    if chord_idx <= length(chord_events)

        % End of chord
        end_chord_idx = chord_events(chord_idx) ;
        
    else
% Account for the last chord
        end_chord_idx = size(left_hand_events,1) ;
    end



    % Extract first note of chords and store in grouped_chords matrix
    chord_notes = left_hand_events(start_chord_idx:end_chord_idx,:) ;
    left_first_beat(chord_idx,:) = [chord_notes(1,1:7)] ;

  
end


