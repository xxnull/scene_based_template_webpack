// global $;

/**
 * Class for Learnosity type ImageClozeFormula (Math formula)
 * @constructor
 */
export default function ImageClozeFormula() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
ImageClozeFormula.prototype.startStepHandler = function (isForDone = false) {
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
          return question.getQuestion().type !== 'imageclozeformula';
        });

        questions.forEach(function (question, index) {
            var responseId = question.response_id; // Get the response ID.
            var question = itemsApp.questions()[responseId]; // Get lernosity question.
            if (question.getQuestion().type === 'imageclozeformula') {
              question.on("changed", function () {
                var enableThisQuestion = ref.ImageClozeFormula.updateCheck.call(ref, question);
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
ImageClozeFormula.prototype.updateCheck = function (question) {
    let ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var response = question.getResponse();
    var values = response.value;
    var enable = values.every(function (value) {
        return (value || '').trim();
    });

    $.each(values, function (index, value) {
        if (value) {
            ref.ImageClozeFormula.removeMaxNum(ref, value);
        }
    });

    return enable;
}

/**
 * Base remove max num in learnosity math.
 */
ImageClozeFormula.prototype.removeMaxNum = function (ref, value) {
    var maxValue = this.dataJSON.config.grade > 3 ? 8 : 6;

    if (value.length > maxValue) {
        var button = $("button.lrn_btn_grid[title='Backspace']:visible");
        $(button).click();
    }
}
