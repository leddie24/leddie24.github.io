"use strict";

var CARDCHECKTIME = 300;

var NumberCard = React.createClass({
   displayName: "NumberCard",

   getInitialState: function getInitialState() {
      return {
         clickable: true,
         selected: false,
         valid: false
      };
   },
   guessCard: function guessCard(card) {
      if (this.state.clickable && this.props.guessesLeft > 0) {
         this.setState({
            selected: true,
            clickable: false
         }, function () {
            this.props.guessCard(card);
         });
      }
   },
   disableCard: function disableCard() {
      this.setState({
         clickable: false
      });
   },
   enableCard: function enableCard() {
      this.setState({
         clickable: true
      });
   },
   removeCard: function removeCard() {
      this.setState({
         clickable: false,
         selected: false,
         valid: true
      });
   },
   resetCard: function resetCard() {
      this.setState(this.getInitialState());
   },
   render: function render() {
      var className = "number-card h ";
      if (this.state.selected) {
         className += "selected flipped";
      }
      if (this.state.valid) {
         className += "valid flipped";
      }
      return React.createElement(
         "div",
         {
            className: className,
            onClick: this.guessCard.bind(null, this) },
         React.createElement("div", { className: "front" }),
         React.createElement(
            "div",
            { className: "back" },
            this.props.number
         )
      );
   }
});

var GameInfo = React.createClass({
   displayName: "GameInfo",

   startGame: function startGame() {
      this.props.startGame();
   },
   render: function render() {
      return React.createElement(
         "div",
         { className: "row" },
         React.createElement(
            "div",
            { className: "col-xs-6 col-xs-offset-3" },
            React.createElement(
               "h1",
               null,
               "Match Pairs"
            ),
            React.createElement(
               "p",
               null,
               "Welcome to Match Pairs.  Each level starts out with pairs of cards that you match with each other."
            ),
            React.createElement(
               "p",
               null,
               "Each round you have 2 hints (which show all cards for 3 seconds), and 3 tries."
            ),
            React.createElement(
               "p",
               null,
               "You have 30 seconds for round one, and 10 additional seconds for the subsequent levels."
            ),
            React.createElement(
               "p",
               null,
               "Press ESC to cancel an accidental selection (NOTE: you can only do this once per level)"
            ),
            React.createElement(
               "button",
               { className: "btn btn-primary", onClick: this.startGame },
               "Start Game"
            )
         )
      );
   }
});

var TIMER;

var GameBoard = React.createClass({
   displayName: "GameBoard",

   getInitialState: function getInitialState() {
      var cards = this.makeCards(this.props.pairs);
      return {
         pairs: this.props.pairs,
         level: this.props.level,
         startGame: false,
         gameOver: false,
         hints: 2,
         timer: 20,
         guessesLeft: 3,
         cancels: 1,
         cards: cards,
         matchedCards: [],
         selectedCards: []
      };
   },
   componentDidUpdate: function componentDidUpdate() {
      if (this.state.timer <= 0) {
         this.endGame();
      }
   },
   endGame: function endGame() {
      clearInterval(TIMER);
      this.setState({
         gameOver: true,
         timer: this.getInitialState().timer
      });
   },
   makeCards: function makeCards(num) {
      var cards = [];
      for (var i = 1; i <= num; i++) {
         cards.push(i);
         cards.push(i);
      }
      cards = this._shuffleCards(cards);
      return cards;
   },
   startGame: function startGame() {
      var time = arguments.length <= 0 || arguments[0] === undefined ? this.state.level * 1500 : arguments[0];

      var initial = this.getInitialState(),
          gameTime = this.state.timer > initial.timer ? this.state.timer : initial.timer,
          level = this.state.level > initial.level ? this.state.level : initial.level;
      this.setState({
         startGame: true,
         gameOver: false,
         level: level,
         hints: initial.hints,
         guessesLeft: initial.guessesLeft,
         timer: gameTime
      }, function () {
         this.showHint(time, true);
         document.addEventListener("keydown", this._clearSelected, false);
      }.bind(this));
   },
   disableCard: function disableCard() {
      var number = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (!number) {
         for (var i = 0; i < this.state.cards.length; i++) {
            this.refs['number' + i].disableCard();
         }
      } else {
         this.refs['number' + number].disableCard();
      }
   },
   enableCard: function enableCard() {
      var number = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (!number) {
         for (var i = 0; i < this.state.cards.length; i++) {
            this.refs['number' + i].enableCard();
         }
      } else {
         this.refs['number' + number].enableCard();
      }
   },
   showHint: function showHint() {
      var time = arguments.length <= 0 || arguments[0] === undefined ? 3000 : arguments[0];
      var levelStart = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var cards = document.getElementsByClassName("number-card");
      for (var i = 0; i < cards.length; i++) {
         cards[i].classList.add("visible");
         this.refs['number' + i].disableCard();
      }
      setTimeout(function () {
         for (var i = 0; i < cards.length; i++) {
            cards[i].classList.remove("visible");
            this.refs['number' + i].enableCard();
         }
         if (levelStart) {
            this.startTimer();
         }
      }.bind(this), time);
   },
   startTimer: function startTimer() {
      TIMER = setInterval(function () {
         var gameTime = this.state.timer - 1;
         this.setState({
            timer: gameTime
         });
      }.bind(this), 1000);
   },
   guessCard: function guessCard(card) {
      if (this.state.guessesLeft > 0) {
         var selectedCards = this.state.selectedCards;
         selectedCards = selectedCards.concat([card]);
         this.setState({
            selectedCards: selectedCards
         });

         // check cards if it equals 2
         if (selectedCards.length >= 2) {
            // check = number of guessesLeft
            var check = this.checkMatch(selectedCards);
            this.disableCard();
            if (check > 0) {
               setTimeout(function () {
                  this.enableCard();
               }.bind(this), CARDCHECKTIME);
            }
         }
      }
   },
   // Check if both cards are matching.  Returns the number of guesses left for the player
   checkMatch: function checkMatch(cards) {
      var guessesLeft = this.state.guessesLeft;
      if (cards[0].props.number === cards[1].props.number) {
         setTimeout(function () {
            var matchedCards = this.state.matchedCards;
            var number = cards[0].props.number;
            for (var i = 0; i < cards.length; i++) {
               cards[i].removeCard();
            }
            matchedCards = matchedCards.concat([number]);
            this.setState({
               matchedCards: matchedCards
            }, function () {
               this.checkWin();
            });
         }.bind(this), CARDCHECKTIME);
      }
      // No match for both cards
      else {
            guessesLeft = guessesLeft - 1;
            this.setState({
               guessesLeft: guessesLeft
            });

            // No guesses left, game is over
            if (guessesLeft === 0) {
               localStorage.setItem("matchCardsScore", this.state.level);

               //Reset game to default level and cards
               var cards = this.makeCards(this.props.pairs),
                   gameTime = this.getInitialState().timer;
               setTimeout(function () {
                  this.setState({
                     gameOver: true,
                     level: 1,
                     cards: cards,
                     timer: gameTime
                  }, function () {
                     clearInterval(TIMER);
                  });
               }.bind(this), 600);
            } else {
               setTimeout(function () {
                  for (var i = 0; i < cards.length; i++) {
                     cards[i].resetCard();
                  }
               }, CARDCHECKTIME);
            }
         }
      this.setState({
         selectedCards: []
      });
      return guessesLeft;
   },
   checkWin: function checkWin() {
      if (this.state.matchedCards.length === this.state.cards.length / 2) {
         var that = this;
         clearInterval(TIMER);
         setTimeout(function () {
            that.setState({
               cards: []
            }, function () {
               setTimeout(function () {
                  var pairs = this.state.pairs + 1,
                      level = this.state.level + 1,
                      hs = localStorage.getItem("matchCardsScore"),
                      cards = this.makeCards(pairs),
                      gameTime = this.getInitialState().timer + (level - 1) * 10;
                  if (level > hs) {
                     localStorage.setItem("matchCardsScore", level);
                  }
                  this.setState({
                     pairs: pairs,
                     level: level,
                     hints: 2,
                     timer: gameTime,
                     guessesLeft: 3,
                     cancels: 1,
                     cards: cards,
                     matchedCards: [],
                     selectedCards: []
                  }, function () {
                     // Reset card classes from previous level
                     var currCards = document.getElementsByClassName("number-card");
                     for (var i = 0; i < currCards.length; i++) {
                        currCards[i].classList.remove("flipped");
                        currCards[i].classList.remove("valid");
                     }
                     this.startGame();
                  });
               }.bind(that), 1000);
            });
         }, 500);
      }
   },
   useHint: function useHint() {
      if (this.state.hints > 0) {
         var hints = this.state.hints - 1;
         this.showHint(3000, false);
         this.setState({
            hints: hints
         });
      }
   },
   _clearSelected: function _clearSelected(event) {
      if (event.keyCode == 27 && this.state.cancels > 0) {
         var cancels = this.state.cancels - 1;
         this.state.selectedCards.forEach(function (card) {
            card.resetCard();
         });
         this.setState({
            selectedCards: [],
            cancels: cancels
         });
      }
   },
   _shuffleCards: function _shuffleCards(array) {
      var currentIndex = array.length,
          temporaryValue,
          randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

         // Pick a remaining element...
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;

         // And swap it with the current element.
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
      }

      return array;
   },
   render: function render() {
      if (this.state.startGame) {
         if (this.state.gameOver) {
            return React.createElement(
               "div",
               { className: "container" },
               React.createElement(
                  "div",
                  { className: "row" },
                  React.createElement(
                     "div",
                     { className: "col-xs-6 col-xs-offset-3" },
                     React.createElement(
                        "h1",
                        null,
                        "Game Over!"
                     ),
                     React.createElement(
                        "p",
                        null,
                        "Try Again?"
                     ),
                     React.createElement(
                        "button",
                        { className: "btn btn-primary", onClick: this.startGame.bind(this, 1500) },
                        "Start Game"
                     )
                  )
               )
            );
         } else {
            return React.createElement(
               "div",
               { className: "container" },
               React.createElement(
                  "div",
                  { className: "row" },
                  React.createElement(
                     "div",
                     { id: "GameBoard", className: "col-xs-10" },
                     this.state.cards.map(function (number, idx) {
                        return React.createElement(NumberCard, {
                           number: number,
                           key: idx,
                           ref: 'number' + idx,
                           guessCard: this.guessCard,
                           guessesLeft: this.state.guessesLeft
                        });
                     }.bind(this))
                  ),
                  React.createElement(
                     "div",
                     { id: "PlayerScore", className: "col-xs-2" },
                     React.createElement(PlayerControls, {
                        hints: this.state.hints,
                        useHint: this.useHint,
                        guessesLeft: this.state.guessesLeft,
                        level: this.state.level,
                        timer: this.state.timer
                     })
                  )
               )
            );
         }
      } else {
         return React.createElement(
            "div",
            { className: "container" },
            React.createElement(GameInfo, { startGame: this.startGame })
         );
      }
   }
});

var PlayerControls = React.createClass({
   displayName: "PlayerControls",

   useHint: function useHint() {
      this.props.useHint();
   },
   render: function render() {
      var disabled = this.props.hints === 0,
          hs = localStorage.getItem("matchCardsScore"),
          highScore = !hs ? "1" : hs;
      return React.createElement(
         "div",
         null,
         React.createElement(
            "h3",
            null,
            "Level ",
            this.props.level
         ),
         React.createElement(
            "button",
            { className: "btn btn-primary", disabled: disabled, onClick: this.useHint },
            this.props.hints,
            " Hints Remaining"
         ),
         React.createElement(
            "p",
            null,
            this.props.guessesLeft,
            " tries left"
         ),
         React.createElement(
            "p",
            null,
            React.createElement(
               "strong",
               null,
               "High Score"
            ),
            ": ",
            highScore
         ),
         React.createElement(
            "p",
            null,
            React.createElement(
               "strong",
               null,
               "Time Left"
            ),
            ": ",
            this.props.timer
         )
      );
   }
});

var MatchCardsGame = React.createClass({
   displayName: "MatchCardsGame",

   render: function render() {
      return React.createElement(
         "div",
         null,
         React.createElement(GameBoard, { pairs: 4, level: 1 })
      );
   }
});

ReactDOM.render(React.createElement(MatchCardsGame, null), document.getElementById('matchGame'));