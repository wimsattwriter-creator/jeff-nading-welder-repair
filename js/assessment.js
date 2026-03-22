/* ============================================
   Jeff Nading Miller Welder Repair — Assessment Engine
   Version: 1.0

   Decision tree, skill scoring, and recommendation
   logic for the Repair Assessment Tool.
   ============================================ */

// --- State ---
let assessmentData = {
    description: '',
    brand: '',
    modelLine: '',
    model: '',
    customMachine: '',
    serialNumber: '',
    decodedYear: '',
    engine: '',
    symptom: '',
    followUp: {},
    skills: {},
    repairTier: 0,
    repairDifficulty: 0,
    skillScore: 0,
    recommendation: ''
};

// --- Step Navigation ---
function goToStep(stepNum) {
    // Validate current step before moving forward
    const currentStep = document.querySelector('.assessment__step.active');
    const currentStepNum = parseInt(currentStep.id.replace('step', ''));

    if (stepNum > currentStepNum) {
        if (currentStepNum === 1) {
            assessmentData.description = document.getElementById('problemDescription').value;
        }
        if (currentStepNum === 2) {
            if (!assessmentData.symptom) {
                alert('Please select a symptom to continue.');
                return;
            }
        }
        if (currentStepNum === 2 && stepNum === 3) {
            generateFollowUpQuestions();
        }
    }

    // Update steps
    document.querySelectorAll('.assessment__step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + stepNum).classList.add('active');

    // Update progress bar
    document.querySelectorAll('.assessment__progress-step').forEach(bar => {
        const barStep = parseInt(bar.dataset.step);
        bar.classList.remove('active', 'completed');
        if (barStep < stepNum) bar.classList.add('completed');
        if (barStep === stepNum) bar.classList.add('active');
    });

    // Scroll to top of assessment
    document.getElementById('assessmentTool').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Option Selection ---
function selectOption(element, group) {
    // Remove selected from siblings
    element.closest('.assessment__options').querySelectorAll('.assessment__option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input').checked = true;
    assessmentData[group] = element.querySelector('input').value;
}

// --- Machine Identification Cascade ---

function initBrandDropdown() {
    var sel = document.getElementById('brandSelect');
    if (!sel || typeof MACHINE_DB === 'undefined') return;
    sel.innerHTML = '<option value="">Select brand...</option>';
    for (var key in MACHINE_DB.brands) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = MACHINE_DB.brands[key].name;
        sel.appendChild(opt);
    }
    var otherOpt = document.createElement('option');
    otherOpt.value = 'other';
    otherOpt.textContent = 'Other / Not Listed';
    sel.appendChild(otherOpt);
}

function onBrandChange(brandKey) {
    assessmentData.brand = brandKey;
    assessmentData.modelLine = '';
    assessmentData.model = '';
    assessmentData.engine = '';
    assessmentData.serialNumber = '';
    assessmentData.decodedYear = '';
    assessmentData.customMachine = '';

    var lineGroup = document.getElementById('lineGroup');
    var modelGroup = document.getElementById('modelGroup');
    var serialGroup = document.getElementById('serialGroup');
    var engineGroup = document.getElementById('engineGroup');
    var customGroup = document.getElementById('customMachineGroup');

    // Reset downstream
    lineGroup.style.display = 'none';
    modelGroup.style.display = 'none';
    serialGroup.style.display = 'none';
    engineGroup.style.display = 'none';
    customGroup.style.display = 'none';

    if (!brandKey) return;

    if (brandKey === 'other') {
        customGroup.style.display = 'block';
        serialGroup.style.display = 'block';
        document.getElementById('serialHelp').textContent = 'Enter the serial number from your machine\'s rating plate if you can find it.';
        document.getElementById('serialDecodeResult').style.display = 'none';
        return;
    }

    var brand = MACHINE_DB.brands[brandKey];
    if (!brand) return;

    // Populate line dropdown
    var lineSel = document.getElementById('lineSelect');
    lineSel.innerHTML = '<option value="">Select model line...</option>';
    var lineKeys = Object.keys(brand.lines);

    // If only one line, auto-select it
    if (lineKeys.length === 1) {
        var opt = document.createElement('option');
        opt.value = lineKeys[0];
        opt.textContent = brand.lines[lineKeys[0]].name;
        opt.selected = true;
        lineSel.appendChild(opt);
        lineGroup.style.display = 'block';
        onLineChange(lineKeys[0]);
    } else {
        for (var i = 0; i < lineKeys.length; i++) {
            var opt = document.createElement('option');
            opt.value = lineKeys[i];
            opt.textContent = brand.lines[lineKeys[i]].name;
            lineSel.appendChild(opt);
        }
        lineGroup.style.display = 'block';
    }
}

function onLineChange(lineKey) {
    assessmentData.modelLine = lineKey;
    assessmentData.model = '';
    assessmentData.engine = '';

    var modelGroup = document.getElementById('modelGroup');
    var serialGroup = document.getElementById('serialGroup');
    var engineGroup = document.getElementById('engineGroup');
    modelGroup.style.display = 'none';
    serialGroup.style.display = 'none';
    engineGroup.style.display = 'none';

    if (!lineKey) return;

    var brand = MACHINE_DB.brands[assessmentData.brand];
    if (!brand || !brand.lines[lineKey]) return;
    var line = brand.lines[lineKey];

    // Populate model dropdown
    var modelSel = document.getElementById('modelSelect');
    modelSel.innerHTML = '<option value="">Select model...</option>';
    for (var key in line.models) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = line.models[key].name;
        if (line.models[key].notes) {
            opt.title = line.models[key].notes;
        }
        modelSel.appendChild(opt);
    }
    var otherOpt = document.createElement('option');
    otherOpt.value = 'other';
    otherOpt.textContent = 'Not sure / Other ' + line.name;
    modelSel.appendChild(otherOpt);
    modelGroup.style.display = 'block';
}

function onModelChange(modelKey) {
    assessmentData.model = modelKey;
    assessmentData.engine = '';

    var serialGroup = document.getElementById('serialGroup');
    var engineGroup = document.getElementById('engineGroup');
    var serialHelp = document.getElementById('serialHelp');
    var serialResult = document.getElementById('serialDecodeResult');

    // Show serial number field
    serialGroup.style.display = 'block';
    serialResult.style.display = 'none';
    document.getElementById('serialInput').value = '';
    assessmentData.serialNumber = '';
    assessmentData.decodedYear = '';

    var brand = MACHINE_DB.brands[assessmentData.brand];
    if (brand && brand.hasSerialDecode) {
        serialHelp.innerHTML = brand.serialHelpText +
            ' <a href="' + brand.serialHelpUrl + '" target="_blank" rel="noopener" style="color:var(--miller-blue);">See Miller\'s serial number guide &#8599;</a>';
    } else if (brand) {
        serialHelp.textContent = brand.serialHelpText;
    } else {
        serialHelp.textContent = 'Enter the serial number from your machine\'s rating plate.';
    }

    // Populate engine dropdown
    if (modelKey === 'other' || !modelKey) {
        // Show all engines for this brand's line
        populateEngineDropdown(null);
        engineGroup.style.display = 'block';
        return;
    }

    var line = brand.lines[assessmentData.modelLine];
    if (line && line.models[modelKey]) {
        var modelEngines = line.models[modelKey].engines;
        populateEngineDropdown(modelEngines);
        engineGroup.style.display = 'block';

        // Auto-select if only one engine option
        if (modelEngines.length === 1) {
            var engineSel = document.getElementById('engineSelect');
            engineSel.value = modelEngines[0];
            assessmentData.engine = modelEngines[0];
        }
    }
}

function populateEngineDropdown(engineKeys) {
    var sel = document.getElementById('engineSelect');
    sel.innerHTML = '<option value="">Select engine...</option>';

    if (engineKeys && engineKeys.length > 0) {
        // Show specific engines for this model
        for (var i = 0; i < engineKeys.length; i++) {
            var eng = MACHINE_DB.engines[engineKeys[i]];
            if (eng) {
                var opt = document.createElement('option');
                opt.value = engineKeys[i];
                opt.textContent = eng.name + (eng.hp ? ' (' + eng.hp + ' horsepower)' : '');
                sel.appendChild(opt);
            }
        }
    } else {
        // Show all engines
        for (var key in MACHINE_DB.engines) {
            if (key === 'other') continue;
            var eng = MACHINE_DB.engines[key];
            var opt = document.createElement('option');
            opt.value = key;
            opt.textContent = eng.name + (eng.hp ? ' (' + eng.hp + ' horsepower)' : '');
            sel.appendChild(opt);
        }
    }

    // Always add "Other / Not Sure"
    var otherOpt = document.createElement('option');
    otherOpt.value = 'other';
    otherOpt.textContent = 'Other / Not Sure';
    sel.appendChild(otherOpt);
}

function onSerialInput(value) {
    assessmentData.serialNumber = value.trim().toUpperCase();
    var resultEl = document.getElementById('serialDecodeResult');

    var brand = MACHINE_DB.brands[assessmentData.brand];
    if (brand && brand.hasSerialDecode && value.trim().length >= 8) {
        var decoded = decodeMillerSerial(value);
        if (decoded) {
            assessmentData.decodedYear = decoded.year;
            resultEl.textContent = 'Manufactured: ' + decoded.year;
            resultEl.style.display = 'block';
            resultEl.style.color = 'var(--miller-blue)';
        } else {
            assessmentData.decodedYear = '';
            resultEl.textContent = 'Could not decode — check your serial number format (2 letters + 6 digits).';
            resultEl.style.display = 'block';
            resultEl.style.color = '#c0392b';
        }
    } else {
        assessmentData.decodedYear = '';
        resultEl.style.display = 'none';
    }
}

function onEngineChange(engineKey) {
    assessmentData.engine = engineKey;
}

function selectSkill(element, skillName, score) {
    element.closest('.assessment__options').querySelectorAll('.assessment__option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    element.querySelector('input').checked = true;
    assessmentData.skills[skillName] = score;
}

function selectFollowUp(element, questionId, value) {
    element.closest('.assessment__options').querySelectorAll('.assessment__option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    assessmentData.followUp[questionId] = value;
}

// --- Speech-to-Text ---
let recognition = null;
let isRecording = false;

function toggleSpeech() {
    const btn = document.getElementById('speechBtn');
    const status = document.getElementById('speechStatus');
    const textarea = document.getElementById('problemDescription');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        status.textContent = 'Speech recognition is not supported in your browser. Please type your description instead.';
        return;
    }

    if (isRecording) {
        recognition.stop();
        isRecording = false;
        btn.classList.remove('recording');
        btn.innerHTML = '&#127908; Speak Instead';
        status.textContent = '';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        isRecording = true;
        btn.classList.add('recording');
        btn.innerHTML = '&#128308; Stop Recording';
        status.textContent = 'Listening... speak now.';
    };

    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        textarea.value = transcript;
    };

    recognition.onerror = function(event) {
        status.textContent = 'Error: ' + event.error + '. Try typing instead.';
        isRecording = false;
        btn.classList.remove('recording');
        btn.innerHTML = '&#127908; Speak Instead';
    };

    recognition.onend = function() {
        isRecording = false;
        btn.classList.remove('recording');
        btn.innerHTML = '&#127908; Speak Instead';
        status.textContent = 'Recording stopped.';
    };

    recognition.start();
}

// --- Follow-Up Questions (Dynamic) ---
const followUpData = {
    'wont-start': [
        {
            id: 'cranks',
            question: 'Does the engine crank (turn over) when you try to start it?',
            options: [
                { label: 'Yes — cranks but won\'t fire', value: 'cranks-no-fire' },
                { label: 'No — nothing happens at all', value: 'no-crank' },
                { label: 'Clicks but won\'t crank', value: 'clicks' },
                { label: 'Not sure', value: 'unsure' }
            ]
        },
        {
            id: 'battery',
            question: 'What\'s the battery condition?',
            options: [
                { label: 'Battery is good (tested or recently replaced)', value: 'good' },
                { label: 'Battery is weak or old', value: 'weak' },
                { label: 'Battery is dead', value: 'dead' },
                { label: 'Haven\'t checked', value: 'unknown' }
            ]
        }
    ],
    'no-weld-output': [
        {
            id: 'gen-power',
            question: 'Do the auxiliary generator outlets (120V/240V) work?',
            options: [
                { label: 'Yes — generator power works, just no weld output', value: 'gen-works' },
                { label: 'No — both welding and generator outputs are dead', value: 'all-dead' },
                { label: 'Haven\'t checked', value: 'unknown' }
            ]
        },
        {
            id: 'output-type',
            question: 'Is the output completely dead or intermittent?',
            options: [
                { label: 'Completely dead — nothing at all', value: 'dead' },
                { label: 'Intermittent — works sometimes, cuts out', value: 'intermittent' },
                { label: 'Weak — arc is there but no penetration', value: 'weak' }
            ]
        }
    ],
    'erratic-arc': [
        {
            id: 'arc-behavior',
            question: 'How does the arc behave?',
            options: [
                { label: 'Fluctuates — amperage jumps around', value: 'fluctuates' },
                { label: 'Wanders — arc moves unpredictably', value: 'wanders' },
                { label: 'Weak — insufficient penetration', value: 'weak' },
                { label: 'Spits and sputters', value: 'sputter' }
            ]
        }
    ],
    'no-generator': [
        {
            id: 'breaker',
            question: 'Have you checked the circuit breaker on the machine?',
            options: [
                { label: 'Yes — breaker is on, still no power', value: 'breaker-ok' },
                { label: 'Breaker was tripped — I reset it and it works now', value: 'breaker-tripped' },
                { label: 'Breaker was tripped — it trips again immediately', value: 'breaker-trips-again' },
                { label: 'Haven\'t checked', value: 'unknown' }
            ]
        }
    ],
    'overheating': [
        {
            id: 'cooling',
            question: 'Is the cooling system clear?',
            options: [
                { label: 'Yes — fins and air intake are clean', value: 'clean' },
                { label: 'No — it\'s dirty/blocked', value: 'dirty' },
                { label: 'Haven\'t looked', value: 'unknown' }
            ]
        },
        {
            id: 'load',
            question: 'What were you doing when it overheated?',
            options: [
                { label: 'Light welding or just running the generator', value: 'light-load' },
                { label: 'Heavy welding (high amperage, long beads)', value: 'heavy-load' },
                { label: 'It overheats even at idle', value: 'idle' }
            ]
        }
    ],
    'noise': [
        {
            id: 'noise-type',
            question: 'What kind of noise?',
            options: [
                { label: 'Knocking — deep, rhythmic banging from engine', value: 'knocking' },
                { label: 'Grinding — metal on metal sound', value: 'grinding' },
                { label: 'Whining or electrical humming', value: 'whining' },
                { label: 'Rattling — loose parts vibrating', value: 'rattling' },
                { label: 'Squealing — high-pitched when running', value: 'squealing' }
            ]
        }
    ],
    'smoke': [
        {
            id: 'smoke-color',
            question: 'What color is the smoke?',
            options: [
                { label: 'Blue or gray from exhaust', value: 'blue-gray' },
                { label: 'Black from exhaust', value: 'black' },
                { label: 'White from exhaust', value: 'white-exhaust' },
                { label: 'Smoke from the body (not exhaust) — electrical smell', value: 'electrical' },
                { label: 'Smoke from the body — burning oil smell', value: 'oil-burn' }
            ]
        }
    ],
    'leak': [
        {
            id: 'leak-type',
            question: 'What\'s leaking?',
            options: [
                { label: 'Oil — from drain plug or filter area', value: 'oil-simple' },
                { label: 'Oil — from engine seals or gaskets', value: 'oil-seal' },
                { label: 'Fuel — from lines, pump, or tank', value: 'fuel' },
                { label: 'Coolant (if liquid-cooled model)', value: 'coolant' },
                { label: 'Not sure what fluid', value: 'unknown' }
            ]
        }
    ],
    'physical-damage': [
        {
            id: 'damage-type',
            question: 'What kind of damage?',
            options: [
                { label: 'Dented or bent panels', value: 'dents' },
                { label: 'Broken controls, knobs, or switches', value: 'controls' },
                { label: 'Damaged output terminals or receptacles', value: 'terminals' },
                { label: 'Frame damage (bent, cracked, rusted through)', value: 'frame' },
                { label: 'Dropped or rolled over', value: 'dropped' }
            ]
        }
    ],
    'electrical-smell': [
        {
            id: 'smell-source',
            question: 'Where is the smell coming from?',
            options: [
                { label: 'Inside the machine — from the generator end', value: 'generator-end' },
                { label: 'Inside the machine — from the control panel area', value: 'control-area' },
                { label: 'From the wiring or connectors', value: 'wiring' },
                { label: 'Can\'t pinpoint it', value: 'unknown' }
            ]
        }
    ]
};

function generateFollowUpQuestions() {
    const container = document.getElementById('dynamicQuestions');
    const symptom = assessmentData.symptom;
    const questions = followUpData[symptom] || [];

    if (questions.length === 0) {
        container.innerHTML = '<p>No additional questions needed for this symptom. Click "Next" to continue to the skill assessment.</p>';
        return;
    }

    let html = '';
    questions.forEach(q => {
        html += `<div style="margin-bottom:1.5rem;">
            <h4 style="margin-bottom:1rem;">${q.question}</h4>
            <div class="assessment__options">`;
        q.options.forEach(opt => {
            html += `<label class="assessment__option" onclick="selectFollowUp(this, '${q.id}', '${opt.value}')">
                <input type="radio" name="${q.id}" value="${opt.value}">
                <span class="radio-custom"></span>
                <span>${opt.label}</span>
            </label>`;
        });
        html += '</div></div>';
    });
    container.innerHTML = html;
}

// --- Decision Tree: Calculate Repair Tier ---
function calculateRepairTier() {
    const symptom = assessmentData.symptom;
    const followUp = assessmentData.followUp;
    let tier = 3; // Default mid-range
    let difficulty = 5;
    let description = '';
    let whatsInvolved = '';
    let photoSrc = '';
    let photoAlt = '';

    switch (symptom) {
        case 'wont-start':
            if (followUp.battery === 'dead' || followUp.battery === 'weak') {
                tier = 1; difficulty = 2;
                description = 'Battery issue — charge or replace the battery.';
                whatsInvolved = 'This is basic maintenance. Check battery voltage with a multimeter, clean terminals, and charge or replace the battery. Most people can handle this.';
                photoSrc = '../images/diagnostic/fuel-hour-gauge.jpeg';
                photoAlt = 'Basic diagnostic check';
            } else if (followUp.cranks === 'clicks') {
                tier = 2; difficulty = 3;
                description = 'Likely a starter solenoid (Trombetta) or battery connection issue.';
                whatsInvolved = 'The clicking sound usually means the solenoid is trying to engage but can\'t deliver enough current. Check battery cable connections first, then test or replace the Trombetta solenoid.';
                photoSrc = '../images/wiring/trombetta-solenoid.jpeg';
                photoAlt = 'Trombetta solenoid';
            } else if (followUp.cranks === 'no-crank') {
                tier = 3; difficulty = 5;
                description = 'No crank condition — could be starter motor, solenoid, safety switch, or seized engine.';
                whatsInvolved = 'This requires systematic diagnosis: test battery, solenoid, starter motor, safety interlocks, and compression. A seized engine (worst case) means a complete rebuild.';
                photoSrc = '../images/engine/kohler-teardown-bench.jpeg';
                photoAlt = 'Engine teardown on workbench';
            } else if (followUp.cranks === 'cranks-no-fire') {
                tier = 3; difficulty = 5;
                description = 'Engine cranks but won\'t fire — fuel, spark, or compression issue.';
                whatsInvolved = 'Need to check three things: spark (ignition coil, kill switch), fuel delivery (pump, filter, carburetor/injectors), and compression (valves, rings, head gasket). Each branch leads to different repairs.';
                photoSrc = '../images/engine/cylinder-heads-valves-labeled.jpeg';
                photoAlt = 'Cylinder heads with valves';
            } else {
                tier = 3; difficulty = 5;
                description = 'Starting issue — requires diagnosis to determine root cause.';
                whatsInvolved = 'Starting problems have many potential causes. Systematic testing of the electrical, fuel, and mechanical systems is needed.';
                photoSrc = '../images/engine/kohler-in-frame-disassembled.jpeg';
                photoAlt = 'Engine diagnostics';
            }
            break;

        case 'no-weld-output':
            if (followUp['output-type'] === 'dead' && followUp['gen-power'] === 'all-dead') {
                tier = 4; difficulty = 8;
                description = 'Both welding and generator outputs dead — likely stator or main winding failure.';
                whatsInvolved = 'When nothing works electrically, the stator or main windings have likely failed. This means removing and rewinding the stator — hundreds of turns of copper wire through precision-numbered slots. This is specialist work.';
                photoSrc = '../images/stator/stator-being-rewound.jpeg';
                photoAlt = 'Stator being rewound';
            } else if (followUp['output-type'] === 'intermittent') {
                tier = 3; difficulty = 6;
                description = 'Intermittent output — loose connections, failing capacitors, or control board issue.';
                whatsInvolved = 'Intermittent problems often trace to corroded connections, failing capacitors in the output stage, or a control board with intermittent component failures.';
                photoSrc = '../images/electronics/blue-capacitor-bank.jpeg';
                photoAlt = 'Capacitor bank';
            } else {
                tier = 3; difficulty = 6;
                description = 'Weld output failure — control board, exciter circuit, or output stage issue.';
                whatsInvolved = 'Need to test output voltage, exciter circuit, control board, and brushes/slip rings. May require specialized test equipment.';
                photoSrc = '../images/electronics/modern-blue-control-board.jpeg';
                photoAlt = 'Control board';
            }
            break;

        case 'erratic-arc':
            if (followUp['arc-behavior'] === 'fluctuates') {
                tier = 3; difficulty = 5;
                description = 'Fluctuating amperage — control board, potentiometer, or governor issue.';
                whatsInvolved = 'Amperage fluctuations can come from the control board, a worn potentiometer (amperage knob), or engine governor hunting.';
                photoSrc = '../images/electronics/modern-blue-control-board.jpeg';
                photoAlt = 'Control board diagnostics';
            } else {
                tier = 3; difficulty = 5;
                description = 'Arc quality issue — requires output stage diagnosis.';
                whatsInvolved = 'Output quality problems involve testing rectifiers, capacitors, output connections, and ground circuit.';
                photoSrc = '../images/electronics/burned-circuit-traces.jpeg';
                photoAlt = 'Circuit diagnostics';
            }
            break;

        case 'no-generator':
            if (followUp.breaker === 'breaker-tripped') {
                tier = 1; difficulty = 1;
                description = 'Breaker was tripped — now resolved. Monitor for repeat occurrences.';
                whatsInvolved = 'Breakers trip from overload. If it doesn\'t happen again, you\'re fine. If it keeps tripping, there\'s an underlying issue.';
                photoSrc = '../images/complete-units/bobcat-225nt-panel-installed.jpeg';
                photoAlt = 'Control panel';
            } else if (followUp.breaker === 'breaker-trips-again') {
                tier = 3; difficulty = 6;
                description = 'Breaker trips repeatedly — short circuit or winding issue.';
                whatsInvolved = 'A breaker that keeps tripping indicates a short circuit in the output wiring, a shorted capacitor, or a winding fault in the generator.';
                photoSrc = '../images/wiring/damaged-connectors-closeup.jpeg';
                photoAlt = 'Wiring issue';
            } else {
                tier = 3; difficulty = 6;
                description = 'Generator output failure — capacitors, winding, or voltage regulator.';
                whatsInvolved = 'No generator output with the breaker OK points to failed capacitors, winding damage, or voltage regulator failure.';
                photoSrc = '../images/stator/completed-rewind-top-view.jpeg';
                photoAlt = 'Stator windings';
            }
            break;

        case 'overheating':
            if (followUp.cooling === 'dirty') {
                tier = 1; difficulty = 2;
                description = 'Blocked cooling — clean the engine fins and air intake.';
                whatsInvolved = 'Compressed air or a brush to clean debris from the cooling fins and air intake. This is basic maintenance anyone can do.';
                photoSrc = '../images/engine/kohler-ohv-in-frame.jpeg';
                photoAlt = 'Engine cooling system';
            } else if (followUp.load === 'idle') {
                tier = 3; difficulty = 6;
                description = 'Overheating at idle — internal engine issue, governor, or timing problem.';
                whatsInvolved = 'Overheating without load suggests internal problems: stuck thermostat, oil pump failure, governor malfunction, or ignition timing issues.';
                photoSrc = '../images/engine/vtwin-partially-reassembled.jpeg';
                photoAlt = 'Engine internals';
            } else {
                tier = 2; difficulty = 4;
                description = 'Overheating under load — check cooling, fan, and duty cycle.';
                whatsInvolved = 'May be exceeding the machine\'s duty cycle, or the fan/thermal switch could be failing. Clean cooling system first, then check fan operation.';
                photoSrc = '../images/complete-units/bobcat-open-engine-blue.jpeg';
                photoAlt = 'Engine cooling';
            }
            break;

        case 'noise':
            if (followUp['noise-type'] === 'knocking') {
                tier = 5; difficulty = 9;
                description = 'Engine knocking — internal engine damage. Rod bearing, piston slap, or worse.';
                whatsInvolved = 'Knocking is the most serious engine noise. It typically means rod bearing failure, piston slap from a worn cylinder, or connecting rod damage. This requires a complete engine teardown and rebuild. STOP RUNNING THE ENGINE to prevent further damage.';
                photoSrc = '../images/engine/crankshaft-counterweights.jpeg';
                photoAlt = 'Crankshaft and engine internals';
            } else if (followUp['noise-type'] === 'grinding') {
                tier = 4; difficulty = 7;
                description = 'Grinding noise — bearing failure or starter engagement issue.';
                whatsInvolved = 'Grinding usually means a bearing is failing (engine, generator, or starter) or the starter gear is not disengaging properly. Bearing replacement requires significant disassembly.';
                photoSrc = '../images/stator/rotor-assembly-parts.jpeg';
                photoAlt = 'Rotor and bearing assembly';
            } else if (followUp['noise-type'] === 'whining') {
                tier = 3; difficulty = 5;
                description = 'Whining or humming — bearing, transformer lamination, or electrical issue.';
                whatsInvolved = 'Electrical humming can come from transformer laminations vibrating or a bearing beginning to fail. Need to isolate the source.';
                photoSrc = '../images/transformer/inductor-assembly-labeled.jpeg';
                photoAlt = 'Transformer assembly';
            } else {
                tier = 2; difficulty = 3;
                description = 'Rattling or squealing — likely a loose component or belt issue.';
                whatsInvolved = 'Check for loose bolts, shields, or covers. Squealing may indicate a belt or pulley issue. Usually fixable with basic tools.';
                photoSrc = '../images/engine/exhaust-parts-disassembled.jpeg';
                photoAlt = 'Engine components';
            }
            break;

        case 'smoke':
            if (followUp['smoke-color'] === 'electrical') {
                tier = 5; difficulty = 9;
                description = 'STOP THE MACHINE IMMEDIATELY. Electrical smoke means a winding failure, transformer failure, or circuit board burning.';
                whatsInvolved = 'Electrical smoke is the most urgent symptom. Turn off the machine and do not restart it. This could be a stator winding burning out, a transformer core failure, or a control board fire. Running it further will cause catastrophic damage.';
                photoSrc = '../images/transformer/corroded-core-closeup.jpeg';
                photoAlt = 'Transformer failure';
            } else if (followUp['smoke-color'] === 'blue-gray') {
                tier = 4; difficulty = 7;
                description = 'Blue/gray exhaust smoke — oil burning. Worn rings, valve seals, or head gasket.';
                whatsInvolved = 'Oil is getting into the combustion chamber. Causes: worn piston rings, failed valve seals, or a blown head gasket. Each requires significant engine work.';
                photoSrc = '../images/engine/cylinder-bore-scoring.jpeg';
                photoAlt = 'Cylinder bore wear';
            } else if (followUp['smoke-color'] === 'black') {
                tier = 2; difficulty = 4;
                description = 'Black exhaust smoke — running rich. Air filter, choke, or fuel system issue.';
                whatsInvolved = 'Too much fuel or not enough air. Check and replace the air filter first (easiest fix). If that doesn\'t help, check the choke mechanism and carburetor/fuel injection settings.';
                photoSrc = '../images/fuel-system/engine-efi-module.jpeg';
                photoAlt = 'Fuel system';
            } else {
                tier = 3; difficulty = 5;
                description = 'Smoke issue — requires source identification and diagnosis.';
                whatsInvolved = 'Need to determine whether the smoke is combustion-related (exhaust) or electrical (from the body). Each has very different implications.';
                photoSrc = '../images/diagnostic/kohler-software-gauges.jpeg';
                photoAlt = 'Diagnostic analysis';
            }
            break;

        case 'leak':
            if (followUp['leak-type'] === 'oil-simple') {
                tier = 1; difficulty = 2;
                description = 'Oil leak from drain plug or filter — tighten or replace gasket.';
                whatsInvolved = 'Check the drain plug torque and oil filter seal. Replace the drain plug gasket if needed. This is basic maintenance.';
                photoSrc = '../images/maintenance/kohler-pro-oil-filter.jpeg';
                photoAlt = 'Oil and filter';
            } else if (followUp['leak-type'] === 'oil-seal') {
                tier = 3; difficulty = 6;
                description = 'Oil leak from engine seals — seal replacement may require engine pull.';
                whatsInvolved = 'Crankshaft seals, valve cover gaskets, or oil pan gaskets require partial or complete disassembly to replace. Some seals can only be accessed with the engine removed from the frame.';
                photoSrc = '../images/engine/engine-on-chain-hoist.jpeg';
                photoAlt = 'Engine removal for seal access';
            } else if (followUp['leak-type'] === 'fuel') {
                tier = 2; difficulty = 4;
                description = 'Fuel leak — fuel line, pump, or tank issue.';
                whatsInvolved = 'Inspect fuel lines for cracks, check fuel pump connections, and examine the tank for damage. Fuel leaks are a fire hazard — address immediately.';
                photoSrc = '../images/fuel-system/fuel-pump-filter-lines.jpeg';
                photoAlt = 'Fuel system components';
            } else {
                tier = 2; difficulty = 4;
                description = 'Fluid leak — identify the fluid first, then trace the source.';
                whatsInvolved = 'Put cardboard under the machine to catch drips and identify the fluid type by color and smell. Then trace upward to find the source.';
                photoSrc = '../images/diagnostic/fuel-hour-gauge.jpeg';
                photoAlt = 'Diagnostic check';
            }
            break;

        case 'physical-damage':
            if (followUp['damage-type'] === 'dents') {
                tier = 2; difficulty = 3;
                description = 'Dented panels — cosmetic repair or panel replacement.';
                whatsInvolved = 'Body panels can be straightened or replaced. This is mostly cosmetic unless the dent is interfering with airflow or access.';
                photoSrc = '../images/body/panel-miller-blue-greenhouse-01.jpeg';
                photoAlt = 'Body panel repair';
            } else if (followUp['damage-type'] === 'frame') {
                tier = 4; difficulty = 7;
                description = 'Frame damage — welding repair or custom fabrication required.';
                whatsInvolved = 'Frame damage requires welding skills, proper fixtures, and possibly custom fabrication of replacement sections. A rusted-through frame needs new steel.';
                photoSrc = '../images/body/custom-fabricated-sheet-metal.jpeg';
                photoAlt = 'Custom frame fabrication';
            } else if (followUp['damage-type'] === 'dropped') {
                tier = 4; difficulty = 8;
                description = 'Machine was dropped or rolled — comprehensive inspection needed.';
                whatsInvolved = 'A dropped welder may have hidden damage: cracked engine block, broken mounts, bent frame, sheared bolts, internal component damage. Every system needs inspection.';
                photoSrc = '../images/complete-units/welder-stripped-no-panels.jpeg';
                photoAlt = 'Complete teardown inspection';
            } else {
                tier = 2; difficulty = 3;
                description = 'Broken controls or terminals — part replacement.';
                whatsInvolved = 'Broken knobs, switches, and receptacles can usually be replaced with available parts. Straightforward repair with basic tools.';
                photoSrc = '../images/electronics/bobcat-225nt-faceplate-new.jpeg';
                photoAlt = 'New control panel';
            }
            break;

        case 'electrical-smell':
            if (followUp['smell-source'] === 'generator-end') {
                tier = 5; difficulty = 9;
                description = 'Burning smell from generator end — stator or transformer winding failure. STOP THE MACHINE.';
                whatsInvolved = 'Insulation breaking down on stator or transformer windings produces a distinct acrid smell. This is a serious failure that will get worse with continued operation. Requires stator rewind or transformer replacement.';
                photoSrc = '../images/stator/stator-copper-windings.jpeg';
                photoAlt = 'Stator windings';
            } else if (followUp['smell-source'] === 'control-area') {
                tier = 3; difficulty = 6;
                description = 'Burning smell from control area — circuit board or capacitor failure.';
                whatsInvolved = 'A burning component on the control board or a failing capacitor. Board may need component-level repair or replacement.';
                photoSrc = '../images/electronics/burned-circuit-traces.jpeg';
                photoAlt = 'Burned circuit board';
            } else {
                tier = 3; difficulty = 5;
                description = 'Electrical burning smell — needs source identification.';
                whatsInvolved = 'Hot or melting wire insulation, corroded connections with high resistance, or a failing component. Need to locate the source before it becomes a fire.';
                photoSrc = '../images/wiring/damaged-connectors-closeup.jpeg';
                photoAlt = 'Damaged wiring';
            }
            break;

        default:
            tier = 3; difficulty = 5;
            description = 'Unable to determine — please provide more details.';
            whatsInvolved = 'Based on the information provided, we can\'t narrow down the exact issue. Consider calling Jeff directly for a phone consultation.';
            photoSrc = '../images/complete-units/bobcat-modern-blue-01.jpeg';
            photoAlt = 'Miller Bobcat welder';
    }

    assessmentData.repairTier = tier;
    assessmentData.repairDifficulty = difficulty;

    return { tier, difficulty, description, whatsInvolved, photoSrc, photoAlt };
}

// --- Calculate Skill Score ---
function calculateSkillScore() {
    const skills = assessmentData.skills;
    let total = 0;
    let answered = 0;

    for (const key in skills) {
        total += skills[key];
        answered++;
    }

    assessmentData.skillScore = total;

    // Determine skill level
    if (total <= 4) return { level: 'Beginner', score: total, max: 14 };
    if (total <= 8) return { level: 'Handy', score: total, max: 14 };
    if (total <= 11) return { level: 'Experienced', score: total, max: 14 };
    return { level: 'Expert', score: total, max: 14 };
}

// --- Generate Recommendation ---
function getRecommendation(tier, skillLevel) {
    const matrix = {
        'Beginner': { 1: 'diy', 2: 'professional', 3: 'professional', 4: 'professional', 5: 'professional' },
        'Handy': { 1: 'diy', 2: 'diy', 3: 'professional', 4: 'professional', 5: 'professional' },
        'Experienced': { 1: 'diy', 2: 'diy', 3: 'caution', 4: 'professional', 5: 'professional' },
        'Expert': { 1: 'diy', 2: 'diy', 3: 'diy', 4: 'caution', 5: 'professional' }
    };

    return matrix[skillLevel][tier] || 'professional';
}

// --- Generate Results ---
function generateResults() {
    const repair = calculateRepairTier();
    const skill = calculateSkillScore();
    const recommendation = getRecommendation(repair.tier, skill.level);
    assessmentData.recommendation = recommendation;

    // Save assessment completion to localStorage
    localStorage.setItem('assessmentCompleted', 'true');
    // Build machine string for display
    var machineString = '';
    if (typeof buildMachineString === 'function') {
        machineString = buildMachineString(assessmentData);
    }

    localStorage.setItem('assessmentData', JSON.stringify({
        brand: assessmentData.brand,
        modelLine: assessmentData.modelLine,
        model: assessmentData.model,
        customMachine: assessmentData.customMachine || '',
        serialNumber: assessmentData.serialNumber || '',
        decodedYear: assessmentData.decodedYear || '',
        engine: assessmentData.engine || '',
        machineString: machineString,
        symptom: assessmentData.symptom,
        tier: repair.tier,
        difficulty: repair.difficulty,
        description: repair.description,
        skillLevel: skill.level,
        skillScore: skill.score,
        recommendation: recommendation,
        timestamp: new Date().toISOString()
    }));

    // Build results HTML
    let recClass, recIcon, recTitle, recMessage;

    if (recommendation === 'diy') {
        recClass = 'result-card--diy';
        recIcon = '&#9989;';
        recTitle = 'You\'ve Got This';
        recMessage = 'Based on the repair difficulty and your skill level, this is something you can likely handle yourself. Take your time, follow the steps, and don\'t hesitate to reach out if you get stuck.';
    } else if (recommendation === 'caution') {
        recClass = 'result-card--caution';
        recIcon = '&#9888;';
        recTitle = 'Proceed with Caution';
        recMessage = 'You have the skills to attempt this, but the repair is complex enough that things could go wrong. Consider calling Jeff for a quick consultation before diving in — a 5-minute conversation could save you hours of frustration.';
    } else {
        recClass = 'result-card--professional';
        recIcon = '&#128222;';
        recTitle = 'Call Jeff';
        recMessage = 'This repair requires specialized tools, knowledge, or experience that goes beyond what most people have in their shop. This isn\'t a knock on your skills — this is genuinely complex work. Jeff has the expertise and equipment to handle this efficiently.';
    }

    const html = `
        <!-- Machine Identification -->
        ${machineString ? '<div style="background:#e8f1fc;border:1px solid var(--miller-blue);border-radius:8px;padding:1rem 1.25rem;margin-bottom:1.5rem;"><strong style="color:var(--miller-blue);">&#128295; Machine:</strong> ' + machineString + '</div>' : ''}

        <!-- Difficulty Assessment -->
        <div class="assessment__question">
            <h3>Your Repair Assessment</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:1.5rem 0;" class="result-grid">
                <div>
                    <h4>Problem Assessment</h4>
                    <p>${repair.description}</p>
                    <div class="difficulty-meter" style="max-width:100%;margin:1rem 0;">
                        <div class="difficulty-meter__label">
                            <span>Simple</span>
                            <span>Complex</span>
                        </div>
                        <div class="difficulty-meter__bar">
                            <div class="difficulty-meter__fill" data-level="${repair.difficulty}" style="width:${repair.difficulty * 10}%;">
                                ${repair.difficulty}/10
                            </div>
                        </div>
                    </div>
                    <p><strong>Repair Tier:</strong> <span class="tier-badge tier-badge--${repair.tier}">Tier ${repair.tier}</span></p>
                    <p style="margin-top:1rem;"><strong>What's Involved:</strong></p>
                    <p class="text-muted">${repair.whatsInvolved}</p>
                </div>
                <div>
                    <img src="${repair.photoSrc}" alt="${repair.photoAlt}" style="width:100%;border-radius:8px;margin-bottom:1rem;" loading="lazy">
                    <p class="text-muted" style="font-size:0.85rem;text-align:center;">Real photo from our shop — this is what this type of repair looks like inside.</p>
                </div>
            </div>
        </div>

        <!-- Skill Summary -->
        <div class="assessment__question">
            <h4>Your Skill Assessment</h4>
            <p>Skill Score: <strong>${skill.score}</strong> / ${skill.max} — Level: <strong>${skill.level}</strong></p>
            <div class="difficulty-meter" style="max-width:300px;margin:1rem 0;">
                <div class="difficulty-meter__bar">
                    <div class="difficulty-meter__fill" data-level="${Math.min(10, Math.round(skill.score / 14 * 10))}" style="width:${(skill.score / skill.max) * 100}%;background:var(--miller-blue);">
                        ${skill.level}
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommendation -->
        <div class="result-card ${recClass}">
            <div class="result-card__icon">${recIcon}</div>
            <h2>${recTitle}</h2>
            <p style="max-width:600px;margin:1rem auto;">${recMessage}</p>
            ${recommendation !== 'diy' ? `
                <div style="margin-top:2rem;">
                    <p><strong>Ready to get this fixed? Send your info to Jeff now:</strong></p>
                </div>
            ` : `
                <div style="margin-top:1.5rem;">
                    <p class="text-muted">Need parts? Check our <a href="shop.html">Shop</a> for quality replacement components.</p>
                    <p style="margin-top:1rem;"><strong>Want Jeff to know about your situation anyway?</strong></p>
                </div>
            `}
        </div>

        <!-- Send to Jeff Form -->
        <div class="assessment__question" style="margin-top:1.5rem;">
            <h3>&#128233; Send Your Assessment to Jeff</h3>
            <p class="text-muted">Enter your name and phone number. Jeff will receive a text message with your problem details and machine info — so he's prepared when you call.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.5rem 0;" class="notify-grid">
                <div class="form-group" style="margin:0;">
                    <label for="customerName">Your Name</label>
                    <input type="text" id="customerName" placeholder="John Smith" required>
                </div>
                <div class="form-group" style="margin:0;">
                    <label for="customerPhone">Phone Number</label>
                    <input type="tel" id="customerPhone" placeholder="(555) 123-4567" required>
                </div>
            </div>
            <div class="form-group">
                <label for="customerEmail">Email (optional)</label>
                <input type="email" id="customerEmail" placeholder="john@example.com">
            </div>
            <button class="btn btn--primary btn--large" style="width:100%;" id="sendToJeffBtn" onclick="sendAssessmentToJeff()">
                &#128234; Send My Info to Jeff
            </button>
            <div id="sendConfirmation" style="display:none;margin-top:1rem;padding:1rem;background:#f0fff4;border:1px solid #28A745;border-radius:8px;text-align:center;">
                <strong>&#9989; Sent!</strong> Jeff has received your assessment details via text and email. He'll reach out soon.
                <div style="margin-top:1rem;">
                    <div class="contact-line" style="justify-content:center;border:none;padding:0.25rem;">
                        <span class="icon">&#128222;</span>
                        <span>Or call/text Jeff directly: <strong>(830) 660-7795</strong></span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('resultsContainer').innerHTML = html;

    // Show/hide contact button
    const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) {
        contactBtn.style.display = (recommendation !== 'diy') ? 'inline-flex' : 'none';
    }

    goToStep(5);
}

// --- Reset Assessment ---
function resetAssessment() {
    assessmentData = {
        description: '',
        brand: '',
        modelLine: '',
        model: '',
        customMachine: '',
        serialNumber: '',
        decodedYear: '',
        engine: '',
        symptom: '',
        followUp: {},
        skills: {},
        repairTier: 0,
        repairDifficulty: 0,
        skillScore: 0,
        recommendation: ''
    };

    // Clear all selections
    document.querySelectorAll('.assessment__option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.assessment__option input').forEach(inp => inp.checked = false);
    document.getElementById('problemDescription').value = '';

    // Reset machine identification dropdowns
    var brandSel = document.getElementById('brandSelect');
    if (brandSel) brandSel.value = '';
    var lineGroup = document.getElementById('lineGroup');
    if (lineGroup) lineGroup.style.display = 'none';
    var modelGroup = document.getElementById('modelGroup');
    if (modelGroup) modelGroup.style.display = 'none';
    var serialGroup = document.getElementById('serialGroup');
    if (serialGroup) serialGroup.style.display = 'none';
    var engineGroup = document.getElementById('engineGroup');
    if (engineGroup) engineGroup.style.display = 'none';
    var customGroup = document.getElementById('customMachineGroup');
    if (customGroup) customGroup.style.display = 'none';
    var serialInput = document.getElementById('serialInput');
    if (serialInput) serialInput.value = '';
    var serialResult = document.getElementById('serialDecodeResult');
    if (serialResult) serialResult.style.display = 'none';

    goToStep(1);
}

// --- Initialize brand dropdown on page load ---
document.addEventListener('DOMContentLoaded', function() {
    initBrandDropdown();
});

// --- Responsive result grid ---
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .result-grid { grid-template-columns: 1fr !important; }
    }
`;
document.head.appendChild(style);
