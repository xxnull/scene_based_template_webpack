// global $;

/**
 * Class for Learnosity type SimpleShading (Shading)
 * @constructor
 */
export default function SimpleShading() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
SimpleShading.prototype.startStepHandler = function (isForDone = false) {
    var ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var learnosityItems = $(elem + ".learnosity-item");
    var questions = [];

    learnosityItems.each(function (index, learnosityItem) {
        var reference = $(learnosityItem).attr("data-reference");
        $.each(itemsApp.getItems()[reference].questions, function (index, question) {
            var responseId = question.response_id; // Get the response ID.
            var question = itemsApp.questions()[responseId]; // Get lernosity question.
            var type = question.getQuestion().type;
            if (type === 'simpleshading') {
                questions.push(question);
            }
        });

        questions.map(function (question) {
           question.on("changed", ref.SimpleShading.updateCheck.bind(ref, questions, isForDone));
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
SimpleShading.prototype.updateCheck = function (questions, isForDone = false) {
    let ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var someEmpty = false;

    questions.map(function (question) {
        var response = question.getResponse();
        if (!response || !response.value.length) {
            someEmpty = true;
        }
    });

    if (someEmpty) {
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
