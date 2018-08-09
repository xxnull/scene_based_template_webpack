/**
 * Class for Learnosity type AssociationV2
 * @constructor
 */
export default function ImageClozeAssociationV2() {
    this.dataJSON = {};
}

/**
 * Common start for many step-handlers
 */
ImageClozeAssociationV2.prototype.startStepHandler = function (isForDone) {
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var learnosityItem = $(elem + " .learnosity-item").attr("data-reference");
    var item = itemsApp.getItems()[learnosityItem];
    var questions = itemsApp.questions();

    item.questions.forEach((function (el) {
        var id = el.response_id;
        var question = questions[id];
        if (question.getQuestion().type === 'imageclozeassociationV2') {
            var update = this.ImageClozeAssociationV2.updateCheck.bind(this, question, !!isForDone);
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
ImageClozeAssociationV2.prototype.updateCheck = function (question, isForDone) {
    var elem = ".activity-slide[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var response = question.getResponse();
    var values = response.responses || response.value || [];
    var disable = !values.some(function(val) {
        return Array.isArray(val) ? !!val.length : !!val;
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
