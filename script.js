const hitSound = new Audio('./assets/sounds/swish.m4a');
const winSound = new Audio('./assets/sounds/cash.mp3');
const lossSound = new Audio('./assets/sounds/aww.mp3');

const YOU = {'div': '#your-cards', 'scoreSpan': '#your-score', 'score': 0};
const DEALER = {'div': '#dealer-cards', 'scoreSpan': '#dealer-score', 'score': 0};

let activePlayer = '';
let cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let cardCount = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]};
let scoreBoard = {'wins': 0, 'losses': 0, 'draws': 0};

//Event listener for each button
document.querySelector('#hit-button').addEventListener("click", blackJackHit);
document.querySelector('#stand-button').addEventListener("click", blackJackStand);
document.querySelector('#deal-button').addEventListener("click", blackJackDeal);
document.querySelector('#reset-button').addEventListener("click", resetScoreBoard);

function blackJackHit() {
    if(activePlayer !== YOU)
        activePlayer = YOU;

    if(activePlayer['score'] >= 21)
        return;
    
    actions(); 
}

function actions() {
    let card = randomCard();
    showCard(card);
    addScore(card);
    showScore(activePlayer);
}

function showCard(card) {
    var img = document.createElement('img');
    img.id = 'image';
    img.src = `./assets/images/${card}.png`;

    document.querySelector(activePlayer['div']).appendChild(img);
    hitSound.play();
}

function randomCard() {
    return cards[Math.floor(Math.random() * 13)];
}

function addScore(card) {
    if(card !== 'A') {
        activePlayer['score'] += cardCount[card];
        return;
    }

    if(activePlayer['score'] > 15)
        activePlayer['score'] += cardCount[card][0];
    else
        activePlayer['score'] += cardCount[card][1];
    
}

function showScore(activePlayer) {
    document.querySelector(activePlayer['scoreSpan']).innerHTML = activePlayer['score'];

    if(activePlayer['score'] > 21) {
        var scoreSpan = document.querySelector(activePlayer['scoreSpan']);
        scoreSpan.innerHTML = 'BUST!';
        scoreSpan.style.color = 'red';
    }
}

async function blackJackStand() {
    activePlayer = DEALER;

    //Disable hit button
    document.querySelector('#hit-button').disabled = true;

    while(activePlayer['score'] < 15) {
        actions();
        //sleep for 900ms, so that each action is rendered by some delay
        await sleep(900);
    }
    
    //Disable stand button after all the actions are performed
    document.querySelector('#stand-button').disabled = true;

    let result = computeResult();
    computeScoreBoard(result[0]);
    showResult(result);
    showScoreBoard()
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function computeResult() {
    if(YOU['score'] > 21) {
        if(DEALER['score'] <= 21)
            return ['You lost!', 'red'];
        else if(DEALER['score'] > 21)
            return ["It's a tie!", 'black'];
    } else {
        if(DEALER['score'] > 21 || DEALER['score'] < YOU['score'])
            return ['You won!', 'darkgreen'];
        else if(DEALER['score'] > YOU['score'])
            return ['You lost!', 'red'];
        else 
            return ["It's a tie!", 'black'];
    }
}

function computeScoreBoard(result) {
    if(result.includes('won')) 
        scoreBoard['wins']++;
    else if(result.includes('lost'))
        scoreBoard['losses']++;
    else 
        scoreBoard['draws']++;
}

function showResult(result) {
    document.querySelector('#result').innerHTML = result[0];
    document.querySelector('#result').style.color = result[1];
    if(result[1] === 'darkgreen')
        winSound.play();
    else if(result[1] === 'red')
        lossSound.play();
}

function showScoreBoard() {
    document.querySelector('#wins-score').innerHTML = scoreBoard['wins'];
    document.querySelector('#losses-score').innerHTML = scoreBoard['losses'];
    document.querySelector('#draws-score').innerHTML = scoreBoard['draws'];
}

function blackJackDeal() {
    //set score of both the players to zero, and reset activeplayer to none
    YOU['score'] = 0;
    DEALER['score'] = 0;
    activePlayer = '';

    //Update score and clear cards of the players
    showScore(YOU);
    clearCards(YOU); 

    showScore(DEALER);
    clearCards(DEALER);
}

function clearCards(player) {
    //to get all the cards present in the players board
    let images = document.querySelector(player['div']).querySelectorAll('img');
    //iterate and remove each card
    for(let i=0; i<images.length; i++) 
        document.querySelector(player['div']).removeChild(images[i]);
    
    //reset the message
    document.querySelector('#result').innerHTML = "Let's Play!";

    //reset the styles 
    document.querySelector(player['scoreSpan']).style.color = "inherit";
    document.querySelector('#result').style.color = "inherit";

    //Enable both hit and stand buttons
    document.querySelector('#hit-button').disabled = false;
    document.querySelector('#stand-button').disabled = false;

    hitSound.play();
}

function resetScoreBoard() {
    scoreBoard = {'wins': 0, 'losses': 0, 'draws': 0};
    showScoreBoard();
}
