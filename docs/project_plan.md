# Jeff Nading Miller Welder Repair — Website Project Plan

**Created:** 2026-03-20
**Version:** 1.0

---

## 1. Project Overview

Build a website for Jeff Nading's Miller welder/generator repair business that:
- **Educates** customers about repair complexity (using real shop photos)
- **Triages** customer problems before they call Jeff
- **Recommends** whether to attempt DIY or bring it in for professional repair
- **Converts** visitors into customers with ever-present "Don't Panic" contact access

---

## 2. Site Architecture

### 2.1 Pages

| Page | Purpose |
|------|---------|
| **Home** | Hero with Miller Bobcat imagery, value proposition, "Don't Panic" button, overview of services |
| **What We Fix** | Photo gallery organized by repair category (engine, electrical, body, etc.) with difficulty indicators |
| **Repair Assessment** | Interactive tool — customer describes problem, gets difficulty rating and recommendation |
| **About Jeff** | Credentials, experience, photos of shop and completed restorations |
| **Before & After Gallery** | Dramatic transformation photos showing the full scope of restoration work |
| **Contact / Don't Panic** | Full contact form, phone, location, hours, map |

### 2.2 The "Don't Panic" Button

- Present on EVERY page as a fixed/floating element
- Large, friendly, impossible to miss (think: big red "easy" button but reassuring)
- On click: slides out a panel with Jeff's phone number, text option, email, and a brief "we've seen it all — we can help" message
- Design psychology: customers arrive stressed about their broken welder. This button says "relax, you found the right place"

### 2.3 Repair Assessment Tool (Core Feature)

This is the main time-saving feature. Flow:

```
Step 1: DESCRIBE YOUR PROBLEM
  ├── Text input (typed description)
  ├── Speech-to-text input (microphone button)
  └── Optional: upload a photo of the problem

Step 2: PROBLEM CATEGORIZATION (auto + guided)
  The system analyzes the description and asks clarifying questions:
  ├── What model welder? (Bobcat 225, 250, Trailblazer, etc.)
  ├── What's the symptom?
  │   ├── Won't start (engine)
  │   ├── Starts but no weld output
  │   ├── Erratic arc / poor weld quality
  │   ├── No generator power (auxiliary outlets dead)
  │   ├── Overheating / shutting down
  │   ├── Unusual noise (knocking, grinding, whining)
  │   ├── Smoke (exhaust, electrical, from body)
  │   ├── Oil leak / fuel leak / coolant leak
  │   ├── Physical damage (body, controls, connections)
  │   ├── Electrical smell / burning smell
  │   └── Other (describe)
  └── How long has this been happening?

Step 3: DIFFICULTY ASSESSMENT
  System maps the problem to a repair category and displays:
  ├── Visual difficulty meter (1-10 scale, color-coded green→yellow→red)
  ├── What's likely involved (plain English explanation)
  ├── Estimated repair complexity tier:
  │   ├── TIER 1 - Basic Maintenance (oil change, air filter, spark plug)
  │   ├── TIER 2 - Component Swap (solenoid, fuel pump, capacitor)
  │   ├── TIER 3 - Skilled Repair (circuit board work, valve adjustment, carburetor rebuild)
  │   ├── TIER 4 - Major Repair (engine top-end rebuild, stator testing/replacement)
  │   └── TIER 5 - Full Restoration (engine overhaul, stator rewind, transformer core, complete rewire)
  └── Photo examples from Jeff's shop showing what this type of repair looks like inside

Step 4: YOUR SKILL ASSESSMENT
  Questions about the customer's capabilities:
  ├── Do you have experience working on small engines?
  ├── Do you own a multimeter and know how to use it?
  ├── Have you ever done electrical wiring or soldering?
  ├── Do you have access to an engine hoist or lift?
  ├── Are you comfortable reading wiring diagrams?
  ├── Have you worked on generators or welders before?
  └── Do you have a workshop with basic tools?

Step 5: RECOMMENDATION
  Based on problem difficulty + customer skill:
  ├── "You've Got This" — DIY with tips and guidance
  │   (links to relevant maintenance guides)
  ├── "Proceed with Caution" — Possible DIY but risky
  │   (explains what could go wrong, suggests calling Jeff first)
  └── "Call Jeff" — Professional repair recommended
      (auto-populates Don't Panic panel with problem summary ready to send)
```

### 2.4 Educational Content Sections

For each repair category, create a page section showing:
- **What it looks like** inside the machine (Jeff's photos)
- **Why it fails** (plain English explanation)
- **What the repair involves** (step count, tools needed, skill required)
- **Difficulty rating** with visual meter
- **Common mistakes** people make trying it themselves

Categories based on the photos:

1. **Engine Mechanical** — Kohler engine rebuilds, piston/cylinder work, valve jobs, timing, oil system
2. **Charging System / Stator** — Stator rewinding, flywheel removal, charging coil replacement
3. **Welding Output / Transformer** — Transformer core replacement, output rectifiers, capacitor banks
4. **Control Electronics** — Circuit boards (analog and digital), burned traces, component-level repair
5. **Fuel System** — Fuel pump, injectors, electronic fuel injection diagnostics, carburetor
6. **Electrical Wiring** — Wiring harnesses, connectors, solenoids, switches
7. **Body and Frame** — Panel replacement, painting, frame fabrication, fuel tank
8. **Routine Maintenance** — Oil changes, filters, spark plugs, belt inspection

---

## 3. Technology Stack (Recommended)

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Framework | Vanilla HTML/CSS/JavaScript | Simple, maintainable, user has experience with these |
| Speech Input | Web Speech API (browser native) | No external service needed for speech-to-text |
| Image Optimization | Manual optimization + lazy loading | Standard img tags with loading="lazy" |
| Hosting | Netlify or GitHub Pages | Free tier, static site hosting, easy deployment |
| Contact Form | Formspree or Netlify Forms | No backend needed, emails go directly to Jeff |
| Assessment Logic | Client-side JavaScript | Decision tree runs in browser, no server needed |

**Decision (2026-03-20):** Plain HTML/CSS/JavaScript chosen. User has experience with these technologies and wants to be hands-on in development. Jeff Nading will be consulted on all business/repair content as the domain expert.

---

## 4. Photo Organization Plan

Rename and organize the 100 WhatsApp images into categories:

```
/images/
  /engine/
    kohler-teardown-01.jpg
    piston-cylinder-bore.jpg
    cylinder-head-valves.jpg
    camshaft-timing-gears.jpg
    engine-diagnostic-screen.jpg
    ...
  /stator/
    bare-lamination-stack.jpg
    numbered-winding-slots.jpg
    partially-wound-stator.jpg
    completed-stator-rewind.jpg
    flywheel-stator-assembly.jpg
    ...
  /transformer/
    corroded-core-before.jpg
    corroded-core-closeup.jpg
    new-core-assembly.jpg
    ...
  /electronics/
    modern-control-board.jpg
    analog-control-board.jpg
    burned-circuit-traces.jpg
    capacitor-bank.jpg
    ...
  /body/
    painted-panels-drying.jpg
    new-faceplate-225nt.jpg
    custom-fabrication.jpg
    ...
  /complete-units/
    bobcat-before-restoration.jpg
    bobcat-after-restoration.jpg
    hobart-champion.jpg
    ...
  /fuel-system/
    fuel-pump-replacement.jpg
    efi-components.jpg
    ...
  /wiring/
    harness-layout.jpg
    damaged-connectors.jpg
    solenoid-replacement.jpg
    ...
```

---

## 5. Repair Decision Tree (Assessment Logic)

The core intelligence of the site. Maps symptoms to difficulty tiers:

### Engine Won't Start
- Is the battery dead/weak? → Tier 1 (charge/replace battery)
- Does it crank but not fire? → Check fuel, spark
  - No spark → Tier 2-3 (ignition coil, stator charging, kill switch)
  - Has spark, no fuel → Tier 2 (fuel pump, filter, solenoid)
  - Has spark and fuel → Tier 3 (compression, timing, electronic fuel injection)
- No crank at all → Tier 2 (starter, solenoid) or Tier 4 (seized engine)
- Clicks but won't crank → Tier 1-2 (battery connections, Trombetta solenoid)

### Starts But No Weld Output
- Check output terminals first → Tier 1 (loose connections)
- Output voltage present but weak → Tier 3 (control board, exciter)
- No output voltage at all → Tier 3-4 (stator, brushes, control board)
- Intermittent output → Tier 3 (loose internal connections, failing capacitors)

### Erratic Arc / Poor Weld Quality
- Fluctuating amperage → Tier 3 (control board, potentiometer)
- Arc wanders → Tier 2-3 (ground connection, output rectifiers)
- Insufficient penetration → Tier 2 (settings) or Tier 3 (output components)

### No Generator Power (Auxiliary Outlets)
- Breaker tripped → Tier 1 (reset breaker)
- Breaker good, no power → Tier 3 (capacitors, winding, control board)
- Power but wrong voltage → Tier 3-4 (voltage regulator, stator winding)

### Overheating / Shutting Down
- Dirty/blocked cooling → Tier 1 (clean fins, air intake)
- Clean but still overheating → Tier 3 (internal issue, governor, timing)
- Thermal shutdown → Tier 2-3 (thermal switch, fan, load management)

### Unusual Noises
- Knocking → Tier 4-5 (internal engine damage, rod bearing, piston slap)
- Grinding → Tier 3-4 (bearing failure, starter engagement)
- Whining/electrical hum → Tier 3 (bearing, transformer lamination)

### Smoke
- Blue/gray exhaust smoke → Tier 3-4 (rings, valve seals, head gasket)
- Black exhaust smoke → Tier 2-3 (rich fuel mixture, choke, air filter)
- White/electrical smoke from body → Tier 3-5 (STOP IMMEDIATELY — winding failure, transformer, board)

### Oil/Fuel/Coolant Leaks
- Oil from drain plug/filter → Tier 1 (tighten, replace gasket)
- Oil from engine seals → Tier 3-4 (seal replacement, may require engine pull)
- Fuel leak → Tier 2-3 (fuel line, pump, tank, carburetor)

### Physical/Cosmetic Damage
- Dented panels → Tier 2 (panel replacement, not structural)
- Broken controls/switches → Tier 2 (parts replacement)
- Frame damage → Tier 3-4 (welding, fabrication)
- Rusted-through frame → Tier 4-5 (custom fabrication required)

---

## 6. Customer Skill Scoring

Score each answer 0-2:

| Question | 0 points | 1 point | 2 points |
|----------|----------|---------|----------|
| Small engine experience | None | Changed oil/filters | Rebuilt or repaired |
| Multimeter ownership | No | Own but unsure | Use regularly |
| Electrical/soldering | Never | Basic wiring | Soldering, reading schematics |
| Hoist/lift access | No | Improvised | Proper equipment |
| Wiring diagrams | Can't read them | Somewhat | Comfortable |
| Welder/generator experience | None | Basic operation | Maintenance/repair |
| Workshop/tools | Minimal | Basic set | Well-equipped shop |

**Score interpretation:**
- 0-4: Beginner — Tier 1 repairs only, everything else goes to Jeff
- 5-8: Handy — Can attempt Tier 1-2, caution on Tier 3
- 9-11: Experienced — Can attempt Tier 1-3 with guidance
- 12-14: Expert — Can attempt most repairs, Jeff for Tier 5

**Recommendation matrix:**

| | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 |
|---|--------|--------|--------|--------|--------|
| Beginner | DIY with guide | Call Jeff | Call Jeff | Call Jeff | Call Jeff |
| Handy | DIY | DIY with caution | Call Jeff | Call Jeff | Call Jeff |
| Experienced | DIY | DIY | DIY with caution | Call Jeff | Call Jeff |
| Expert | DIY | DIY | DIY | DIY with caution | Call Jeff |

---

## 7. Development Phases

### Phase 1: Foundation (Current)
- [x] Review reference photos and document repair categories
- [x] Create project plan and site architecture
- [x] Design repair decision tree
- [x] Define customer skill scoring system
- [ ] Choose and finalize technology stack
- [ ] Set up project structure and development environment

### Phase 2: Core Site Build
- [ ] Build page layouts (Home, What We Fix, About, Contact, Gallery)
- [ ] Implement "Don't Panic" floating button component
- [ ] Create responsive navigation
- [ ] Optimize and organize photos for web use
- [ ] Write educational content for each repair category

### Phase 3: Assessment Tool
- [ ] Build the problem description input (text + speech)
- [ ] Implement the symptom questionnaire flow
- [ ] Build the difficulty meter/graph visual component
- [ ] Implement customer skill assessment questionnaire
- [ ] Code the recommendation engine (decision tree + skill matrix)
- [ ] Connect recommendation output to "Don't Panic" contact panel

### Phase 4: Content & Polish
- [ ] Before/after photo sequences
- [ ] Educational captions on all repair category photos
- [ ] Search engine optimization basics (meta tags, image alt text, page titles)
- [ ] Mobile responsiveness testing
- [ ] Performance optimization (image compression, lazy loading)

### Phase 5: Launch
- [ ] Domain selection and registration
- [ ] Hosting setup
- [ ] Contact form testing
- [ ] Final review with Jeff
- [ ] Go live

---

## 8. Design Notes

### Color Palette (derived from Miller branding)
- **Miller Blue:** #005DAA (primary)
- **Black:** #1a1a1a (text, accents)
- **White:** #ffffff (backgrounds)
- **Warning Yellow:** #FFC107 (caution indicators)
- **Danger Red:** #DC3545 (high difficulty, "call Jeff" recommendations)
- **Success Green:** #28A745 (low difficulty, "you've got this")

### Typography
- Clean, industrial feel
- Highly readable on mobile (many customers will be in the field with a broken welder)
- Large touch targets for the assessment tool

### Tone of Voice
- Knowledgeable but not condescending
- Reassuring — "we've seen this before, we can fix it"
- Honest about difficulty — don't scare people, but don't sugarcoat
- Respect for the DIY customer while being clear about risks

---

## 9. Competitive Advantage

Most welder repair shops have either:
- No website at all
- A basic business listing with phone number
- A generic "services" page with stock photos

Jeff's site will be unique because:
1. **Real photos** of actual repairs (not stock imagery)
2. **Interactive assessment** that no competitor offers
3. **Educational approach** that builds trust before the first phone call
4. **"Don't Panic" UX** that addresses the emotional state of the customer
5. **Honest skill assessment** that respects the customer's intelligence
