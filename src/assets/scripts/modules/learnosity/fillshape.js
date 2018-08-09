/**
 * Class for Learnosity type FillShape
 * @constructor
 */
export default function FillShape() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
FillShape.prototype.startStepHandler = function (isForDone) {
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var learnosityItem = $(elem + " .learnosity-item").attr("data-reference");
    var item = itemsApp.getItems()[learnosityItem];
    var questions = itemsApp.questions();

    item.questions.forEach((function (el) {
        var id = el.response_id;
        var question = questions[id];
        if (question.getQuestion().type === 'fillshape') {
            var update = this.FillShape.updateCheck.bind(this, question, !!isForDone);
            question.on("changed", update);
        }
    }).bind(this));

    this.removeValidationStyles(); // Remove validation styles.
    this.showCheckAnswerButtons(); // Update button visibility.
    this.disableNextButton(true); // Disable 'Next' button.
    this.enableQuestion(learnosityItem); // Enable the inputs.
    this.initBaseButtons(); // Init buttons handlers.
}

/**
* Updates slide check button enabled/disabled state.
*/
FillShape.prototype.updateCheck = function (question, isForDone) {
    var elem = ".activity-slide[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var response = question.getResponse();
    var values = response.responses || response.value || [];
    var disable = !values.some(function (value) {
        return (Array.isArray(value) ? !!value.length : !!value);
    });

    this.checkBtn.prop('disabled', disable);
    if (disable) this.checkBtn.add('disabled');
    else this.checkBtn.removeClass('disabled');

    if (!!isForDone) {
        this.doneBtn
            .prop('disabled', false)
            .removeClass('disabled');
    }
}
