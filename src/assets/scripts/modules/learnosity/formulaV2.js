// global $;

/**
 * Class for Learnosity type formulaV2 (Math formula)
 * @constructor
 */
export default function FormulaV2() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
FormulaV2.prototype.startStepHandler = function (isForDone = false) {
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
            if (type === 'formulaV2') {
                questions.push(question);
            }
        });

        questions.map(function (question) {
           question.on("changed", ref.FormulaV2.updateCheck.bind(ref, questions, isForDone));
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
FormulaV2.prototype.updateCheck = function (questions, isForDone = false) {
    let ref = this;
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var someEmpty = false;

    questions.map(function (question) {
        var response = question.getResponse();
        if (response) {
            var values = response.responses || response.value;
            var blanks = values.filter(function (value) {
                return value === "" || value === null;
            });
        }
        if (!response || blanks.length > 0) {
            someEmpty = true;
        }
        $.each(values, function (index, value) {
            ref.FormulaV2.removeMaxNum(ref, value);
        });
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

/**
 * Base remove max num in learnosity math.
 */
FormulaV2.prototype.removeMaxNum = function (ref, value) {
    var maxValue = this.dataJSON.config.grade > 3 ? 8 : 6;
    
    if (value.length > maxValue) {
        let button = $("button.lrn_btn_grid[title='Backspace']:visible");
        $(button).click();
    }
}
