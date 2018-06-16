var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
$(document).ready(function() {
  let cardValues = MatchGame.generateCardValues();
  let $game = $('#game')
  MatchGame.renderCards(cardValues, $game);
});



/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function () {
  let sequentialValues = []
  for (let i=1; i<=8; i++) {
    sequentialValues.push(i);
    sequentialValues.push(i);
  }

  let cardValues = [];

  while (sequentialValues.length>0) {
    let randomIndex = Math.floor(Math.random() * sequentialValues.length);
    cardValues.push(sequentialValues[randomIndex])
    sequentialValues.splice(randomIndex, 1)
  }

  return cardValues;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {
  let colors = [
    'hsl(25, 85%, 65%)',
    'hsl(55, 85%, 65%)',
    'hsl(90, 85%, 65%)',
    'hsl(160, 85%, 65%)',
    'hsl(220, 85%, 65%)',
    'hsl(265, 85%, 65%)',
    'hsl(310, 85%, 65%)',
    'hsl(360, 85%, 65%)'
  ];

  $game.empty();
  // keeps track of the flipped cards. This should initialize — be initially set equal — to an empty array.//
  // This add a data attribute called 'flippedCards' with the value empty to the $game object. //
  $game.data('flippedCards', []);

  for (valueIndex = 0; valueIndex < cardValues.length; valueIndex++) {
    $cardElement = $('<div class="card col-xs-3"></div>');
    let value = cardValues[valueIndex];
    let color = colors[value-1];
    let data = {
      value: value,
      color: color,
      isFliped: false
    };
    // $cardElement.data('data') is wrong since data is object
    $cardElement.data(data);
    $game.append($cardElement);
  }

  /*
    It's important to create this event listener at the end of .renderCards() instead of
    document.ready because we can only guarantee that the cards will be created at the
    end of .renderCards(). If you try to attach click handlers to elements that don't exist,
    they will never be created.
  */
  $('.card').click(function() {
     MatchGame.flipCard( $(this), $('#game'))
  });
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {

  // checking if the selected card is already flipped
  if ($card.data('isFlipped')) {
    // If the card has already been flipped, return from the function so the function stops executing.
    return;
  }

  // If the card has not been flipped, modify it so it appears flipped over
  // 1. Change the background color of the card to be the color stored on the card.
  $card.css('background-color', $card.data('color'));
  // 2. change the text of the card to be the value stored on the card
  $card.text($card.data('value'));
  // 3. update the data on the card to indicate that it has been flipped over.
  $card.data('isFlipped', true);

  // count how many carts are flipped
  let flippedCards = $game.data('flippedCards')
  flippedCards.push($card)

  if (flippedCards.length === 2) {
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      // If the two flipped cards are matching then set the color
      let cssMatch = {
        backgroundColor: 'rgb(153, 153, 153)',
        color: 'rgb(204, 204, 204)'
      }
      flippedCards[0].css(cssMatch);
      flippedCards[1].css(cssMatch);
    } else {
      // Give time to user to see the second card when they are not matching
      window.setTimeout(function() {
        // If the two cards are not a match, flip them back over by
        // 1. resetting the background color
        flippedCards[0].css('background', 'rgb(32, 64, 86)');
        flippedCards[1].css('background', 'rgb(32, 64, 86)');
        // 2. setting the text to an empty string,
        flippedCards[0].text('');
        flippedCards[1].text('');
        // 3. updating the data to reflect that the card has not been flipped over
        flippedCards[0].data('isFlipped', false);
        flippedCards[1].data('isFlipped', false);
      } ,350)
    }
    // set the array of flipped cards on the game object to be a new, empty array,
    $game.data('flippedCards', []);
  }
};
