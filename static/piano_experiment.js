// record_midi.js

// Web MIDI API

let midiData = [];

function handleMIDIMessage(message) {
    console.log("MIDI message received:", message);
    midiData.push(message.data);

    var midiDataDiv = document.getElementById('midi-data');
    if (midiDataDiv) {
        midiDataDiv.innerHTML = "MIDI Data: " + JSON.stringify(message.data);
    }

    let currentTime = performance.now();
    // Calculate the relative timing
    let relativeTime = currentTime - startTime;

    // Calculate the position of the note relative to the beat
    let beatLength = 60 * 1000 / bpm; // in milliseconds for one beat
    let beatPosition = (relativeTime / beatLength) % 4; // for 4/4 time signature

    console.log("Relative Time:", relativeTime, "Beat Position:", beatPosition);

};

function requestMIDIAccess() {
    //If MIDI avaliable
    if (navigator.requestMIDIAccess) {
        // sysex is a security measure to ensure web page can't send arbitrary data to MIDI without user's permission
        // If Promise resolved = onMIDISuccess
        navigator.requestMIDIAccess({ sysex: false }).then(onMIDISuccess, onMIDIFailure);
    } else {
        console.warn("Web MIDI API not supported in this browser");
    }
};

// Handle successful MIDI connection
function onMIDISuccess(midiAccess) {
    console.log("MIDI Access Success");
    var inputs = midiAccess.inputs.values();
    // Connecting to MIDI device and getting the value
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = handleMIDIMessage;
    }
};

// Handle Failed MIDI connection
function onMIDIFailure() {
    console.warn("MIDI Access Failed");
};

function updateMidiData(message) {
    var midiDataDiv = document.getElementById('midi-data');
    if (midiDataDiv) {
        midiDataDiv.innerHTML = "MIDI Data: " + JSON.stringify(message.data);
    }
}



// Metronome
var metronomeInterval;
let startTime;

function startMetronome(bpm, numberOfBeats) {
    var context = new (window.AudioContext || window.webkitAudioContext)();

    // Calculate the delay time between each beat
    var delay = 60 / bpm * 1000;

    // Schedule a short beep on every beat
    var scheduleBeep = function(time) {
        var osc = context.createOscillator();
        osc.type = 'sine'; // Eperiment with different waveforms: sine, square, sawtooth, triangle

        osc.connect(context.destination);
        osc.start(time);
        osc.stop(context.currentTime + 0.1); // The beep lasts for 0.1 seconds
    };

    if (numberOfBeats && numberOfBeats > 0) {
        metronomeInterval = setInterval(scheduleBeep, delay);
        setTimeout(function() {
            clearInterval(metronomeInterval);
        }, numberOfBeats * delay);
    } else {
        metronomeInterval = setInterval(scheduleBeep, delay);
    }

    startTime = performance.now();
}

function stopMetronome() {
    clearInterval(metronomeInterval);
}

// jsPsych plugin

jsPsych.plugins["record-midi"] = (function() {

    var plugin = {};

    plugin.info = {
        name: "record-midi",
        parameters: {
            stimulus: {
                type: jsPsych.plugins.parameterType.STRING,
                default: undefined
            },
            click_to_start: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: false
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                default: 3000
            }
        }
    }

    plugin.trial = function(display_element, trial) {
        // Display the stimulus and prompt...

        // Add on_start logic
        console.log('Condition 0 started');
        midiData = [];
        requestMIDIAccess();

        // Start metronome
        setTimeout(function() {
            startMetronome(85);
        }, 3000);  // 3 sec delay for countdown

        // ... rest of the trial logic ...

        // Add on_finish logic
        console.log('Condition 0 finished');
        data.condition = 'Condition 0 Play';
        data.midiData = midiData;
        console.log(data);
        clearInterval(metronomeInterval);  // Stop the metronome
        stopTimer();  // Stop timer
    };

    return plugin;
})();

requestMIDIAccess();