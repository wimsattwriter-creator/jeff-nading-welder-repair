/* ============================================
   Welder Repair Services — Machine Database
   Version: 1.0

   Machine identification database with serial
   number decoder and engine type lookup.
   ============================================ */

// --- Machine Database ---
const MACHINE_DB = {
    brands: {
        miller: {
            name: 'Miller',
            hasSerialDecode: true,
            serialHelpUrl: 'https://www.millerwelds.com/support/serial-number-chart',
            serialHelpText: 'The serial number is on a rating label on the back or bottom of your machine.',
            lines: {
                bobcat: {
                    name: 'Bobcat',
                    models: {
                        'bobcat-200-airpak': {
                            name: 'Bobcat 200 Air Pak',
                            engines: ['kohler-ch730', 'kubota-diesel'],
                            years: '2010s-present',
                            notes: 'Air compressor and battery charge/crank assist'
                        },
                        'bobcat-265-airpak': {
                            name: 'Bobcat 265 Air Pak',
                            engines: ['kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Built-in 30 cubic feet per minute air compressor'
                        },
                        'bobcat-3-phase': {
                            name: 'Bobcat 3 Phase',
                            engines: ['kohler-ch740'],
                            years: '2000s-present',
                            notes: 'Specialized for 480V three-phase pivot irrigation'
                        },
                        'bobcat-260': {
                            name: 'Bobcat 260',
                            engines: ['kohler-ch740', 'kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Current production, 260A DC'
                        },
                        'bobcat-265': {
                            name: 'Bobcat 265',
                            engines: ['kohler-ch740', 'kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Current production, 265A DC'
                        }
                    }
                },
                trailblazer: {
                    name: 'Trailblazer',
                    models: {
                        'trailblazer-275': {
                            name: 'Trailblazer 275',
                            engines: ['kohler-ch740', 'kohler-ch730'],
                            years: '2010s-present',
                            notes: '275A at 100% duty cycle, 12kW peak'
                        },
                        'trailblazer-302': {
                            name: 'Trailblazer 302',
                            engines: ['kohler-ch740', 'kubota-diesel'],
                            years: '2000s-2010s',
                            notes: '300A, gas or diesel options'
                        },
                        'trailblazer-325': {
                            name: 'Trailblazer 325',
                            engines: ['kohler-ch740', 'kubota-diesel'],
                            years: '2010s-present',
                            notes: '325A at 100% duty cycle, 12kW peak'
                        },
                        'trailblazer-330': {
                            name: 'Trailblazer 330',
                            engines: ['kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Current model, Kohler 27 horsepower electronic fuel injection'
                        },
                        'trailblazer-330-diesel': {
                            name: 'Trailblazer 330 Diesel',
                            engines: ['kubota-diesel'],
                            years: '2020s-present',
                            notes: 'Kubota diesel high-performance'
                        },
                        'trailblazer-330-airpak': {
                            name: 'Trailblazer 330 Air Pak',
                            engines: ['kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Built-in compressor and battery charger'
                        }
                    }
                },
                fusion: {
                    name: 'Fusion',
                    models: {
                        'fusion-185': {
                            name: 'Fusion 185',
                            engines: ['kohler-sh265'],
                            years: '2010s-present',
                            notes: 'Compact stick welder'
                        }
                    }
                },
                bluestar: {
                    name: 'Blue Star',
                    models: {
                        'bluestar-145': {
                            name: 'Blue Star 145 DX',
                            engines: ['kohler-sh265'],
                            years: '2010s-present',
                            notes: '4500W peak, smaller single-cylinder engine'
                        },
                        'bluestar-185': {
                            name: 'Blue Star 185 / 185 DX',
                            engines: ['kohler-ch395'],
                            years: '2010s-present',
                            notes: '6500W peak, 190A weld output'
                        }
                    }
                }
            }
        },
        hobart: {
            name: 'Hobart',
            hasSerialDecode: false,
            serialHelpText: 'The serial number is on the rating plate, usually on the back or side of the machine.',
            lines: {
                champion: {
                    name: 'Champion',
                    models: {
                        'champion-145': {
                            name: 'Champion 145',
                            engines: ['briggs-intek'],
                            years: '2010s-present',
                            notes: 'Briggs & Stratton Intek engine, 4500W, 145A'
                        },
                        'champion-145-recoil': {
                            name: 'Champion 145 Recoil',
                            engines: ['briggs-intek'],
                            years: '2010s-present',
                            notes: 'Recoil start variant'
                        },
                        'champion-10000': {
                            name: 'Champion 10,000',
                            engines: ['briggs-vanguard-23', 'kohler-ch730'],
                            years: '2000s-present',
                            notes: '10,000 watt generator, 225A welder'
                        },
                        'champion-elite-225': {
                            name: 'Champion Elite 225',
                            engines: ['briggs-vanguard-23'],
                            years: '2010s-present',
                            notes: 'Vanguard 23 horsepower twin, 11kW, 225A'
                        }
                    }
                }
            }
        },
        lincoln: {
            name: 'Lincoln Electric',
            hasSerialDecode: false,
            serialHelpText: 'The serial number is on the nameplate, usually on the front or side panel.',
            lines: {
                ranger: {
                    name: 'Ranger',
                    models: {
                        'ranger-8': {
                            name: 'Ranger 8',
                            engines: ['onan-p220', 'onan-p224'],
                            years: '1980s-1990s',
                            notes: 'Older model with Onan Performer engine, 225A'
                        },
                        'ranger-9': {
                            name: 'Ranger 9',
                            engines: ['onan-p224', 'kohler-ch25'],
                            years: '1990s-2000s',
                            notes: '250A, Onan or Kohler engine depending on year'
                        },
                        'ranger-225': {
                            name: 'Ranger 225',
                            engines: ['kohler-ch730'],
                            years: '2010s-present',
                            notes: 'Kohler 23 horsepower, 10.5kW'
                        },
                        'ranger-260mpx': {
                            name: 'Ranger 260MPX',
                            engines: ['kohler-ch740'],
                            years: '2010s-present',
                            notes: 'Multi-process capable'
                        },
                        'ranger-260mpx-onepak': {
                            name: 'Ranger 260MPX One-Pak',
                            engines: ['kohler-ch740'],
                            years: '2010s-present',
                            notes: 'Integrated undercarriage'
                        },
                        'ranger-air-260mpx': {
                            name: 'Ranger Air 260MPX',
                            engines: ['kohler-ch740'],
                            years: '2010s-present',
                            notes: 'Integrated air compressor'
                        },
                        'ranger-305g': {
                            name: 'Ranger 305 G',
                            engines: ['kohler-ch740'],
                            years: '2000s-present',
                            notes: '300A at 29V, 10.5kW'
                        },
                        'ranger-305g-efi': {
                            name: 'Ranger 305 G EFI',
                            engines: ['kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Electronic fuel injection variant'
                        },
                        'ranger-305-lpg': {
                            name: 'Ranger 305 LPG',
                            engines: ['kohler-ch740'],
                            years: '2010s-present',
                            notes: 'Liquid Propane Gas'
                        },
                        'ranger-305-diesel': {
                            name: 'Ranger 305 D',
                            engines: ['kubota-diesel'],
                            years: '2010s-present',
                            notes: 'Diesel engine variant'
                        },
                        'ranger-330mpx': {
                            name: 'Ranger 330MPX',
                            engines: ['kohler-ch750'],
                            years: '2020s-present',
                            notes: 'Multi-process, 330A, 12kW'
                        },
                        'ranger-330mpx-efi': {
                            name: 'Ranger 330MPX EFI',
                            engines: ['kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Electronic fuel injection'
                        },
                        'ranger-330mpx-onepak': {
                            name: 'Ranger 330MPX One-Pak',
                            engines: ['kohler-ch750'],
                            years: '2020s-present',
                            notes: 'Integrated undercarriage'
                        },
                        'ranger-250-gxt': {
                            name: 'Ranger 250 GXT',
                            engines: ['onan-p224'],
                            years: '1990s-2000s',
                            notes: 'Legacy AC/DC stick and CV wire'
                        }
                    }
                }
            }
        }
    },

    // --- Engine Database ---
    engines: {
        // Onan Performer Series (older Bobcats)
        'onan-p216':    { name: 'Onan P216',    family: 'Onan Performer',    hp: '16',  cylinders: '2', fuel: 'Gas' },
        'onan-p218':    { name: 'Onan P218',    family: 'Onan Performer',    hp: '18',  cylinders: '2', fuel: 'Gas' },
        'onan-p220':    { name: 'Onan P220',    family: 'Onan Performer',    hp: '20',  cylinders: '2', fuel: 'Gas' },
        'onan-p224':    { name: 'Onan P224',    family: 'Onan Performer',    hp: '24',  cylinders: '2', fuel: 'Gas' },

        // Kohler Command (older)
        'kohler-ch18':  { name: 'Kohler CH18',  family: 'Kohler Command',    hp: '18',  cylinders: '2', fuel: 'Gas' },
        'kohler-ch20':  { name: 'Kohler CH20',  family: 'Kohler Command',    hp: '20',  cylinders: '2', fuel: 'Gas' },
        'kohler-ch22':  { name: 'Kohler CH22',  family: 'Kohler Command',    hp: '22',  cylinders: '2', fuel: 'Gas' },
        'kohler-ch23':  { name: 'Kohler CH23',  family: 'Kohler Command',    hp: '23',  cylinders: '2', fuel: 'Gas' },
        'kohler-ch25':  { name: 'Kohler CH25',  family: 'Kohler Command',    hp: '25',  cylinders: '2', fuel: 'Gas' },

        // Kohler Command Pro (newer)
        'kohler-ch620': { name: 'Kohler CH620', family: 'Kohler Command Pro', hp: '18', cylinders: '2', fuel: 'Gas' },
        'kohler-ch640': { name: 'Kohler CH640', family: 'Kohler Command Pro', hp: '20', cylinders: '2', fuel: 'Gas' },
        'kohler-ch680': { name: 'Kohler CH680', family: 'Kohler Command Pro', hp: '22', cylinders: '2', fuel: 'Gas' },
        'kohler-ch730': { name: 'Kohler CH730', family: 'Kohler Command Pro', hp: '23.5', cylinders: '2', fuel: 'Gas' },
        'kohler-ch740': { name: 'Kohler CH740', family: 'Kohler Command Pro', hp: '25',   cylinders: '2', fuel: 'Gas' },
        'kohler-ch745': { name: 'Kohler CH745', family: 'Kohler Command Pro', hp: '26',   cylinders: '2', fuel: 'Gas' },
        'kohler-ch750': { name: 'Kohler CH750', family: 'Kohler Command Pro', hp: '27',   cylinders: '2', fuel: 'Gas' },

        // Kohler Electronic Fuel Injection
        'kohler-ech730':  { name: 'Kohler ECH730',  family: 'Kohler Electronic Fuel Injection', hp: '23.5', cylinders: '2', fuel: 'Gas (electronic fuel injection)' },
        'kohler-ech749':  { name: 'Kohler ECH749',  family: 'Kohler Electronic Fuel Injection', hp: '27',   cylinders: '2', fuel: 'Gas (electronic fuel injection)' },

        // Kohler LP variant
        'kohler-ch730-lp': { name: 'Kohler CH730 LP', family: 'Kohler Command Pro', hp: '23.5', cylinders: '2', fuel: 'Liquid Propane' },

        // Kohler single-cylinder (Blue Star)
        'kohler-sh265':   { name: 'Kohler SH265', family: 'Kohler Courage', hp: '7', cylinders: '1', fuel: 'Gas' },
        'kohler-ch395':   { name: 'Kohler CH395', family: 'Kohler Command Pro', hp: '9.5', cylinders: '1', fuel: 'Gas' },

        // Briggs & Stratton
        'briggs-intek':       { name: 'Briggs & Stratton Intek',       family: 'Briggs & Stratton', hp: '10', cylinders: '1', fuel: 'Gas' },
        'briggs-vanguard-23': { name: 'Briggs & Stratton Vanguard 23', family: 'Briggs & Stratton', hp: '23', cylinders: '2', fuel: 'Gas' },

        // Diesel
        'kubota-diesel': { name: 'Kubota Diesel', family: 'Kubota', hp: 'varies', cylinders: '3-4', fuel: 'Diesel' },

        // Catch-all
        'other': { name: 'Other / Not Sure', family: '', hp: '', cylinders: '', fuel: '' }
    }
};


// --- Miller Serial Number Decoder ---
function decodeMillerSerial(serial) {
    serial = serial.trim().toUpperCase();
    var match = serial.match(/^([A-Z])([A-Z])(\d{6})[A-Z]?$/);
    if (!match) return null;

    var decades = { J: 1980, K: 1990, L: 2000, M: 2010, N: 2020 };
    var yearOffsets = { A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, J:8, K:9 };
    // Note: letter I is skipped in Miller's system

    var decade = decades[match[1]];
    var offset = yearOffsets[match[2]];
    if (decade === undefined || offset === undefined) return null;

    return {
        year: decade + offset,
        serial: serial
    };
}


// --- Helper: Get flat list of all models for dropdowns ---
function getAllModelsFlat() {
    var list = [];
    for (var brandKey in MACHINE_DB.brands) {
        var brand = MACHINE_DB.brands[brandKey];
        for (var lineKey in brand.lines) {
            var line = brand.lines[lineKey];
            for (var modelKey in line.models) {
                var model = line.models[modelKey];
                list.push({
                    key: modelKey,
                    brand: brandKey,
                    line: lineKey,
                    label: brand.name + ' ' + model.name
                });
            }
        }
    }
    list.push({ key: 'other', brand: 'other', line: '', label: 'Other / Not Listed' });
    return list;
}


// --- Helper: Look up model display name from key ---
function getModelDisplayName(modelKey) {
    for (var brandKey in MACHINE_DB.brands) {
        var brand = MACHINE_DB.brands[brandKey];
        for (var lineKey in brand.lines) {
            var line = brand.lines[lineKey];
            if (line.models[modelKey]) {
                return brand.name + ' ' + line.models[modelKey].name;
            }
        }
    }
    return modelKey || 'Unknown';
}


// --- Helper: Get engine display name from key ---
function getEngineDisplayName(engineKey) {
    var eng = MACHINE_DB.engines[engineKey];
    if (!eng) return engineKey || '';
    if (eng.hp && eng.fuel) {
        return eng.name + ' (' + eng.hp + ' horsepower, ' + eng.fuel + ')';
    }
    return eng.name;
}


// --- Helper: Build full machine identification string ---
function buildMachineString(data) {
    var parts = [];
    if (data.model && data.model !== 'other') {
        parts.push(getModelDisplayName(data.model));
    } else if (data.customMachine) {
        parts.push(data.customMachine);
    }
    if (data.decodedYear) {
        parts.push('(' + data.decodedYear + ')');
    }
    if (data.serialNumber) {
        parts.push('S/N:' + data.serialNumber);
    }
    if (data.engine && data.engine !== 'other') {
        var eng = MACHINE_DB.engines[data.engine];
        if (eng) parts.push(eng.name);
    }
    return parts.join(' ');
}
