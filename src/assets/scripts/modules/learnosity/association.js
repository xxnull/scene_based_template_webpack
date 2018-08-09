// global $;

/**
 * Class for Learnosity type Association
 * @constructor
 */
export default function Association() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
Association.prototype.startStepHandler = function (isForDone = false) {
    var ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var learnosityItems = $(elem + ".learnosity-item");

    learnosityItems.each(function (index, learnosityItem) {
        var reference = $(learnosityItem).attr("data-reference");
        $.each(itemsApp.getItems()[reference].questions, function (index, question) {
            var responseId = question.response_id; // Get the response ID.
            var question = itemsApp.questions()[responseId]; // Get lernosity question.
            var type = question.getQuestion().type;
            if (type === 'association') {
                question.on("changed", ref.Association.updateCheck.bind(ref, question, isForDone));
            }
        });

        ref.enableQuestion(reference); // Enable the inputs.
    });

    this.removeValidationStyles(); // Remove validation styles.
    this.showCheckAnswerButtons(); // Update button visibility.
    this.disableNextButton(true); // Disable 'Next' button.
    this.initBaseButtons(); // Init buttons handlers.
}

/**
* Updates slide check button enabled/disabled state.
*/
Association.prototype.updateCheck = function (question, isForDone = false) {
    let ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var response = question.getResponse();
    var values = response.responses || response.value;
    var blanks = values.filter(function (value) {
        return value === "" || value === null;
    });
    
    if (blanks.length > 0) {
        this.checkBtn
            .prop('disabled', true)
            .addClass('disabled');

        if (isForDone) {
            this.doneBtn
                .prop('disabled', true)
                .addClass('disabled');
        }
    } else {
        this.checkBtn
            .prop('disabled', false)
            .removeClass('disabled');

        if (isForDone) {
            this.doneBtn
                .prop('disabled', false)
                .removeClass('disabled');
        }
    }
}