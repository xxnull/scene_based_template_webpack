/**
 * Class for Learnosity type Hotspot
 * @constructor
 */
export default function Hotspot() { }

/**
 * Common start for many step-handlers
 */
Hotspot.prototype.startStepHandler = function (isForDone = false) {
    var elem = ".defaultstyle[data-slide='" + this.curSlide + "'] ";
    var learnosityItem = $(elem + " .learnosity-item").attr("data-reference");
    var item = itemsApp.getItems()[learnosityItem];
    var questions = itemsApp.questions();

    item.questions.forEach((function (el) {
        var id = el.response_id;
        var question = questions[id];
        var update = this.Hotspot.updateCheck.bind(this, question, isForDone);
        question.on("changed", update);
    }).bind(this));

    this.removeValidationStyles(); // Remove validation styles.
    this.showCheckAnswerButtons(); // Update button visibility.
    this.disableNextButton(true); // Disable 'Next' button.
    this.enableQuestion(learnosityItem); // Enable the inputs.
    this.initBaseButtons(); // Init buttons handlers.

    // bind additional DOM changes on try again for this specific module:
    this.customHotspotTryAgain = this.Hotspot.customTryAgain.bind(this);
    this.tryBtn.on('click', this.customHotspotTryAgain);
    this.showBtn.one('click', (function() {
        this.tryBtn.off('click', this.customHotspotTryAgain);
    }).bind(this));
}

/**
* Updates slide check button enabled/disabled state.
*/
Hotspot.prototype.updateCheck = function (question, isForDone = false) {
    var elem = ".activity-slide[data-slide='" + this.curSlide + "'] ";
    var checkBtn = $(elem + '#check_btn');
    var response = question.getResponse();
    var values = response.responses || response.value;
    var disable = !values.length;

    this.checkBtn.prop('disabled', disable);
    if (disable) this.checkBtn.add('disabled');
    else this.checkBtn.removeClass('disabled');

    if (isForDone) {
        this.doneBtn
            .prop('disabled', false)
            .removeClass('disabled');
    }
}

/**
 * Custom answer checker
 * Remember to bind this function into the shell class within activity.js
 * This piece of code will fix a strange ui bug
 * with the Hotspot learnosity component.
 */
Hotspot.prototype.customCheckAnswer = function (question, valid, hasValidation) {
    if (hasValidation) {
        var response = question.getResponse().value;
        var validResponse = question.getQuestion().validation.valid_response.value;
        var listItems = $('.lrn-hotspot-wrapper ul.lrn-polygons-labels li');
        var checkboxes = $('a[role="checkbox"].lrn-selected').filter(function (index, item) {
            var id = String($(item).data('lrn-index'));
            return response.indexOf(id) > -1;
        });

        checkboxes.each(function (index, item) {
            var $item = $(item);
            var id = String($item.data('lrn-index'));
            var isCorrect = validResponse.indexOf(id) > -1;
            var cssclass = isCorrect ? 'lrn_correct' : 'lrn_incorrect';

            setTimeout(function() {
                $item.addClass(cssclass);
                listItems.eq(index).addClass(cssclass);
            }, 20);
        });
    }

    if (valid && this.customHotspotTryAgain) {
        this.tryBtn.off('click', this.customHotspotTryAgain);
    }

    return valid;
}


Hotspot.prototype.customTryAgain = function () {
    $('.lrn-hotspot-wrapper ul.lrn-polygons-labels').remove();
}
