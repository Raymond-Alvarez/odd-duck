'use strict';

/* ============================================================
   PART 1 — THE CONSTRUCTOR FUNCTION
   ============================================================ */
function Product(name, src) {
    this.name = name;
    this.src = src;
    this.views = 0;
    this.clicks = 0;
    Product.allProducts.push(this);
}

/* ============================================================
   PART 2 — THE PRODUCT LIST
   ============================================================ */
Product.allProducts = [];

/* ============================================================
   PART 2b — LOCAL STORAGE FUNCTIONS
   ============================================================ */
function saveToLocalStorage() {
    let stringifiedProducts = JSON.stringify(Product.allProducts);
    localStorage.setItem('oddDuckProducts', stringifiedProducts);
    console.log('Saved to local storage:', stringifiedProducts);
}

function loadFromLocalStorage() {
    let savedProducts = localStorage.getItem('oddDuckProducts');
    if (!savedProducts) {
        return false;
    }
    let parsedProducts = JSON.parse(savedProducts);
    console.log('Loaded from local storage:', parsedProducts);
    for (let i = 0; i < parsedProducts.length; i++) {
        let savedProduct = parsedProducts[i];
        let restoredProduct = new Product(savedProduct.name, savedProduct.src);
        restoredProduct.views = savedProduct.views;
        restoredProduct.clicks = savedProduct.clicks;
    }
    return true;
}

/* --------------------------------------------------------
   Load saved data or create fresh products
   -------------------------------------------------------- */
let dataLoaded = loadFromLocalStorage();

if (!dataLoaded) {
    new Product('bag', 'img/bag.jpg');
    new Product('banana', 'img/banana.jpg');
    new Product('bathroom', 'img/bathroom.jpg');
    new Product('boots', 'img/boots.jpg');
    new Product('breakfast', 'img/breakfast.jpg');
    new Product('bubblegum', 'img/bubblegum.jpg');
    new Product('chair', 'img/chair.jpg');
    new Product('cthulhu', 'img/cthulhu.jpg');
    new Product('dog-duck', 'img/dog-duck.jpg');
    new Product('dragon', 'img/dragon.jpg');
    new Product('pen', 'img/pen.jpg');
    new Product('pet-sweep', 'img/pet-sweep.jpg');
    new Product('scissors', 'img/scissors.jpg');
    new Product('shark', 'img/shark.jpg');
    new Product('sweep', 'img/sweep.jpg');
    new Product('tauntaun', 'img/tauntaun.jpg');
    new Product('unicorn', 'img/unicorn.jpg');
    new Product('water-can', 'img/water-can.jpg');
    new Product('wine-glass', 'img/wine-glass.jpg');
}

/* ============================================================
   PART 3 — GAME SETTINGS
   ============================================================ */
const TOTAL_ROUNDS = 5;
let currentRound = 0;
let currentProducts = [];

/* ============================================================
   PART 4 — DOM REFERENCES
   ============================================================ */
const resetBtn = document.getElementById('reset-btn');
const productDisplay = document.getElementById('product-display');
const roundCounter = document.getElementById('round-counter');
const viewResultsBtn = document.getElementById('view-results');
const chartContainer = document.getElementById('chart-container');
const resultsDisplay = document.getElementById('results-display');
const resultsList = document.getElementById('results-list');

/* ============================================================
   PART 4b — DARK/LIGHT MODE WITH LOCAL STORAGE
   ============================================================ */
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

function applyDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeLabel.textContent = '🌙 Dark Mode';
    themeToggle.checked = true;
    localStorage.setItem('oddDuckTheme', 'dark');
}

function applyLightMode() {
    document.documentElement.removeAttribute('data-theme');
    themeLabel.textContent = '☀️ Light Mode';
    themeToggle.checked = false;
    localStorage.setItem('oddDuckTheme', 'light');
}

function loadTheme() {
    let savedTheme = localStorage.getItem('oddDuckTheme');
    if (savedTheme === 'dark') {
        applyDarkMode();
    } else {
        applyLightMode();
    }
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        applyDarkMode();
    } else {
        applyLightMode();
    }
});

loadTheme();

/* ============================================================
   PART 5 — RANDOM PICKER
   ============================================================ */
let recentlyShown = [];
const MEMORY_SIZE = 12;

function getRandomProducts() {
    let available = Product.allProducts.length - recentlyShown.length;
    if (available < 3) {
        recentlyShown = recentlyShown.slice(-6);
        console.log('Safety check triggered — memory window shrunk!');
    }

    let selectedIndexes = [];
    let chosen = [];

    while (chosen.length < 3) {
        let randomIndex = Math.floor(Math.random() * Product.allProducts.length);
        if (!selectedIndexes.includes(randomIndex) &&
            !recentlyShown.includes(randomIndex)) {
            selectedIndexes.push(randomIndex);
            chosen.push(Product.allProducts[randomIndex]);
        }
    }

    recentlyShown = [...recentlyShown, ...selectedIndexes].slice(-MEMORY_SIZE);
    return chosen;
}

/* ============================================================
   PART 6 — DISPLAY FUNCTION
   ============================================================ */
function displayProducts(products) {
    productDisplay.innerHTML = '';
    roundCounter.textContent = `Round ${currentRound + 1} of ${TOTAL_ROUNDS}`;

    products.forEach(function(product) {
        let card = document.createElement('div');
        card.className = 'product-card';

        let img = document.createElement('img');
        img.src = product.src;
        img.alt = product.name;

        let name = document.createElement('p');
        name.textContent = product.name;

        card.dataset.name = product.name;

        product.views++;
        saveToLocalStorage();

        card.appendChild(img);
        card.appendChild(name);
        productDisplay.appendChild(card);
    });
}

/* ============================================================
   PART 7 — START ROUND
   ============================================================ */
function startRound() {
    currentProducts = getRandomProducts();
    displayProducts(currentProducts);
}

startRound();

/* ============================================================
   PART 8 — HANDLE CLICK
   ============================================================ */
function handleClick(event) {
    let card = event.target.closest('.product-card');
    if (!card) return;

    let clickedName = card.dataset.name;
    let clickedProduct = currentProducts.find(function(product) {
        return product.name === clickedName;
    });

    if (!clickedProduct) return;

    clickedProduct.clicks++;
    saveToLocalStorage();
    currentRound++;

    if (currentRound >= TOTAL_ROUNDS) {
        endGame();
    } else {
        startRound();
    }
}

/* ============================================================
   PART 9 — END GAME
   ============================================================ */
function endGame() {
    productDisplay.removeEventListener('click', handleClick);
    roundCounter.classList.add('hidden');
    viewResultsBtn.classList.remove('hidden');
    resetBtn.classList.remove('hidden');
}

/* ============================================================
   PART 10 — ATTACH CLICK LISTENER
   ============================================================ */
productDisplay.addEventListener('click', handleClick);

/* ============================================================
   PART 12 — RENDER BAR CHART
   ============================================================ */
function renderChart() {

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const chartTextColor = isDark ? '#f4f1eb' : '#1a252f';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    chartContainer.classList.remove('hidden');
    viewResultsBtn.classList.add('hidden');

    let productNames = [];
    let productClicks = [];
    let productViews = [];

    for (let i = 0; i < Product.allProducts.length; i++) {
        productNames.push(Product.allProducts[i].name);
        productClicks.push(Product.allProducts[i].clicks);
        productViews.push(Product.allProducts[i].views);
    }

    const data = {
        labels: productNames,
        datasets: [
            {
                label: 'Likes',
                data: productClicks,
                backgroundColor: 'rgba(230, 126, 34, 0.6)',
                borderColor: 'rgba(230, 126, 34, 1)',
                borderWidth: 2,
                borderRadius: 4,         /* rounded bar tops — more polished look */
            },
            {
                label: 'Views',
                data: productViews,
                backgroundColor: 'rgba(52, 152, 219, 0.6)',   /* blue — visually distinct from orange */
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                borderRadius: 4
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        font: {
                            size: 24,
                            weight: 'bold'
                        },
                        color: chartTextColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 24,
                            weight: 'bold'
                        },
                        color: chartTextColor,
                        maxRotation: 85,
                        minRotation: 65
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 20,
                        },
                        color: chartTextColor,
                        padding: 20,
                        boxWidth: 30,
                        usePointStyle: true    /* clean dots instead of rectangles */
                    }
                },
                title: {
                    display: true,
                    text: 'Odd Duck Products — Voting Results',
                    font: {
                        size: 34,
                        weight: 'bold'
                    },
                    color: chartTextColor,
                    padding: {
                        top: 10,
                        bottom: 50
                    }
                }
            }
        }
    };

    let canvas = document.getElementById('myChart');
    new Chart(canvas, config);

    renderDoughnut(chartTextColor);
}

/* ============================================================
   PART 12b — RENDER DOUGHNUT CHART
   ============================================================ */
function renderDoughnut(chartTextColor) {

    if (!chartTextColor) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        chartTextColor = isDark ? '#f4f1eb' : '#1a252f';
    }

    let votedProducts = Product.allProducts.filter(function(product) {
        return product.clicks > 0;
    });

    let names = votedProducts.map(function(product) {
        return product.name;
    });

    let clicks = votedProducts.map(function(product) {
        return product.clicks;
    });

    let backgroundColors = [
        'rgba(230, 126, 34, 0.85)',   /* orange */
        'rgba(52, 152, 219, 0.85)',   /* blue */
        'rgba(46, 204, 113, 0.85)',   /* green */
        'rgba(155, 89, 182, 0.85)',   /* purple */
        'rgba(231, 76, 60, 0.85)',    /* red */
        'rgba(241, 196, 15, 0.85)',   /* yellow */
        'rgba(26, 188, 156, 0.85)',   /* teal */
        'rgba(243, 156, 18, 0.85)',   /* amber */
        'rgba(189, 195, 199, 0.85)',  /* gray */
        'rgba(26, 37, 47, 0.85)',     /* navy */
    ];

    let borderColors = backgroundColors.map(function(color) {
        return color.replace('0.85', '1');
    });

    const doughnutData = {
        labels: names,
        datasets: [{
            label: 'Vote Share',
            data: clicks,
            backgroundColor: backgroundColors.slice(0, names.length),
            borderColor: borderColors.slice(0, names.length),
            borderWidth: 2,
            hoverOffset: 50,           /* how far slice pops outward on hover */
            hoverBorderWidth: 4,
            hoverBorderColor: '#ffffff'
        }]
    };

    const doughnutConfig = {
        type: 'doughnut',
        data: doughnutData,
        options: {
            maintainAspectRatio: false,
            
            layout: {
                padding: {
                    top: 60,
                    bottom: 60,
                    left: 60,
                    right: 20
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Vote Share by Product',
                    font: {
                        size: 34,
                        weight: 'bold'
                    },
                    color: chartTextColor,
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 24
                        },
                        color: chartTextColor,
                        padding: 20,                        
                        boxWidth: 18,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let total = context.dataset.data.reduce(function(a, b) {
                                return a + b;
                            }, 0);
                            let value = context.parsed;
                            let percentage = ((value / total) * 100).toFixed(1);
                            return ` ${context.label}: ${value} vote(s) — ${percentage}%`;
                        }
                    }
                }
            }
        }
    };

    let doughnutCanvas = document.getElementById('myDoughnut');
    new Chart(doughnutCanvas, doughnutConfig);
}

/* ============================================================
   PART 13 — VIEW RESULTS BUTTON LISTENER
   ============================================================ */
viewResultsBtn.addEventListener('click', renderChart, { once: true });

/* ============================================================
   PART 14 — RESET FUNCTION
   ============================================================ */
function resetApp() {
    localStorage.removeItem('oddDuckProducts');
    location.reload();
}
resetBtn.addEventListener('click', resetApp);