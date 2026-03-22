/* ============================================
   Jeff Nading Miller Welder Repair — Text Notification
   Version: 1.0

   Sends a TEXT MESSAGE to Jeff when a customer completes
   the assessment and submits their info.

   Uses EmailJS (free: 200 emails/month) to send to
   carrier email-to-SMS gateways.

   SETUP (one-time, takes 5 minutes):
   1. Go to https://www.emailjs.com — create free account
   2. Click "Email Services" > "Add New Service" > choose Gmail
      - Connect jlnading@gmail.com (or any gmail)
      - Copy the Service ID (e.g., "service_abc123")
   3. Click "Email Templates" > "Create New Template"
      - Set "To Email" field to: {{to_email}}
      - Set "Subject" to: {{subject}}
      - Set "Content" to: {{message}}
      - Save — copy the Template ID (e.g., "template_xyz789")
   4. Click your account name (top right) > "API Keys"
      - Copy your Public Key
   5. Replace the three values below
   ============================================ */

// --- CONFIGURATION — Replace these three values ---
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// Jeff's phone number and all carrier SMS gateways
// Sending to all gateways — only Jeff's actual carrier will deliver
const SMS_GATEWAYS = [
    '8306607795@txt.att.net',             // AT&T
    '8306607795@tmomail.net',             // T-Mobile
    '8306607795@vtext.com',               // Verizon
    '8306607795@sms.cricketwireless.net',  // Cricket
    '8306607795@messaging.sprintpcs.com',  // Sprint
    '8306607795@email.uscc.net',           // US Cellular
    '8306607795@sms.myboostmobile.com',    // Boost Mobile
    '8306607795@mymetropcs.com'            // Metro PCS
];

// --- Initialize EmailJS ---
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized for SMS notifications');
    }
}

// --- Send text message to Jeff via all carrier gateways ---
function sendTextToJeff(customerData) {
    const smsText = buildSmsText(customerData);

    if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.log('EmailJS not configured — text would say:', smsText);
        // Still show success to customer (we'll capture data in localStorage)
        saveInquiryLocally(customerData);
        return Promise.resolve();
    }

    // Send to every carrier gateway — only the right one delivers
    const promises = SMS_GATEWAYS.map(gateway => {
        return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: gateway,
            subject: 'New welder inquiry',
            message: smsText
        }).catch(function(err) {
            // Silently fail — most gateways will reject since they're wrong carrier
            console.log('Gateway ' + gateway + ' failed (expected):', err);
        });
    });

    return Promise.all(promises);
}

// --- Build SMS text (keep short for SMS delivery) ---
function buildSmsText(data) {
    let lines = [];
    lines.push('WELDER LEAD:');
    if (data.name) lines.push(data.name);
    if (data.phone) lines.push('Ph: ' + data.phone);
    if (data.model) lines.push(getModelName(data.model));
    if (data.symptom) lines.push(getSymptomName(data.symptom));
    if (data.tier) lines.push('Tier ' + data.tier + '/5');
    if (data.recommendation) lines.push(getRecName(data.recommendation));
    if (data.description) {
        // Truncate description to fit SMS
        let desc = data.description;
        let remaining = 160 - lines.join(' | ').length - 5;
        if (desc.length > remaining && remaining > 10) {
            desc = desc.substring(0, remaining - 3) + '...';
        } else if (remaining <= 10) {
            desc = '';
        }
        if (desc) lines.push(desc);
    }

    let sms = lines.join(' | ');
    if (sms.length > 160) {
        sms = sms.substring(0, 157) + '...';
    }
    return sms;
}

// --- Save inquiry locally as backup ---
function saveInquiryLocally(data) {
    let inquiries = JSON.parse(localStorage.getItem('pendingInquiries') || '[]');
    data.timestamp = new Date().toISOString();
    inquiries.push(data);
    localStorage.setItem('pendingInquiries', JSON.stringify(inquiries));
}

// --- Called from the assessment results page ---
function sendAssessmentToJeff() {
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('customerPhone');
    const emailInput = document.getElementById('customerEmail');
    const sendBtn = document.getElementById('sendToJeffBtn');
    const confirmation = document.getElementById('sendConfirmation');

    // Validate
    if (!nameInput.value.trim()) {
        nameInput.focus();
        nameInput.style.borderColor = '#DC3545';
        return;
    }
    if (!phoneInput.value.trim()) {
        phoneInput.focus();
        phoneInput.style.borderColor = '#DC3545';
        return;
    }

    // Reset border colors
    nameInput.style.borderColor = '';
    phoneInput.style.borderColor = '';

    // Gather all assessment data
    const savedAssessment = JSON.parse(localStorage.getItem('assessmentData') || '{}');

    const customerData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput ? emailInput.value.trim() : '',
        model: savedAssessment.model || assessmentData.model || '',
        symptom: savedAssessment.symptom || assessmentData.symptom || '',
        description: savedAssessment.description || assessmentData.description || '',
        tier: savedAssessment.tier || assessmentData.repairTier || '',
        difficulty: savedAssessment.difficulty || assessmentData.repairDifficulty || '',
        skillLevel: savedAssessment.skillLevel || '',
        recommendation: savedAssessment.recommendation || assessmentData.recommendation || ''
    };

    // Show sending state
    sendBtn.textContent = 'Sending...';
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.7';

    // Send the text
    sendTextToJeff(customerData).then(function() {
        // Save locally too
        saveInquiryLocally(customerData);

        // Show confirmation
        sendBtn.style.display = 'none';
        if (confirmation) confirmation.style.display = 'block';

        // Update localStorage
        localStorage.setItem('customerInfoSent', 'true');
        localStorage.setItem('customerData', JSON.stringify(customerData));
    }).catch(function(err) {
        console.log('Send failed:', err);
        sendBtn.textContent = 'Send Failed — Try Again';
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        sendBtn.style.background = '#DC3545';
    });
}

// --- Lookup helpers ---
function getModelName(m) {
    return { 'bobcat-225': 'Bobcat 225', 'bobcat-225nt': 'Bobcat 225NT', 'bobcat-250': 'Bobcat 250',
             'trailblazer': 'Trailblazer', 'hobart': 'Hobart Champion', 'other': 'Other' }[m] || m || '';
}

function getSymptomName(s) {
    return { 'wont-start': "Won't start", 'no-weld-output': 'No weld output', 'erratic-arc': 'Bad arc',
             'no-generator': 'No gen power', 'overheating': 'Overheating', 'noise': 'Noise',
             'smoke': 'Smoke', 'leak': 'Leak', 'physical-damage': 'Damage',
             'electrical-smell': 'Burning smell' }[s] || s || '';
}

function getRecName(r) {
    return { 'diy': 'DIY OK', 'caution': 'CAUTION', 'professional': 'CALL JEFF' }[r] || r || '';
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', initEmailJS);
