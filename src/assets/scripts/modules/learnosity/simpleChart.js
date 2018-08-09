// global $;

/**
 * Class for Learnosity type SimpleChart (Line chart)
 * @constructor
 */
export default function SimpleChart() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
SimpleChart.prototype.startStepHandler = function (isForDone = false) {
    var ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var learnosityItem = $(elem + ".learnosity-item").attr("data-reference");
    var questions = [];

    $.each(itemsApp.getItems()[learnosityItem].questions, function (index, question) {
        var responseId = question.response_id; // Get the response ID.
        var question = itemsApp.questions()[responseId]; // Get lernosity question.
        var type = question.getQuestion().type;
        if (type === 'simplechart') questions.push(question);
    });

    questions.forEach(function (question) {
        question.on("changed", ref.SimpleChart.updateCheck.bind(ref, questions, isForDone));
    });

    this.removeValidationStyles(); // Remove validation styles.
    this.showCheckAnswerButtons(); // Update button visibility.
    this.disableNextButton(true); // Disable 'Next' button.
    this.enableQuestion(learnosityItem); // Enable the inputs.
    this.initBaseButtons(); // Init buttons handlers.
}

/**
* Updates slide check button enabled/disabled state.
*/
SimpleChart.prototype.updateCheck = function (questions, isForDone = false) {
    let ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var someEmpty = false;

    questions.map(function (question) {
        var response = question.getResponse();
        // TODO: Extend possible validation
        if (!response) someEmpty = true;
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
