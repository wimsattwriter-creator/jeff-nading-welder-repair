/* ============================================
   Welder Repair Services — Notification Module
   Version: 3.0

   HOW IT WORKS:
   ─────────────────────────────────────
   The system sends a full-detail email to the technicians.
   EmailJS is used to route these leads to Gmail.
   EmailJS free tier = 200/month.

   ONE-TIME SETUP:
   ─────────────────────────────────────
   EMAILJS:
   1. emailjs.com → Email Services → your Gmail service exists already
   2. Create a new template:
        To Email:  {{to_email}}
        Subject:   {{subject}}
        Body:      {{message}}
      Save → copy the Template ID
   3. Fill in EMAILJS_* values below (service + public key you have)
   ============================================ */

// ─── CONFIGURATION ───────────────────────────────────────────────────────────

const EMAILJS_PUBLIC_KEY  = 'vwII2XZxByp5fEL9a';
const EMAILJS_SERVICE_ID  = 'service_obmx5jt';
const EMAILJS_TEMPLATE_ID = 'template_4f2ydsh';

const JEFF_EMAIL = 'jlnading@gmail.com';
const USER_EMAIL = 'wimsattwelder@gmail.com'; // ADD YOUR EMAIL HERE

// ─────────────────────────────────────────────────────────────────────────────


// --- Initialize EmailJS ---
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
}


// ─── EMAIL NOTIFICATIONS ────────────────────────────────────────────────────

function sendEmailTous(customerData, recipientEmail) {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded — skipping email path');
        return Promise.resolve();
    }

    const subject = 'New Welder Lead: ' + (customerData.name || 'Unknown');

    const body = [
        'NEW WELDER REPAIR INQUIRY',
        '─────────────────────────',
        'Customer Name: ' + (customerData.name    || '—'),
        'Customer Phone: ' + (customerData.phone   || '—'),
        'Customer Email: ' + (customerData.email   || '—'),
        '',
        'MACHINE INFO:',
        'Machine: ' + (customerData.machineString || customerData.model || '—'),
        'Serial:  ' + (customerData.serialNumber  || '—'),
        'Year:    ' + (customerData.decodedYear    || '—'),
        'Engine:  ' + (customerData.engine         || '—'),
        '',
        'DIAGNOSTIC RESULTS:',
        'Symptom: '  + getSymptomName(customerData.symptom),
        'Repair Tier: '  + (customerData.tier ? 'Tier ' + customerData.tier + ' / 5' : '—'),
        'Recommendation: '  + getRecName(customerData.recommendation),
        '',
        'Customer description:',
        customerData.description || '—',
        '',
        '─────────────────────────',
        'Submitted: ' + new Date().toLocaleString()
    ].join('\n');

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: recipientEmail,
        subject:  subject,
        message:  body,
        // Individual fields for templates that don't use the {{message}} block:
        customer_name:    customerData.name,
        customer_phone:    customerData.phone,
        customer_email:    customerData.email,
        machine:           customerData.machineString || customerData.model,
        serial:            customerData.serialNumber,
        engine:            customerData.engine,
        symptom:           getSymptomName(customerData.symptom),
        tier:              customerData.tier,
        recommendation:    getRecName(customerData.recommendation),
        description:       customerData.description
    }).catch(function(err) {
        console.warn('Email send failed for ' + recipientEmail + ':', err);
    });
}


// ─── MAIN SEND FUNCTION ───────────────────────────────────────────────────────

function sendTextTous(customerData) {
    // Save locally regardless — backup copy always exists
    saveInquiryLocally(customerData);

    const emails = [JEFF_EMAIL];
    if (USER_EMAIL) emails.push(USER_EMAIL);

    // Send emails to all designated recipients
    return Promise.all(emails.map(email => sendEmailTous(customerData, email)));
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
        }
    } catch (e) {
        console.error('Failed to parse assessmentData from localStorage:', e);
    }

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
        console.error('Notification path failed:', err);
        if (sendBtn) {
            sendBtn.textContent = 'Send Failed — Try Again';
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            sendBtn.style.background = '#DC3545';
        }
    });
}


// ─── UTILITIES ────────────────────────────────────────────────────────────────

function saveInquiryLocally(data) {
    try {
        const inquiries = JSON.parse(localStorage.getItem('pendingInquiries') || '[]');
        data.timestamp = new Date().toISOString();
        inquiries.push(data);
        localStorage.setItem('pendingInquiries', JSON.stringify(inquiries));
    } catch(e) {
        // localStorage unavailable
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
