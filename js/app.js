var move = 0;
var mFound = 0;


var started = false;
var cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];


var timer = new Timer();
timer.addEventListener('secondsUpdated', function(e) {
    $('#timer').html(timer.getTimeValues().toString());
});


$('#reset-button').click(resetGame);

function create(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

function generate() {
    for (var i = 0; i < 2; i++) {
        cards = shuffle(cards);
        cards.forEach(create);
    }
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

openCards = [];


function toggle() {


    if (started == false) {
        started = true;
        timer.start();
    }

    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableCLick();
    } else if (openCards.length === 1) {

        updateMove();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}

function disableCLick() {
    openCards.forEach(function(card) {
        card.off('click');
    });
}

function enableClick() {
    openCards[0].click(toggle);
}

function matchOpenCards() {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        console.log("matchCard");
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    } else {
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableClick();
        removeOpenCards();
    }
}

function removeOpenCards() {
    openCards = [];
}

$.fn.extend({
    animateCss: function(animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function() {
            $(this).removeClass(animationName);
        });
        return this;
    }
});

function updateMove() {
    move += 1;
    $('#move').html(`${move} Move`);
    if (move == 24) {
        addBlankStar();
    } else if (move == 15) {
        addBlankStar();
    }
}

function checkWin() {
    mFound += 1;
    if (mFound == 8) {
        showResults();
    }
}

function addBlankStar() {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

function addStars() {
    for (var i = 0; i < 3; i++) {
        $('#stars').append('<li><i class="fa fa-star"></i></li>');
    }
}

function resetGame() {
    move = 0;
    mFound = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#game-deck')[0].style.display = "";
    $('#sucess-result')[0].style.display = "none";
    started = false;
    timer.stop();
    $('#timer').html("00:00:00");
    playGame();
}

function playGame() {
    generate();
    $('.card').click(toggle);
    $('#move').html("0 Move");
    addStars(3);
}

function showResults() {
    $('#sucess-result').empty();
    timer.pause();
    var scoreBoard = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " /> </svg>
        <p class="success"> Congrats !!! </p>
        <p>
            <span class="score-titles">Move:</span>
            <span class="score-values">${move}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>
             </div>
             <div class="star">
                <i class="fa ${ (move > 23) ? "fa-star-o" : "fa-star"}  fa-3x"></i>
             </div>
            <div class="star">
                <i class="fa ${ (move > 14) ? "fa-star-o" : "fa-star"} fa-3x"></i>
             </div>
        </div>
        <div class="text-center margin-top-2" id="restart">
            <i class="fa fa-repeat fa-2x"></i>
          </div>
    `;
    $('#game-deck')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#restart').click(resetGame);
}

// start the game
playGame();