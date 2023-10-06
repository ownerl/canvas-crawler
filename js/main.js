/* -------- DOM SELECTORS    ----------*/

const movement = document.querySelector('#movement');
const status = document.querySelector('#status');
const canvas = document.querySelector('canvas');

/* -------- CANVAS SETUP     ----------*/
// get canva context (ctx)
const ctx = canvas.getContext('2d');

// set the canvas resolution to be the same as window (as it is rendered)
// (how u make it a responsive canvas)
canvas.setAttribute('height', getComputedStyle(canvas).height);
canvas.setAttribute('width', getComputedStyle(canvas).width);
// set context properties
ctx.fillStyle = 'purple';
// invoke methods to use those properties

// fillRect(x, y, width, height) [position, size]

// ctx.fillRect(10, 20, 40, 40);
// ctx.fillRect(100,60,100,200);
// ctx.fillStyle = 'red';
// ctx.fillRect(400,200,25,50)

/* -------- CLASSES          ----------*/
// define a clas to use for our game
class Crawler {
    constructor(x,y,width,height,color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alive = true;
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}
// instance some game objects

//const testCrawler = new Crawler(45,45,65,23,'green');
//testCrawler.render();

const hero = new Crawler(0,0,30,30,'hotpink');
const ogre = new Crawler(300,80,30,70,'#bada55');
// multiple enemies
const ogres = [
    new Crawler(100,40,30,70,'#bada55'),
    new Crawler(100+ Math.random()*200,Math.random()*100,30,70,'#bada55'),
    new Crawler(200+ Math.random()*200,Math.random()*100,30,70,'#bada55'),
]


/* -------- FUNCTIONS        ----------*/
function drawBox(x,y,width,height,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
}

// handle keyboard input
// function movementHandler(e) {
//     //console.log(e)
//     const speed = 10; // how many pixels hero moves per function execution
//     //  one variable that cna be many values and each value
//     // has a different chunk of code to run --- use a switch case
//     switch(e.key.toLowerCase()) {
//         case 'w': 
//             console.log('move hero up');
//             hero.y -= speed;
//             break;
//         case 's':
//             console.log('move hero down');
//             hero.y += speed;
//             break;
//         case 'a': 
//             console.log('move hero left');
//             hero.x -= speed;
//             break;
//         case 'd': 
//             console.log('move hero right');
//             hero.x += speed;
//             break;
//         default:
//             // any other value will run the default (like an else
//             console.log(`${e.key} not recognized`);
//     }
// }
// collision detection algorithm

const currentlyPressedKeys = {};
function movementHandler() {
    //console.log(currentlyPressedKeys)
    const speed = 1;
    if (currentlyPressedKeys['w']) {
        let isDiagonal = false;
        if (currentlyPressedKeys['a'] || currentlyPressedKeys['d']){
            isDiagonal = true;
        }
        hero.y -= isDiagonal ? speed * .5 : speed;
    }
    if (currentlyPressedKeys['s']) {
        let isDiagonal = false;
        if (currentlyPressedKeys['a'] || currentlyPressedKeys['d']){
            isDiagonal = true;
        }
        hero.y += isDiagonal ? speed * .5 : speed;;
    }
    if (currentlyPressedKeys['d']) {
        let isDiagonal = false;
        if (currentlyPressedKeys['w'] || currentlyPressedKeys['s']){
            isDiagonal = true;
        }
        hero.x += isDiagonal ? speed * .5 : speed;;
    }
    if (currentlyPressedKeys['a']) {
        let isDiagonal = false;
        if (currentlyPressedKeys['w'] || currentlyPressedKeys['s']){
            isDiagonal = true;
        }
        hero.x -= isDiagonal ? speed * .5 : speed;;
    }
}
    // multiple keys example


function detecHit(objectOne, objectTwo) {
    // aabb axis aligned bounding box algorithm
    // hitboxes basically
    // check for collision on each side of each object

    const top = objectOne.y + objectOne.height >= objectTwo.y;
    const bottom = objectOne.y <= objectTwo.y + objectTwo.height;
    const left = objectOne.x <= objectTwo.x + objectTwo.width;
    const right = objectOne.x + objectOne.width >= objectTwo.x;
    //console.log('top: ', top, 'bottom: ', bottom, 'left: ', left, 'right: ', right)

    if (top&&bottom&&left&&right) {
        return true;
    }
    return false;
}

// create a game loop -- run the business logic of the game and be called by a setInterval
const gameInterval = setInterval(gameloop, 4);
function gameloop() {
    movementHandler();
    // clear canvas to rerender
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // render all game objects to refresh
    hero.render();

    // win condition

    for (let i = 0; i < ogres.length; i++) {

        if (ogres[i].alive) {
            ogres[i].render();
        }
        if (detecHit(hero, ogres[i])) {
            // if ogre was hit by hero -> ogre.alive = false
            // display message to userdsa
            ogres[i].alive = false;
            status.innerText = 'You have killed a shrek 🐸'
            
            
        }
    }
        
    
    if (!ogres.some((ogre) => ogre.alive == true)) {
        status.innerText = 'You win! 🐸'
    }
    

    // do game logic
}

/* -------- EVENT LISTENERS  ----------*/
canvas.addEventListener('click', event => {
    movement.innerText = `x: ${event.offsetX}, y: ${event.offsetY}`;
    drawBox(event.offsetX, event.offsetY, 30, 30, 'pink');
})

// document.addEventListener('keydown', movementHandler);

document.addEventListener('keydown', e => currentlyPressedKeys[e.key] = true);
document.addEventListener('keyup', e => currentlyPressedKeys[e.key] = false);