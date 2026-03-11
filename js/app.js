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
