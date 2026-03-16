'use strict';

/* ============================================================
   PART 1 — THE CONSTRUCTOR FUNCTION
   
   A constructor is like a blueprint. Every product we create
   will have these same 4 properties. Think of it like a form
   that gets filled out for each product.
   
   'name'   = the product's name (matches the image file name)
   'src'    = the file path to find the image in our img/ folder
   'views'  = how many times this product has been shown (starts at 0)
   'clicks' = how many times this product has been voted for (starts at 0)
   ============================================================ */
function Product(name, src) {
    this.name = name;       // e.g. 'banana'
    this.src = src;         // e.g. 'img/banana.jpg'
    this.views = 0;         // starts at zero, increments each time shown
    this.clicks = 0;        // starts at zero, increments when voted on
    Product.allProducts.push(this);
}

/* ============================================================
   PART 2 — THE PRODUCT LIST
   
   Here we create one Product object for every image in our
   img/ folder using our constructor blueprint above.
   
   Product.allProducts is a property attached directly to the
   constructor function itself — this is how we keep one 
   master list of every product that exists in the app.
   ============================================================ */
Product.allProducts = [];   // This array will hold all 20 product objects

// Creating one product object per image:
// new Product('name', 'img/filename.jpg')
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
    
   
/* ============================================================
   PART 3 — GAME SETTINGS
   
   These variables control how the voting session works.
   Keeping them as variables (instead of hard-coding numbers
   everywhere) makes them easy to change for testing.
   ============================================================ */
const TOTAL_ROUNDS = 25;     // 5 for testing, will change to 25 later
let currentRound = 0;       // tracks which round we're currently on
let currentProducts = [];   // holds the 3 products currently being shown

/* ============================================================
   PART 4 — DOM REFERENCES
   
   These variables grab the HTML elements we need to interact
   with. Instead of searching for them every time we need them,
   we grab them once and store them in variables.
   
   document.getElementById() finds an element by its id="..."
   ============================================================ */
const productDisplay = document.getElementById('product-display');
const roundCounter = document.getElementById('round-counter');
const viewResultsBtn = document.getElementById('view-results');
const chartContainer = document.getElementById('chart-container');
const resultsDisplay = document.getElementById('results-display');
const resultsList = document.getElementById('results-list');

/* ============================================================
   PART 5 — THE RANDOM PICKER FUNCTION

   Math.random() generates a decimal number between 0 and 1
   For example: 0.4372, 0.9812, 0.0023

   To turn that into a usable index number we:
   1. Multiply by the array length  → 0.4372 * 19 = 8.3068
   2. Math.floor() rounds it down   → 8.3068 becomes 8
   3. Now we have a valid index!    → Product.allProducts[8]

   Example with our 19 products (indexes 0-18):
   Math.floor(Math.random() * 19) gives us a number 0 through 18
   ============================================================ */

/* ============================================================
   This array remembers which products showed in the 
   LAST round so we can prevent immediate repeats.
   It starts empty because there is no previous round yet.
   ============================================================ */
/* ============================================================
   We now remember the last 4 rounds (12 images):
   
   Think of it like a queue at a coffee shop:
   - New customers (indexes) join at the BACK
   - Old customers leave from the FRONT
   - The line never gets longer than 12 people
   ============================================================ */
let recentlyShown = [];          // Replaces lastShownProducts
const MEMORY_SIZE = 12;          // 4 rounds × 3 images = 12

function getRandomProducts() {
    let available = Product.allProducts.length - recentlyShown.length;
    if (available < 3) {
        recentlyShown = recentlyShown.slice(-6); // shrink to last 2 rounds
        console.log('Safety check triggered — memory window shrunk!');
    }

    let selectedIndexes = [];
    let chosen = [];

    while (chosen.length < 3) {

        let randomIndex = Math.floor(Math.random() * Product.allProducts.length);

        /* Check TWO conditions:
           1. Not already picked THIS round
           2. Not in our 12-image memory window */
        if (!selectedIndexes.includes(randomIndex) && 
            !recentlyShown.includes(randomIndex)) {

            selectedIndexes.push(randomIndex);
            chosen.push(Product.allProducts[randomIndex]);
        }
    }

    /* --------------------------------------------------------
       THE KEY CHANGE — update the sliding window
       
       Instead of replacing lastShownProducts entirely,
       we ADD the new 3 indexes to our memory and then
       TRIM it back to 12 if it gets too long.
       
       Step by step:
       1. ...spread means "unpack all existing items"
       2. We add the 3 new indexes to the END
       3. .slice(-12) keeps only the LAST 12 items
          cutting off the oldest ones from the front
       -------------------------------------------------------- */
    recentlyShown = [...recentlyShown, ...selectedIndexes].slice(-MEMORY_SIZE);
    return chosen;
}

/* ============================================================
   PART 6 — DISPLAY FUNCTION

   This function takes our 3 chosen products and builds
   the actual HTML cards that appear on the page.

   Here's what it does step by step:
   1. Clears whatever was showing before
   2. Updates the round counter text
   3. Loops through our 3 chosen products
   4. For each one, builds a "card" with an image and name
   5. Increments that product's views count
   6. Drops the card onto the page
   ============================================================ */
function displayProducts(products) {

    /* Step 1: Clear the previous round's images
       Setting innerHTML to '' wipes out everything 
       currently inside the product-display section */
    productDisplay.innerHTML = '';

    /* Step 2: Update the round counter text
       This updates the <p id="round-counter"> element
       so users can see which round they're on */
    roundCounter.textContent = `Round ${currentRound + 1} of ${TOTAL_ROUNDS}`;

    /* Step 3: Loop through each of the 3 products */
    products.forEach(function(product) {

        /* Step 4a: Create a <div> for the card container
           This becomes: <div class="product-card"> */
        let card = document.createElement('div');
        card.className = 'product-card';

        /* Step 4b: Create the <img> element
           This becomes: <img src="img/banana.jpg" alt="banana"> */
        let img = document.createElement('img');
        img.src = product.src;
        img.alt = product.name;  // important for accessibility!

        /* Step 4c: Create the <p> name label under the image
           This becomes: <p>banana</p> */
        let name = document.createElement('p');
        name.textContent = product.name;

        /* Step 4d: Store the product's name on the card element
           itself as a custom data attribute. We'll use this 
           later to know WHICH product was clicked.
           This becomes: <div class="product-card" data-name="banana"> */
        card.dataset.name = product.name;

        /* Step 5: Increment this product's views counter
           Every time a product is shown, views goes up by 1 */
        product.views++;

        /* Step 6: Assemble and attach to the page
           img and name go INTO the card
           card goes INTO the productDisplay section */
        card.appendChild(img);
        card.appendChild(name);
        productDisplay.appendChild(card);
    });
}

/* ============================================================
   PART 7 — START ROUND FUNCTION

   This function kicks off each new round by:
   1. Getting 3 random products
   2. Storing them in currentProducts
   3. Passing them to displayProducts() to show on page
   ============================================================ */
function startRound() {

    /* Get our 3 random products using the picker we built */
    currentProducts = getRandomProducts();

    /* Pass them to the display function to show on page */
    displayProducts(currentProducts);
}

/* ============================================================
   KICK IT OFF!
   
   This single line starts the whole app by calling startRound.
   Everything else will be driven by user clicks from here on.
   ============================================================ */
startRound();

/* ============================================================
   PART 8 — HANDLE CLICK FUNCTION

   This function fires every time a user clicks on the
   product display section. 

   We attach the listener to the SECTION (the parent container)
   rather than each individual card. This is called 
   "EVENT DELEGATION" — instead of adding 3 separate listeners
   (one per card), we add just ONE listener to the parent and 
   let clicks "bubble up" to it naturally.

   Think of it like a manager who handles all complaints for 
   their whole team, rather than each person handling their own.
   ============================================================ */
function handleClick(event) {

    /* event.target is whatever element the user actually clicked.
       It could be the card div, the image, or the name paragraph.
       
       We use .closest('.product-card') to crawl UP the DOM tree
       from whatever was clicked until it finds the parent card div.
       This ensures we always get the card, not a child element. */
    let card = event.target.closest('.product-card');

    /* If the user clicked somewhere in the section but NOT on 
       a card (like the gap between cards), card will be null.
       We use a guard clause to exit the function immediately
       in that case — nothing should happen. */
    if (!card) return;

    /* Remember we stored the product name on the card earlier?
       card.dataset.name retrieves it.
       This gives us the name of whichever product was clicked. */
    let clickedName = card.dataset.name;

    /* Now we search through currentProducts (our 3 shown products)
       to find the one whose name matches what was clicked.
       .find() returns the first item in the array that passes
       the test condition — in this case, name match. */
    let clickedProduct = currentProducts.find(function(product) {
        return product.name === clickedName;
    });

    /* Safety check — if somehow no match was found, exit.
       This should never happen but it's good defensive coding. */
    if (!clickedProduct) return;

    /* Add 1 to this product's clicks counter ✅ */
    clickedProduct.clicks++;

    /* Add 1 to our round tracker */
    currentRound++;

    /* --------------------------------------------------------
       CHECK IF VOTING IS OVER
       
       If currentRound equals TOTAL_ROUNDS (5) we are done!
       Otherwise load the next round.
       -------------------------------------------------------- */
    if (currentRound >= TOTAL_ROUNDS) {

        /* Voting is over — call endGame() which we'll build next */
        endGame();

    } else {

        /* Still more rounds to go — start the next one */
        startRound();
    }
}

/* ============================================================
   PART 9 — END GAME FUNCTION

   Called when all 5 rounds are complete.
   
   1. Removes the click listener so no more votes can happen
   2. Hides the product display and round counter
   3. Shows the "View Results" button
   ============================================================ */
function endGame() {

    /* Remove the event listener so clicking no longer does anything.
       IMPORTANT: You must pass the exact same function reference
       that was used in addEventListener — that's why handleClick
       is a named function and not an anonymous arrow function! */
    productDisplay.removeEventListener('click', handleClick);

    /* Hide the product cards and round counter — voting is done */
    roundCounter.classList.add('hidden');

    /* Show the View Results button by removing its hidden class */
    viewResultsBtn.classList.remove('hidden');
}

/* ============================================================
   PART 10 — ATTACH THE EVENT LISTENER

   This is where we actually "turn on" the click detection.
   We attach it to productDisplay (the section element) and
   tell it to call handleClick whenever a click happens inside.

   This line goes AFTER both functions are defined above.
   ============================================================ */
productDisplay.addEventListener('click', handleClick);

/* ============================================================
   PART 11 — SHOW RESULTS FUNCTION
   Commented out — replaced by bar chart on day 2
   ============================================================ */

/*
function showResults() {

    viewResultsBtn.classList.add('hidden');
    resultsDisplay.classList.remove('hidden');
    resultsList.innerHTML = '';

    let votedProducts = Product.allProducts
        .filter(function(product) {
            return product.clicks > 0;
        })
        .sort(function(a, b) {
            return b.clicks - a.clicks;
        });

    let notVotedProducts = Product.allProducts
        .filter(function(product) {
            return product.clicks === 0 && product.views > 0;
        })
        .sort(function(a, b) {
            return b.views - a.views;
        });

    let neverSeenProducts = Product.allProducts
        .filter(function(product) {
            return product.views === 0;
        });

    function buildResultItem(product) {
        let percentage = product.views > 0
            ? ((product.clicks / product.views) * 100).toFixed(1)
            : 0;
        let li = document.createElement('li');
        li.textContent = `${product.name} — ${product.clicks} vote(s) | seen ${product.views} time(s) | ${percentage}% vote rate`;
        return li;
    }

    if (votedProducts.length > 0) {
        let topHeader = document.createElement('li');
        topHeader.textContent = '🏆 Top Picks';
        topHeader.className = 'results-section-header';
        resultsList.appendChild(topHeader);
        votedProducts.forEach(function(product) {
            resultsList.appendChild(buildResultItem(product));
        });
    }

    if (notVotedProducts.length > 0) {
        let divider = document.createElement('li');
        divider.className = 'results-divider';
        resultsList.appendChild(divider);
        let alsoHeader = document.createElement('li');
        alsoHeader.textContent = '👀 Also Shown';
        alsoHeader.className = 'results-section-header';
        resultsList.appendChild(alsoHeader);
        notVotedProducts.forEach(function(product) {
            resultsList.appendChild(buildResultItem(product));
        });
    }

    if (neverSeenProducts.length > 0) {
        let neverHeader = document.createElement('li');
        neverHeader.textContent = '❌ Never Shown';
        neverHeader.className = 'results-section-header';
        resultsList.appendChild(neverHeader);
        neverSeenProducts.forEach(function(product) {
            resultsList.appendChild(buildResultItem(product));
        });
    }
}

*/


/* ============================================================
   PART 12 — ATTACH CLICK LISTENER TO VIEW RESULTS BUTTON

   When the user clicks the View Results button,
   call our showResults function.

   We use { once: true } as a third argument which means
   the listener automatically removes itself after firing
   once — so clicking the button multiple times won't
   duplicate the results list.
   ============================================================ */
// viewResultsBtn.addEventListener('click', showResults, { once: true });

/* ============================================================
   PART 12 — RENDER CHART FUNCTION

   Called when the user clicks "View Results".
   
   Uses Chart.js library (loaded from CDN) to build a 
   bar chart showing votes and views for every product.

   Chart.js needs three things:
   1. A <canvas> element to draw on
   2. A data object with labels and datasets
   3. A config object telling it what type of chart to make
   ============================================================ */
function renderChart() {

    /* Step 1: Show the chart container by removing hidden class */
    chartContainer.classList.remove('hidden');

    /* Step 2: Hide the View Results button — no longer needed */
    viewResultsBtn.classList.add('hidden');

    /* Step 3: Build arrays of names, clicks, and views
       Chart.js needs flat arrays — one value per product
       
       We loop through all 19 products and pull out
       just the data points we need for the chart */
    let productNames = [];
    let productClicks = [];
    let productViews = [];

    for (let i = 0; i < Product.allProducts.length; i++) {
        productNames.push(Product.allProducts[i].name);
        productClicks.push(Product.allProducts[i].clicks);
        productViews.push(Product.allProducts[i].views);
    }

    /* Step 4: Build the data object
       
       'labels' = the x-axis labels (product names)
       'datasets' = the bars themselves — one dataset per bar group
       Each dataset needs:
       - label: what shows in the legend
       - data: the array of values
       - backgroundColor: the bar fill color
       - borderColor: the bar outline color
       - borderWidth: thickness of the outline */
    const data = {
        labels: productNames,
        datasets: [
            {
                label: 'Likes',
                data: productClicks,
                backgroundColor: 'rgba(230, 126, 34, 0.5)',  /* orange — matches our accent color */
                borderColor: 'rgba(230, 126, 34, 1)',
                borderWidth: 3
            },
            {
                label: 'Views',
                data: productViews,
                backgroundColor: 'rgba(26, 37, 47, 0.5)',    /* navy — matches our primary color */
                borderColor: 'rgba(26, 37, 47, 1)',
                borderWidth: 3
            }
        ]
    };

    /* Step 5: Build the config object
       
       'type' tells Chart.js what kind of chart to draw
       'options' lets us customize behavior:
       - scales.y.beginAtZero makes the y-axis start at 0
         instead of whatever the lowest value is */
      const config = {
         type: 'bar',
         data: data,
         options: {
            layout: {
                  padding: {
                     top: 20        /* adds breathing room between legend and chart */
                  }
            },
            scales: {
                  y: {
                     beginAtZero: true,
                     max: 5,        /* shrinks the chart table — adjust if needed */
                     ticks: {
                        font: {
                              size: 16,
                              weight: 'bold'   /* makes y-axis numbers darker/stronger */
                        },
                        color: '#1a252f'     /* matches our dark navy primary color */
                     },
                     grid: {
                        color: 'rgba(0,0,0,0.08)'  /* subtle grid lines */
                     }
                  },
                  x: {
                     ticks: {
                        font: {
                              size: 15,
                              weight: 'bold'   /* makes product names stronger */
                        },
                        color: '#1a252f'     /* dark navy for better readability */
                     },
                     grid: {
                        display: false       /* removes vertical grid lines — cleaner look */
                     }
                  }
            },
            plugins: {
                  legend: {
                     position: 'top',
                     labels: {
                        font: {
                              size: 16
                        },
                        color: '#1a252f',
                        padding: 20         /* pushes legend away from chart top */
                     },
                     margin: {
                        bottom: 30
                     }
                  },
                  title: {
                     display: true,
                     text: 'Odd Duck Products — Voting Results',
                     font: {
                        size: 24,            /* bigger title */
                        weight: 'bold'
                     },
                     color: '#1a252f',
                     padding: {
                        bottom: 10           /* space between title and legend */
                     }
                  }
            }
         }
      };

    /* Step 6: Get the canvas element and create the chart
       
       new Chart(canvas, config) is a Chart.js constructor —
       just like our Product constructor, it creates a new
       Chart object using the canvas and config we provide */
    let canvas = document.getElementById('myChart');
    new Chart(canvas, config);

    renderDoughnut();
}

/* ============================================================
   PART 12b — RENDER DOUGHNUT CHART FUNCTION

   Shows the proportion of total votes each product received.
   Only products that received at least 1 vote will appear
   in the doughnut — zero-vote products would just clutter it.

   The doughnut tells a different story than the bar chart:
   - Bar chart shows RAW numbers (how many votes/views)
   - Doughnut shows PROPORTION (what SHARE of votes each got)
   ============================================================ */
function renderDoughnut() {

    /* Step 1: Filter to only products that received votes
       No point showing products with 0 votes in a 
       proportional chart — they'd just be invisible slices */
    let votedProducts = Product.allProducts.filter(function(product) {
        return product.clicks > 0;
    });

    /* Step 2: Build name and clicks arrays from voted products only */
    let names = votedProducts.map(function(product) {
        return product.name;
    });

    let clicks = votedProducts.map(function(product) {
        return product.clicks;
    });

    /* Step 3: Build a color array — one color per slice
       We generate colors automatically so it works for
       any number of voted products */
    let backgroundColors = [
        'rgba(230, 126, 34, 0.7)',   /* orange */
        'rgba(26, 37, 47, 0.7)',     /* navy */
        'rgba(52, 152, 219, 0.7)',   /* blue */
        'rgba(46, 204, 113, 0.7)',   /* green */
        'rgba(155, 89, 182, 0.7)',   /* purple */
        'rgba(231, 76, 60, 0.7)',    /* red */
        'rgba(241, 196, 15, 0.7)',   /* yellow */
        'rgba(26, 188, 156, 0.7)',   /* teal */
        'rgba(189, 195, 199, 0.7)',  /* gray */
        'rgba(243, 156, 18, 0.7)',   /* amber */
    ];

    let borderColors = backgroundColors.map(function(color) {
        return color.replace('0.7', '1'); /* full opacity for borders */
    });

    /* Step 4: Build the data object */
    const doughnutData = {
        labels: names,
        datasets: [{
            label: 'Vote Share',
            data: clicks,
            backgroundColor: backgroundColors.slice(0, names.length),
            borderColor: borderColors.slice(0, names.length),
            borderWidth: 2,
            hoverOffset: 10      /* slices pop out slightly on hover */
        }]
    };

    /* Step 5: Build the config object */
    const doughnutConfig = {
        type: 'doughnut',
        data: doughnutData,
        options: {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Vote Share by Product',
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    color: '#1a252f',
                    padding: {
                        bottom: 20
                    }
                },
                legend: {
                    position: 'right',   /* legend on the side for doughnuts */
                    labels: {
                        font: {
                            size: 40
                        },
                        color: '#1a252f',
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        /* Custom tooltip shows percentage as well as raw votes */
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

    /* Step 6: Get the canvas and create the doughnut chart */
    let doughnutCanvas = document.getElementById('myDoughnut');
    new Chart(doughnutCanvas, doughnutConfig);

    
}



/* ============================================================
   PART 13 — ATTACH CLICK LISTENER TO VIEW RESULTS BUTTON
   
   Now points to renderChart instead of showResults
   ============================================================ */
viewResultsBtn.addEventListener('click', renderChart, { once: true });