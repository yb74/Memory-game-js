class Form {
    constructor() {
        this.mainContainer = document.querySelector(".main-container")
        // this.createForm()
    }
    createForm() {
        this.mainContainer.innerHTML = `
            <div id="form-container" class="form-container">
                <h2>Enter the number of pairs wanted</h2>
                <form id="deck-size-form" class="deck-size-form">
                    <span class="validation-error"></span>
                    <div class="form-group">
                        <label for="deck-size-input">Number of pairs</label>
                        <input id="deck-size-input" type="text" placeholder="Enter a number > 0">
                    </div>
                <button id="submit-btn" class="submit-btn">Submit</button>
                </form>
            </div>
        `
    }
}