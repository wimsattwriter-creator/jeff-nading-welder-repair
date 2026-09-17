/* ============================================
   Welder Repair Services — Notification Module
   Version: 2.0

   HOW IT WORKS (two independent paths):
   ─────────────────────────────────────
   PATH 1 — EMAIL (EmailJS → our Gmail)
     Sends a full-detail email to jlnading@gmail.com.
     This works reliably. EmailJS free tier = 200/month.

   PATH 2 — SMS (Make.com Webhook → Twilio → our phone)
     Posts JSON to a Make.com webhook URL.
     Make.com calls Twilio, Twilio delivers the SMS.
     No credentials are exposed in client code.
     Make.com free tier = 1,000 ops/month.

   ONE-TIME SETUP (15 minutes total):
   ─────────────────────────────────────
   EMAILJS (email path):
   1. emailjs.com → Email Services → your Gmail service exists already
   2. Create a new template:
        To Email:  {{to_email}}
        Subject:   {{subject}}
        Body:      {{message}}
      Save → copy the Template ID
   3. Fill in EMAILJS_* values below (service + public key you have)

   MAKE.COM (SMS path):
   1. make.com → Create account (free)
   2. New Scenario → search "Webhooks" → "Custom Webhook" as trigger
   3. Click "Add" → name it "welder-lead" → copy the webhook URL
   4. Add a second module: search "Twilio" → "Send an SMS"
        From: your Twilio number
        To:   our cell (8306607795)
        Body: {{1.message}}   ← maps the "message" field from the webhook
   5. Turn the scenario ON
   6. Paste the webhook URL into MAKE_WEBHOOK_URL below

   TWILIO (needed by Make.com):
   1. twilio.com → free trial account (no credit card for trial)
   2. Trial gives you ~$15 credit — enough for ~1,900 texts
   3. Add credentials inside Make.com's Twilio module (never in this file)
   ============================================ */

// ─── CONFIGURATION ───────────────────────────────────────────────────────────

const EMAILJS_PUBLIC_KEY  = 'vwII2XZxByp5fEL9a';
const EMAILJS_SERVICE_ID  = 'service_obmx5jt';
const EMAILJS_TEMPLATE_ID = 'template_4f2ydsh';   // UPDATE: use a template that sends to {{to_email}}

const JEFF_EMAIL = 'jlnading@gmail.com';           // Real email — works reliably

// Paste your Make.com webhook URL here after setup:
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/3oy1e639lmnmv8qgp1i6wg5j58fpga77';  // e.g. https://hook.us1.make.com/abc123xyz

// ─────────────────────────────────────────────────────────────────────────────


// --- Initialize EmailJS ---
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
}


// ─── PATH 1: EMAIL TO JEFF ────────────────────────────────────────────────────

function sendEmailTous(customerData) {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded — skipping email path');
        return Promise.resolve();
    }

    const subject = 'New Welder Lead: ' + (customerData.name || 'Unknown');

    const body = [
        'NEW WELDER REPAIR INQUIRY',
        '─────────────────────────',
        'Name:    ' + (customerData.name    || '—'),
        'Phone:   ' + (customerData.phone   || '—'),
        'Email:   ' + (customerData.email   || '—'),
        '',
        'Machine: ' + (customerData.machineString || customerData.model || '—'),
        'Serial:  ' + (customerData.serialNumber  || '—'),
        'Year:    ' + (customerData.decodedYear    || '—'),
        'Engine:  ' + (customerData.engine         || '—'),
        '',
        'Symptom: '  + getSymptomName(customerData.symptom),
        'Tier:    '  + (customerData.tier ? 'Tier ' + customerData.tier + ' / 5' : '—'),
        'Rec:     '  + getRecName(customerData.recommendation),
        '',
        'Customer description:',
        customerData.description || '—',
        '',
        '─────────────────────────',
        'Submitted: ' + new Date().toLocaleString()
    ].join('\n');

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: JEFF_EMAIL,
        subject:  subject,
        message:  body
    }).catch(function(err) {
        console.warn('Email send failed:', err);
        // Don't throw — SMS path can still succeed
    });
}


// ─── PATH 2: WEBHOOK → MAKE.COM → TWILIO SMS ─────────────────────────────────

function sendSmsViaWebhook(customerData) {
    if (!MAKE_WEBHOOK_URL || MAKE_WEBHOOK_URL === 'YOUR_MAKE_WEBHOOK_URL') {
        console.log('Make.com webhook not configured yet — skipping SMS path');
        return Promise.resolve();
    }

    const smsText = buildSmsText(customerData);

    // POST JSON to Make.com webhook
    return fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            // PRIMARY: The pre-formatted natural language summary
            // Map this one variable in Make.com to the Twilio body
            message:     smsText,
            full_summary: smsText,

            // DATA: Original values (without labels) for flexible mapping
            name:        customerData.name         || '',
            phone:       customerData.phone        || '',
            machine:     customerData.machineString || customerData.model || '',
            symptom:     getSymptomName(customerData.symptom) || '',
            tier:        customerData.tier          || '',
            description: customerData.description  || '',
            recommendation: customerData.recommendation || ''
        })
    }).catch(function(err) {
        console.warn('Webhook call failed:', err);
    });
}


// ─── MAIN SEND FUNCTION ───────────────────────────────────────────────────────

function sendTextTous(customerData) {
    // Save locally regardless — backup copy always exists
    saveInquiryLocally(customerData);

    // Fire both paths in parallel — one failing doesn't block the other
    return Promise.all([
        sendEmailTous(customerData),
        sendSmsViaWebhook(customerData)
    ]);
}


// ─── FORM HANDLER (called from assessment results page) ──────────────────────

function sendAssessmentTous() {
    const nameInput = document.getElementById('name') || document.getElementById('customerName');
    const phoneInput = document.getElementById('phone') || document.getElementById('customerPhone');
    const emailInput = document.getElementById('email') || document.getElementById('customerEmail');
    const sendBtn = document.getElementById('sendTousBtn');
    const confirmation = document.getElementById('sendConfirmation');

    // Validate required fields
    let valid = true;
    if (!nameInput || !nameInput.value || !nameInput.value.trim()) {
        if (nameInput) {
            nameInput.focus();
            nameInput.style.borderColor = '#DC3545';
        }
        valid = false;
    } else if (nameInput) {
        nameInput.style.borderColor = '';
    }
    if (!phoneInput || !phoneInput.value || !phoneInput.value.trim()) {
        if (valid && phoneInput) phoneInput.focus();
        if (phoneInput) phoneInput.style.borderColor = '#DC3545';
        valid = false;
    } else if (phoneInput) {
        phoneInput.style.borderColor = '';
    }
    if (!valid) return;

    // Pull saved assessment data from localStorage
    let saved = {};
    try {
        const stored = localStorage.getItem('assessmentData');
        if (stored) {
            saved = JSON.parse(stored);
            console.log('Loaded assessment data from localStorage:', saved);
        } else {
            console.warn('No assessmentData found in localStorage');
        }
    } catch (e) {
        console.error('Failed to parse assessmentData from localStorage:', e);
    }

    // Fallback to global object if we are on the assessment page
    const currentData = (typeof assessmentData !== 'undefined' && Object.keys(assessmentData).length > 0) ? assessmentData : saved;

    const customerData = {
        name:          nameInput ? nameInput.value.trim() : '',
        phone:         phoneInput ? phoneInput.value.trim() : '',
        email:         emailInput ? emailInput.value.trim() : '',
        model:         currentData.model         || currentData.machineModel || '',
        machineString:  currentData.machineString || (typeof buildMachineString === 'function' ? buildMachineString(currentData) : ''),
        serialNumber:   currentData.serialNumber  || '',
        decodedYear:    currentData.decodedYear   || '',
        engine:         currentData.engine        || '',
        symptom:        currentData.symptom       || '',
        description:    currentData.description   || '',
        tier:           currentData.tier          || currentData.repairTier || '',
        difficulty:     currentData.difficulty    || currentData.repairDifficulty || '',
        skillLevel:     currentData.skillLevel    || '',
        recommendation:  currentData.recommendation || ''
    };

    // DEBUG: Let's see exactly what is being sent.
    console.log('DEBUG: Final customerData to be sent:', customerData);

    // Show loading state
    if (sendBtn) {
        sendBtn.textContent = 'Sending…';
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.7';
    }

    sendTextTous(customerData).then(function() {
        localStorage.setItem('customerInfoSent', 'true');
        localStorage.setItem('customerData', JSON.stringify(customerData));

        if (sendBtn) sendBtn.style.display = 'none';
        if (confirmation) confirmation.style.display = 'block';
    }).catch(function(err) {
        console.error('All notification paths failed:', err);
        if (sendBtn) {
            sendBtn.textContent = 'Send Failed — Try Again';
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            sendBtn.style.background = '#DC3545';
        }
    });
}


// ─── UTILITIES ────────────────────────────────────────────────────────────────

function buildSmsText(data) {
    if (!data.name && !data.phone && !data.machineString && !data.model) {
        return 'New Welder Lead: No customer or machine data provided.';
    }

    const parts = [];
    if (data.name)            parts.push(data.name);
    if (data.phone)           parts.push(`(${data.phone})`);

    const machine = data.machineString || (data.model ? getModelName(data.model) : 'Unknown Machine');
    parts.push(machine);

    const symptom = getSymptomName(data.symptom);
    if (symptom)              parts.push(symptom);

    if (data.tier)            parts.push(`Tier ${data.tier}`);
    if (data.recommendation)  parts.push(getRecName(data.recommendation));

    return 'Welder Lead: ' + parts.join(' - ');
}

function saveInquiryLocally(data) {
    try {
        const inquiries = JSON.parse(localStorage.getItem('pendingInquiries') || '[]');
        data.timestamp = new Date().toISOString();
        inquiries.push(data);
        localStorage.setItem('pendingInquiries', JSON.stringify(inquiries));
    } catch(e) {
        // localStorage unavailable — not critical
    }
}

function getModelName(m) {
    if (typeof getModelDisplayName === 'function') {
        const dbName = getModelDisplayName(m);
        if (dbName && dbName !== m) return dbName;
    }
    const map = {
        'bobcat-225': 'Bobcat 225', 'bobcat-225nt': 'Bobcat 225NT',
        'bobcat-250': 'Bobcat 250', 'trailblazer': 'Trailblazer',
        'hobart': 'Hobart Champion', 'other': 'Other'
    };
    return map[m] || m || '';
}

function getSymptomName(s) {
    const map = {
        'wont-start': "Won't start", 'no-weld-output': 'No weld output',
        'erratic-arc': 'Bad arc', 'no-generator': 'No gen power',
        'overheating': 'Overheating', 'noise': 'Noise',
        'smoke': 'Smoke', 'leak': 'Leak',
        'physical-damage': 'Damage', 'electrical-smell': 'Burning smell'
    };
    return map[s] || s || '';
}

function getRecName(r) {
    return { 'diy': 'DIY OK', 'caution': 'CAUTION', 'professional': 'CALL TECHNICIAN' }[r] || r || '';
}


// --- Initialize ---
document.addEventListener('DOMContentLoaded', initEmailJS);
