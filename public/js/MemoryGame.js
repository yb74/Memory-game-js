class MemoryGame {
    // ToBeFixed : when restarting game, e.preventDefault() in setPairsCount method doesn't work the first time as we initialize the <form> with Form class
    constructor() {
        this.root = document.getElementById("root");

        this.pairsCount = null; // Number of pairs of cards

        const form = new Form();
        form.createForm();

        document.getElementById("submit-btn").addEventListener("click", (e) => this.setPairsCount(e)); // Change event listener

        this.deck = [];
        this.playerCards = [];
        this.currentlyFlipped = [];
        this.tries = 0;

        this.timer = null; // Timer ID will be stored here
        this.seconds = 0; // Counter for seconds
    }

    initializeStatsDisplay() {
        const timerContainerElt = document.createElement("div");
        timerContainerElt.classList.add("stats-container")
        this.root.appendChild(timerContainerElt);

        const timeDisplay  = document.createElement("p")
        timeDisplay.innerHTML = `<p>Tries: 0</p>`

        this.timeDisplay = document.createElement("p");
        this.timeDisplay.textContent = "Time: 0s";

        this.triesDisplay = document.createElement("p");
        this.triesDisplay.textContent = "Tries: 0";

        const statsContainer = document.querySelector(".stats-container");
        statsContainer.appendChild(this.timeDisplay);
        statsContainer.appendChild(this.triesDisplay);
    }

    updateStats() {
        this.timeDisplay.textContent = `Time: ${this.seconds}s`;
        this.triesDisplay.textContent = `Tries: ${this.tries}`;
    }

    startTimer() {
        this.timer = setInterval(() => {
            console.log(`Timer: ${this.seconds} seconds`);
            this.seconds++;
            // Update the stats text content in the DOM for the time here
            this.updateStats()
        }, 1000); // Update every 1000ms (1 second)
    }

    stopTimer() {
        clearInterval(this.timer);
        // adding time to gameOverMessageContainer
        const gameOverMessageContainer = document.querySelector(".game-over-message-container");
        const newParagraph = document.createElement("p");
        newParagraph.classList.add("time-spent-text")
        newParagraph.textContent = `Time: ${this.seconds - 1}s`; // stopTimer is called inside a setTimeOut of 1 sec so we adjust the seconds accordingly
        gameOverMessageContainer.appendChild(newParagraph);

    }

    setPairsCount(e) {
        e.preventDefault();
        const pairsCountInputVal = document.getElementById("deck-size-input").value; // Update input id
        const spanErrorElt = document.querySelector(".validation-error");

        // Check for valid input (even and at least 1 pair)
        if (pairsCountInputVal >= 1 && pairsCountInputVal % 1 === 0) {
            this.pairsCount = pairsCountInputVal;
            spanErrorElt.style.color = "black"; // Reset label style
            this.root.removeChild(document.getElementById("form-container"));
            this.generateDeck();
        } else {
            spanErrorElt.textContent = "Enter a valid number of pairs (at least 1) !!!";
        }
    }

    generateDeck() {
        for (let i = 1; i <= this.pairsCount; i++) {
            this.deck.push(i, i);
        }
        this.createBoard();
    }

    createBoard() {
        this.shuffleDeck()

        const cardsContainerElt = document.createElement("div")
        cardsContainerElt.classList.add("cards-container")

        this.deck.forEach((cardValue, index) => {
            // creating card div

            const cardElt = document.createElement("div")

            // setting attributes to cards
            cardElt.setAttribute("class", "card")
            cardElt.setAttribute("id", index)

            // creating card symbol in <p>
            const cardSymbolElt = document.createElement("p")
            cardSymbolElt.textContent = cardValue.toString()

            // appending cardSymbol in card div
            cardElt.appendChild(cardSymbolElt)
            cardElt.dataset.value = cardValue // Store card value in a data attribute
            cardElt.addEventListener("click", () => this.cardClicked(cardElt, index))

            cardsContainerElt.appendChild(cardElt)
            this.root.appendChild(cardsContainerElt)
        })

        this.initializeStatsDisplay()

        // starting the timer
       this.startTimer()
    }

    cardClicked(cardElt, cardIndex) {
        // Check if the card is already flipped or in the currentlyFlipped array
        if (!cardElt.classList.contains("flipped") && !this.currentlyFlipped.some(card => card.cardElt === cardElt) && this.currentlyFlipped.length < 2) {
            // Toggle the card value visibility on click
            cardElt.classList.toggle("flipped")

            // pushing into currentlyFlipped array an object with cardElt and cardIndex
            this.currentlyFlipped.push({ cardElt, cardIndex })

            // checking if 2 cards have been flipped
            if (this.currentlyFlipped.length === 2) {
                this.tries += 1

                this.updateStats()

                const card1Value = parseInt(this.currentlyFlipped[0].cardElt.dataset.value);
                const card2Value = parseInt(this.currentlyFlipped[1].cardElt.dataset.value);

                if (card1Value === card2Value) {
                    // Match found, remove the matched cards from the DOM and the deck
                    this.currentlyFlipped.forEach(({ cardElt: cardElt, cardIndex }) => {
                        cardElt.style.backgroundColor = "green"
                        cardElt.removeEventListener("click", this.cardClicked)

                        setTimeout(() => {
                            cardElt.remove();
                            this.deck[cardIndex] = null
                        }, 1000)
                    });

                    setTimeout(() => {
                        this.currentlyFlipped = []
                        this.playerCards.push(card1Value, card2Value)
                        if (this.deck.every(card => card === null)) {
                            // remove stats-container children
                            document.querySelector(".stats-container").style.display = "none"
                            // All cards have been matched and removed
                            this.showGameOverMessage()
                            // stopping the timer
                            this.stopTimer()
                        }
                    }, 1000)
                } else {
                    // No match, turn the cards red instantly and then flip them back
                    this.currentlyFlipped.forEach(({ cardElt: cardElt }) => {
                        cardElt.style.backgroundColor = "darkred";
                    });

                    setTimeout(() => {
                        this.currentlyFlipped.forEach(({ cardElt: cardElt }) => {
                            cardElt.classList.remove("selected-cards-animation")
                            cardElt.style.backgroundColor = "";
                            cardElt.classList.remove("flipped");
                        });
                        this.currentlyFlipped = [];
                    }, 1000);
                }
            }
        }
    }

    showGameOverMessage() {
        const messageContainerElement = document.createElement("div")
        messageContainerElement.classList.add("game-over-message-container")

        messageContainerElement.innerHTML = `<p class="game-over-message">Congratulations !!!</p> <p>All cards have been matched after</p> <p class="nbr-tries-text">${this.tries} tries</p>`

        const playAgainButton = document.createElement("button")
        playAgainButton.textContent = "Play Again"
        playAgainButton.classList.add("play-again-button")
        playAgainButton.addEventListener("click", () => this.resetGame())

        messageContainerElement.appendChild(playAgainButton)
        this.root.appendChild(messageContainerElement)
    }

    resetGame() {
        // Clear the game board and reset the game state
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild)
        }

        // creating form and appending it on DOM
        const form = new Form()
        form.createForm()

        this.playerCards = []
        this.currentlyFlipped = []

        // temporary fix to relaod page when resetting the game (prevent the bug that implies to submit twice the form after restart
        document.location.reload()
    }

    shuffleDeck() {
        // cards shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
        }
    }
}

new MemoryGame()