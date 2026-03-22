/* ============================================
   Jeff Nading Miller Welder Repair — Shop
   Version: 1.0

   Product catalog, filtering, and display logic.
   Products can be updated by editing the array below.
   ============================================ */

// --- Product Catalog ---
// To add/remove products, edit this array. Jeff can update prices and descriptions here.
const products = [
    {
        id: 'trombetta-solenoid',
        name: 'Trombetta Starter Solenoid',
        description: 'Direct replacement starter solenoid for Miller Bobcat welders. Fits 225, 225 NT, and 250 models. A common failure point — keep a spare.',
        price: 45.00,
        category: 'electrical',
        image: '../images/wiring/trombetta-solenoid.jpeg'
    },
    {
        id: 'kohler-oil-filter',
        name: 'Kohler Pro Oil & Filter Kit',
        description: 'Kohler Pro 300-hour extended life synthetic oil and genuine Kohler oil filter. The same kit we use in our shop for every engine service.',
        price: 35.00,
        category: 'maintenance',
        image: '../images/maintenance/kohler-pro-oil-filter.jpeg'
    },
    {
        id: 'capacitor-set',
        name: 'Welding Output Capacitor Set',
        description: 'Replacement capacitor set for Miller Bobcat welding output stage. Blue high-voltage capacitors matched to original specifications.',
        price: 85.00,
        category: 'electrical',
        image: '../images/electronics/blue-capacitor-bank.jpeg'
    },
    {
        id: 'bobcat-225nt-faceplate',
        name: 'Bobcat 225 NT Control Panel Faceplate',
        description: 'Brand new replacement faceplate for the Miller Bobcat 225 NT. Includes all legends and markings. Direct bolt-on replacement.',
        price: 120.00,
        category: 'body',
        image: '../images/electronics/bobcat-225nt-faceplate-new.jpeg'
    },
    {
        id: 'fuel-pump-kit',
        name: 'Fuel Pump Replacement Kit',
        description: 'Complete fuel pump assembly with filter and mounting hardware. Fits Kohler engines used in Miller Bobcat series.',
        price: 65.00,
        category: 'fuel',
        image: '../images/fuel-system/fuel-pump-filter-lines.jpeg'
    },
    {
        id: 'stator-insulation-kit',
        name: 'Stator Slot Insulation Kit',
        description: 'Pre-cut slot insulation paper and wedge material for stator rewinding. Professional-grade Nomex material rated for continuous high temperature.',
        price: 55.00,
        category: 'electrical',
        image: '../images/stator/bare-lamination-numbered-slots.jpeg'
    },
    {
        id: 'cylinder-head-gasket',
        name: 'Kohler Cylinder Head Gasket Set',
        description: 'Complete head gasket set for Kohler Command/Courage twin cylinder engines. Includes head gaskets, valve cover gaskets, and intake/exhaust gaskets.',
        price: 42.00,
        category: 'engine',
        image: '../images/engine/cylinder-heads-valves-labeled.jpeg'
    },
    {
        id: 'brush-set',
        name: 'Generator Brush Set',
        description: 'Replacement carbon brush set for Miller Bobcat generator/welder. Includes springs and hardware. Set of 4 brushes.',
        price: 38.00,
        category: 'electrical',
        image: '../images/stator/slip-rings-commutator.jpeg'
    },
    {
        id: 'air-filter',
        name: 'Kohler Engine Air Filter',
        description: 'Genuine replacement air filter for Kohler engines. One of the simplest and most important maintenance items — replace every 100 hours.',
        price: 18.00,
        category: 'maintenance',
        image: '../images/engine/kohler-ohv-in-frame.jpeg'
    },
    {
        id: 'spark-plug-set',
        name: 'Spark Plug Set (Twin Cylinder)',
        description: 'Set of 2 spark plugs for Kohler twin cylinder engines. Pre-gapped to Kohler specification. Replace every 200 hours or annually.',
        price: 12.00,
        category: 'maintenance',
        image: '../images/engine/cylinder-head-clean-rebuild.jpeg'
    },
    {
        id: 'wiring-connector-kit',
        name: 'Weatherproof Connector Repair Kit',
        description: 'Assortment of weatherproof wire connectors, terminals, and heat-shrink for repairing corroded wiring connections. Includes crimping terminals.',
        price: 28.00,
        category: 'electrical',
        image: '../images/wiring/damaged-connectors-closeup.jpeg'
    },
    {
        id: 'fuel-line-kit',
        name: 'Fuel Line Replacement Kit',
        description: 'Complete fuel line kit with clamps and fittings. Ethanol-resistant fuel line rated for modern fuel blends. Enough for a complete replacement.',
        price: 22.00,
        category: 'fuel',
        image: '../images/fuel-system/fuel-tank-mounting-bracket.jpeg'
    }
];

// --- Render Products ---
function renderProducts(filter) {
    const grid = document.getElementById('productGrid');
    const noProducts = document.getElementById('noProducts');
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';
    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img class="product-card__image" src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-card__body">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__desc">${product.description}</p>
                <div class="product-card__footer">
                    <span class="product-card__price">${formatCurrency(product.price)}</span>
                    <button class="product-card__add-btn" data-product-id="${product.id}"
                        onclick="addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- Filter Products ---
function filterShop(category) {
    document.querySelectorAll('#shopFilters .gallery-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category) ||
            (category === 'all' && btn.textContent === 'All Items'));
    });
    renderProducts(category);
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', function() {
    renderProducts('all');
});
