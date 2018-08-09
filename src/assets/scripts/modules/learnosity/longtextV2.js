// global $;

/**
 * Class for Learnosity type LongtextV2 (Math formula)
 * @constructor
 */
export default function LongtextV2() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
LongtextV2.prototype.startStepHandler = function (isForDone = false) {
    var ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var learnosityItems = $(elem + ".learnosity-item");

    var setCheckButtonState = (function(isEnabled) {
        if (isEnabled) {
            this.checkBtn
                .prop('disabled', false)
                .removeClass('disabled');

            if (isForDone) {
                this.doneBtn
                    .prop('disabled', false)
                    .removeClass('disabled');
            }
        } else {
            this.checkBtn
                .prop('disabled', true)
                .addClass('disabled');

            if (isForDone) {
                this.doneBtn
                    .prop('disabled', true)
                    .addClass('disabled');
            }
        }
    }).bind(this);

    learnosityItems.each(function (i, learnosityItem) {
        var reference = $(learnosityItem).attr("data-reference");
        var questions = itemsApp.getItems()[reference].questions;
        var validations = questions.map(function (question) {
          var responseId = question.response_id; // Get the response ID.
          var question = itemsApp.questions()[responseId]; // Get lernosity question.
          return question.getQuestion().type !== 'longtextV2';
        });

        questions.forEach(function (question, index) {
            var responseId = question.response_id; // Get the response ID.
            var question = itemsApp.questions()[responseId]; // Get lernosity question.
            if (question.getQuestion().type === 'longtextV2') {
              question.on("changed", function () {
                var enableThisQuestion = ref.LongtextV2.updateCheck(question);
                validations[index] = enableThisQuestion;
                var mayEnableBtn = validations.every(function (enable) {
                    return enable;
                });

                setCheckButtonState(mayEnableBtn);
              });
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
LongtextV2.prototype.updateCheck = function (question, isForDone = false) {
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var response = question.getResponse();
    var values = response.responses || response.value;
    var text = values.replace(/<\/?[^>]+(>|$)/g, "");
    return !!text.length;
}
