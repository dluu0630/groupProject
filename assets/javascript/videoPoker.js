var deckObj = {

    deckID: "",
    queryURL: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
    deck: [],

    createDeck: function() {
        $.ajax({
                url: deckObj.queryURL,
                method: "GET"
            })
            .done(function(response) {
                deckID = response.deck_id;

                deckObj.getDeck();
            });
    },


    getDeck: function() {
        var queryURL6 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=52";
        $.ajax({
                url: queryURL6,
                method: "GET"
            })
            .done(function(response) {

                deck = response.cards;
                $("#buttonView").append("<button id='betOne' type='button' class='btn btn-outline-primary'>Bet One</button>");
                $("#buttonView").append("<button id='betMax' type='button' class='btn btn-outline-primary'>Bet Max</button>");
                $("#buttonView").append("<button id='deal' type='button' class='btn btn-outline-primary'>Deal Cards</button>");
                $("#buttonView").append("<button id='cashOut' type='button' class='btn btn-outline-primary'>Cash Out</button>");
                $("#dealCards").one('click', game.dealCards);


            });

    },
    playAgain: function() {

    	//reset everything
    	// $("#playerScore").html("Player Score: 0");
    	// $("#playerChips").html("Player Chips: 0");
    	// $("#dealerScore").html("Dealer Score: 0");
     //    $("#buttonView").html("");
     //    $("#handView").html("");
     //    $("#dealerHand").html("");
     //    $("#gameText").html("");
        game.playerScore = 0;
        game.playerCards = [];



        deckObj.createDeck();
    },
    gameOverDisplay: function() {
    	//display reset button
        $("#buttonView").html("");
        $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-outline-primary'>Play Again</button>");
        $("#playAgain").one('click', deckObj.playAgain);
    }


}

var game = {
    arrayhand: {},
    buttonChoice: "",
    playerCards: [],
    playerScore: 0,

    drawCard: function() {
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img src='" + card1ImgURL + "'</img>"
        $("#handView").append(card1Img)

        //Adding cards to array with suit and card value
        game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
        console.log("Player just clicked hit, deck seen below");
        console.log(game.playerCards);
        deck.pop();
    },

    dealCards: function() {
        //get hand
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img src='" + card1ImgURL + "'</img>"
        $("#handView").append(card1Img)
        var card2ImgURL = deck[deck.length - 2].image;
        var card2Img = "<img src='" + card2ImgURL + "'</img>"
        $("#handView").append(card2Img)


        //Adding cards to array with suit and card value
        game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
        game.playerCards.push([deck[deck.length - 2].suit, deck[deck.length - 2].value]);
        console.log(game.playerCards);
        deck.pop();
        deck.pop();
        //how to access an array in an array (game.playerCards[0])[1]
        console.log((game.playerCards[0])[1]);
        console.log(deck);
        // console.log(typeof (game.playerCards[0])[1]);
        dealer.drawCard();
        game.updatePlayerScore();
        game.playerChoices();


    },
    playerChoices: function() {
        game.buttonChoice = "";
        $("#buttonView").html("");
        $("#buttonView").append("<button class='playerChoiceButtons' data-choice='hit' id='hit' type='button' class='btn btn-outline-primary'>Hit</button>");
        $("#buttonView").append("<button class='playerChoiceButtons' data-choice='stand' id='stand' type='button' class='btn btn-outline-primary'>Stand</button>");
        // $("#buttonView").append("<button class='playerChoiceButtons' data-choice='doubleDown' id='doubleDown' type='button' class='btn btn-outline-primary'>Double Down</button>");

        $(".playerChoiceButtons").one('click', function() {
            game.buttonChoice = $(this).attr('data-choice');
            game.buttonAction()

        });

    },
    buttonAction: function() {
        // game.buttonChoice = $(this).attr('data-choice');
        switch (game.buttonChoice) {
            case 'hit':
                game.playerChoices();
                game.drawCard();
                game.updatePlayerScore();

                break;
            case 'stand':

                dealer.dealerTurn();

                break;
                // case 'doubleDown':

                //     break;
        }
    },
    updatePlayerScore: function() {
        game.playerScore = 0;
        var hasAce = false;
        var aceIndex;
        var numWithoutAce = 0;
        for (i = 0; i < game.playerCards.length; i++) {
            var num = parseInt((game.playerCards[i])[1]) || 10;
            if (game.playerCards[i][1] === "ACE") {
                num = 0;
                hasAce = true;
                aceIndex = i;
            }
            game.playerScore += num;
        }
        if (hasAce === true) {
            for (i = 0; i < game.playerCards.length; i++) {
                if (aceIndex != i) {
                    var notAceCard = parseInt((game.playerCards[i])[1]) || 10;

                    if (game.playerCards[i][1] != "ACE") {
                        numWithoutAce += notAceCard;
                    } else {
                        //this happens because the card is a duplicate ace card, must be 1 or else it would exceed 21
                        notAceCard = 1;
                    }
                    numWithoutAce += notAceCard;
                }
            }
            if (numWithoutAce <= 10) {
                game.playerScore += 11;
            } else {
                game.playerScore += 1;
            }
            hasAce = false;
            numWithoutAce = 0;
        }

        if (game.playerScore > 21) {
            $("#gameText").html("<p> The Dealer wins! The player busted! </p>");
            deckObj.gameOverDisplay();
        }

        $("#playerScore").html("");
       $("#playerScore").append("Player score:" + game.playerScore);
        console.log("Player score is " + game.playerScore);

    }

}




deckObj.createDeck();