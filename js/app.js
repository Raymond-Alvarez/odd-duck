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
const TOTAL_ROUNDS = 5;     // 5 for testing, will change to 25 later
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
const resultsDisplay = document.getElementById('results-display');
const resultsList = document.getElementById('results-list');

console.log('All products:', Product.allProducts);
console.log('Total products:', Product.allProducts.length);

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
let lastShownProducts = [];

function getRandomProducts() {

    /* selectedIndexes keeps track of which products we've 
       already picked FOR THIS round so we don't pick 
       the same one twice in the same round */
    let selectedIndexes = [];
    
    /* chosen will hold our 3 final Product objects */
    let chosen = [];

    /* We need exactly 3 products so we loop 3 times */
    while (chosen.length < 3) {

        /* Pick a random index between 0 and 18 */
        let randomIndex = Math.floor(Math.random() * Product.allProducts.length);

        /* Check TWO conditions before accepting this pick:
           1. Not already chosen in THIS round (not in selectedIndexes)
           2. Not shown in the LAST round (not in lastShownProducts)
           
           The ! means "NOT" — so we only proceed if both are true */
        if (!selectedIndexes.includes(randomIndex) && 
            !lastShownProducts.includes(randomIndex)) {

            /* This pick passes both checks — accept it! */
            selectedIndexes.push(randomIndex);
            chosen.push(Product.allProducts[randomIndex]);
        }

        /* If either check failed, the while loop just tries 
           again with a new random number automatically */
    }

    /* Remember these indexes for next round's repeat-check */
    lastShownProducts = selectedIndexes;

    /* Hand back our array of 3 chosen Product objects */
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