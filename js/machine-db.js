/* ============================================
   Jeff Nading Welder Repair — Machine Database
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
                        'bobcat-225-onan': {
                            name: 'Bobcat 225 (Onan engine)',
                            engines: ['onan-p216', 'onan-p218'],
                            years: '1980s-early 1990s',
                            notes: 'Original Bobcat 225 with Onan Performer engine'
                        },
                        'bobcat-225g': {
                            name: 'Bobcat 225G',
                            engines: ['onan-p216', 'onan-p218'],
                            years: '1980s-1990s',
                            notes: ''
                        },
                        'bobcat-225g-plus': {
                            name: 'Bobcat 225G Plus',
                            engines: ['onan-p216', 'onan-p218'],
                            years: '1990s',
                            notes: 'Same internals as 225 NT, fewer body panels'
                        },
                        'bobcat-225nt': {
                            name: 'Bobcat 225 NT',
                            engines: ['onan-p216', 'onan-p218', 'kohler-ch18', 'kohler-ch20'],
                            years: '1990s-2000s',
                            notes: 'NT = enclosed sheet metal design. Onan in earlier units, Kohler in later.'
                        },
                        'bobcat-225-kohler': {
                            name: 'Bobcat 225 (Kohler engine)',
                            engines: ['kohler-ch730'],
                            years: '2000s-present',
                            notes: 'Current production Bobcat 225 with Kohler Command Pro'
                        },
                        'bobcat-230': {
                            name: 'Bobcat 230',
                            engines: ['kohler-ch730'],
                            years: '2010s-present',
                            notes: '230A DC welder, 11kW generator'
                        },
                        'bobcat-250': {
                            name: 'Bobcat 250',
                            engines: ['kohler-ch730', 'kohler-ch740'],
                            years: '2000s-present',
                            notes: '250A welder, 11kW generator'
                        },
                        'bobcat-250-efi': {
                            name: 'Bobcat 250 EFI',
                            engines: ['kohler-ech730', 'kohler-ech749'],
                            years: '2010s-present',
                            notes: 'Electronic fuel injection — 27% better fuel economy'
                        },
                        'bobcat-250-diesel': {
                            name: 'Bobcat 250 Diesel',
                            engines: ['kubota-diesel'],
                            years: '2000s-present',
                            notes: 'Kubota diesel engine variant'
                        },
                        'bobcat-250-lp': {
                            name: 'Bobcat 250 LP',
                            engines: ['kohler-ch730-lp'],
                            years: '2000s-present',
                            notes: 'Liquid propane fuel variant'
                        },
                        'bobcat-265': {
                            name: 'Bobcat 265',
                            engines: ['kohler-ch740', 'kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Current production, 265A DC'
                        },
                        'bobcat-265-airpak': {
                            name: 'Bobcat 265 Air Pak',
                            engines: ['kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Built-in 30 cubic feet per minute air compressor'
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
                        'trailblazer-330-airpak': {
                            name: 'Trailblazer 330 Air Pak',
                            engines: ['kohler-ech749'],
                            years: '2020s-present',
                            notes: 'Built-in compressor and battery charger'
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
