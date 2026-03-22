# Jeff Nading Miller Welder Repair — Website Development Log

---

## Session 3 — 2026-03-22

### Business Direction Update (Human insight)

User directed three key changes to the website's positioning:

1. **Remove "Bobcat" from titles/branding only** — Singling out one model in the title limits the business scope. Bobcat references in repair sections, product descriptions, and model lists are fine — Jeff does repair those, just not exclusively.
2. **Remove stator rewinding as a featured service** — Takes too much time; not aligned with the focus on immediate repairs.
3. **Remove complete restorations as a featured service** — Same reasoning; the business focus is on immediate repairs and parts availability, not long-term restoration projects.

**New business focus:** Immediate repairs and parts availability.

### Machine Identification Database (Human insight — 2026-03-22)

User wants to build a machine/engine identification database so that:
1. Customer enters serial number and/or engine type
2. System looks up the machine and auto-populates model details
3. All relevant machine info gets included in the text notification to Jeff
4. Jeff receives a complete picture of the machine before the customer even calls

**User's vision:** "look at all the models available and build a plan for identifying the machine and engine type database so the customer can enter the serial number and the engine type, then all the other info we could add to the text from the database that we make or can find."

This is a significant feature — transforms the assessment from generic symptom reporting into machine-specific diagnostics. Jeff would know the exact machine, its engine, common failure points, and parts availability before picking up the phone. Customers need their welders running again quickly, and parts sourcing is a major pain point in this market.

---

## Session 1 — 2026-03-20

### User Vision (logged from initial conversation)

**Human insight:** Jeff Nading needs a website for his Miller welder repair business that serves two purposes:

1. **Education & Filtering** — Show customers just how complex welder repairs actually are, so they understand the value of professional repair work. The photos from Jeff's shop demonstrate everything from stator rewinding to complete engine rebuilds — this isn't YouTube-fix territory for most problems.

2. **Customer Self-Assessment Tool** — An interactive system where customers can:
   - Describe their problem via text or speech input
   - Receive a quick assessment of repair complexity
   - See a visual graph/meter showing the difficulty level
   - Answer questions about their own skill level and tools
   - Get an honest recommendation: "You can probably handle this" vs "Bring it to Jeff"

3. **"Don't Panic" Button** — Every single page gets a prominent, reassuring button that immediately provides Jeff's contact information. The psychology: customers land on the site worried, we don't want them to leave — we want them to feel like help is one click away.

4. **Time Savings** — The primary business motivation. Jeff spends significant time on phone calls and consultations for problems that could be pre-screened. The website should handle the initial triage so Jeff can focus on paying repair work.

### Reference Images Reviewed (100 photos from Jeff's shop)

The WhatsApp folder contains 100 images documenting Jeff's repair work. Categories identified:

**Complete Units (before/after):**
- Miller Bobcat welder/generators (multiple models including 225 NT)
- Hobart Champion 16,200 series
- Both newer blue/black Bobcats and older blue/gray models
- Finished restorations showing professional-quality results

**Engine Work (Kohler engines):**
- Complete engine teardowns showing crankcase, camshaft, timing gears
- Cylinder head valve work (intake/exhaust valves visible)
- Piston and cylinder bore inspection (scoring visible in some)
- Kohler overhead valve engines disassembled on bench
- Kohler Pro 300-hour extended life synthetic oil and filters used
- Electronic fuel injection components and control modules
- Kohler diagnostic software (ECH 630-650-680-730-740-749 series) showing:
  - Air flow correction factor, desired air-fuel ratio (14.6:1)
  - Block learn memory, short term adaption
  - Injector timing (3 milliseconds)

**Electrical/Generator Components:**
- Stator cores with numbered winding slots (hand-numbered for rewinding)
- Stators in various stages: bare lamination stacks, partially wound, fully wound
- Rotor assemblies with copper windings
- Flywheel/stator assemblies (charging system)
- Multiple flywheels on bench (inventory/comparison)
- Large blue capacitors (capacitor bank for welding output)
- Trombetta solenoids (starter solenoid replacement)

**Circuit Board Work:**
- Modern Miller control boards (blue, surface-mount components, digital displays)
- Older analog control boards (through-hole components)
- Burned/damaged circuit board traces requiring repair
- Complete wiring harnesses removed and laid out

**Transformer/Inductor Work:**
- Severely corroded transformer cores (lamination stacks rusted through)
- Transformer cores with ceramic/fiberglass insulated windings
- Before/after comparison: destroyed core vs rebuilt assembly
- This is clearly one of the most dramatic repair categories

**Body/Frame Work:**
- Body panels stripped, repainted in Miller blue (hanging to dry in greenhouse)
- Bobcat 225 NT replacement face plate/control panel (new)
- Custom fabricated sheet metal parts (base frames, mounting brackets, shields)
- Fuel tanks removed and reinstalled
- Complete frame-off disassembly

**Diagnostic Work:**
- Laptop running Kohler engine diagnostic software
- Multimeter being used for electrical testing
- Wiring inspection showing corroded/damaged connectors

### Key Observations for Website Content

1. **The complexity is visually stunning** — These photos alone tell the story. A stator rewinding photo next to a "should I try this myself?" question would be very effective.

2. **Multiple skill domains required** — Jeff's work spans:
   - Small engine mechanics (Kohler specialist)
   - Electrical engineering (stator winding, circuit board repair)
   - Electronic diagnostics (fuel injection, computer-controlled engines)
   - Sheet metal fabrication
   - Painting and finishing
   - Transformer/inductor theory and construction

3. **Before/after potential** — Several repair sequences could be reconstructed from the photos to show the transformation from broken to restored.

4. **The corroded transformer photos are gold** — Nothing says "don't try this at home" like a transformer core that's rusted into a solid block of iron oxide.

### Decisions Made

- Project will be a web application (technology stack to be determined)
- "Don't Panic" button is a core design element on every page
- Customer problem description will support both text and speech input
- Repair complexity assessment will use a visual difficulty meter/graph
- Skill assessment questionnaire will drive the DIY vs professional recommendation
- Photos from the WhatsApp folder will be used throughout for educational content

### Technology Stack Decision

**Chosen: Plain HTML/CSS/JavaScript** (Option 2)
- User has HTML, CSS, and JavaScript experience
- User wants to be actively involved in development — building together, not receiving a finished product
- Jeff Nading is the domain expert — will be consulted on repair content, difficulty ratings, and business details
- Simpler stack = easier to maintain long-term, cheaper hosting, no build tools required

### Items Flagged for Jeff's Input (to discuss with him)
- Exact contact information (phone, email, address, hours)
- Which Miller/welder models he services (confirm full list)
- Pricing structure (if any should be shown on site)
- Service area / does he do mobile repair?
- His preferred way to receive customer inquiries (call, text, email, form?)
- Review of difficulty tier assignments for each repair type
- Which photos he wants featured vs kept private
- Business name (is it "Jeff Nading Welder Repair" or something else?)

### Next Steps

- Set up project file structure (index.html, styles, scripts, images)
- Build the home page with "Don't Panic" button component
- Start the assessment tool logic in JavaScript
- Organize reference photos into web-ready categories
- Write initial educational content (will need Jeff's review)

---

## Session 2 — 2026-03-21

### Resuming from Session 1

All planning work completed in Session 1. Phase 1 (Foundation) is essentially done — project plan, site architecture, decision tree, skill scoring, and technology stack are all finalized.

**Starting Phase 2: Core Site Build** — Setting up project file structure and building the first pages.

### User Direction (Human insight — logged verbatim)

Key requirements from user:

1. **Organize photos by relevance** — Photos should be categorized and placed where they support the educational content and assessment flow
2. **Autonomous site** — The site should function independently, guiding customers through self-assessment before revealing Jeff's contact information. The "Don't Panic" concept evolves: customers earn access to Jeff by completing the assessment honestly
3. **Honest assessment** — The difficulty rating and recommendation must be truthful based on customer answers, not just a funnel to Jeff. Respect the customer's intelligence
4. **E-commerce capability** — Jeff sells parts/items. The site needs a shop/store section where customers can browse and purchase items Jeff presents for sale
5. **Build it complete** — Plan small tasks, execute each one, deliver a fully functional site. Changes and refinements come after evaluating the working product
6. **Technology:** HTML, CSS, JavaScript, Python if necessary

### Revised Site Architecture

Adding e-commerce changes the scope. Updated page structure:

- **Home** — Hero, value proposition, navigation to all sections
- **What We Fix** — Photo gallery organized by repair category with difficulty indicators
- **Repair Assessment** — Interactive self-assessment tool (the core feature)
- **Shop** — E-commerce section for parts and items Jeff sells
- **Before & After Gallery** — Transformation photos
- **About Jeff** — Credentials, experience (contact info gated behind assessment completion)
- **Contact** — Available after assessment, or via "Don't Panic" which encourages assessment first

### Work Completed (Sessions 2-3, 2026-03-21 to 2026-03-22)

#### Photos Organized
- All 100 WhatsApp photos reviewed, categorized, and copied with descriptive filenames
- 10 categories: complete-units (22), engine (23), stator (14), transformer (9), electronics (7), body (8), wiring (6), diagnostic (5), fuel-system (4), maintenance (2)

#### Files Created
- **index.html** — Home page with hero, service cards, stats bar, shop callout, featured gallery
- **css/styles.css** — 1,496-line comprehensive stylesheet with Miller blue branding, responsive design, all component styles
- **js/main.js** — Navigation, "Don't Panic" panel, lightbox, gallery filtering, utilities
- **js/cart.js** — Shopping cart with localStorage persistence, add/remove/quantity, sidebar display
- **js/assessment.js** — Full decision tree engine, speech-to-text, follow-up questions, skill scoring, recommendation matrix
- **js/shop.js** — Product catalog (12 items), filtering by category, dynamic rendering
- **pages/what-we-fix.html** — 8 repair categories with photos, difficulty badges, educational content, filterable gallery
- **pages/assessment.html** — 5-step assessment flow: describe problem, select symptoms, follow-up questions, skill assessment, results
- **pages/shop.html** — Product grid with category filters, add-to-cart functionality, info section
- **pages/gallery.html** — 5 before/after comparisons plus expanded gallery grid with lightbox
- **pages/about.html** — Jeff's specialties, models serviced, "why professional repair" section
- **pages/contact.html** — Assessment gate (must complete assessment first), contact form, assessment summary display

#### Key Features Implemented
1. **Assessment Gate** — Contact page requires assessment completion before showing Jeff's info
2. **Honest Recommendation Matrix** — 4 skill levels x 5 repair tiers = 20 possible outcomes (do-it-yourself, caution, or call Jeff)
3. **Decision Tree** — 10 symptom categories with follow-up questions, each mapped to specific repair tiers
4. **Shopping Cart** — Full localStorage cart with add/remove/quantity, persists across pages
5. **"Don't Panic" Button** — On every page, encourages assessment completion, shows contact info
6. **Speech-to-Text** — Web Speech API integration for problem description
7. **Responsive Design** — Mobile-first with hamburger navigation, responsive grids
8. **Lightbox Gallery** — Click any photo for full-screen view with caption
9. **Product Catalog** — 12 items across 5 categories, easily editable in shop.js

#### Status: SITE IS FUNCTIONAL
- Local server test: http://localhost:8080
- All 7 pages load and link correctly
- Assessment flow works end-to-end
- Shopping cart persists across pages
- Contact gate checks assessment completion
- All 100 photos accessible through organized folders

#### Next Steps (for evaluation)
- Review with Jeff for content accuracy, pricing, contact info
- Replace placeholder phone/email with real contact information
- Connect contact form to Formspree or similar service
- Set up payment processing for shop (Stripe/PayPal)
- Optimize images for web (compression, proper sizing)
- Domain registration and hosting setup
