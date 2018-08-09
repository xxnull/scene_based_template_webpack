/**
 * Class for toggles on views.
 * @constructor
 */
export default class Toggle {
  /**
   * Global toggle for start screen.
   * @param {boolean} toShow - indicates whether to show or not
   */
  startScreen(toShow) {
    if (toShow) {
      $('.activity-start-screen').show();
    } else {
      $('.activity-start-screen').hide();
    }
  }

  /**
   * Global toggle for loading screen.
   * @param {boolean} toShow - indicates whether to show or not
   */
  loadingScreen(toShow) {
    if (toShow) {
      $('.loading-screen').show();
    } else {
      $('.loading-screen').hide();
    }
  }

  hideQuestionValidationIcon(elem) {
    $(`${elem} .lrn_correct`).removeClass('lrn_correct');
    $(`${elem} .lrn_incorrect`).removeClass('lrn_incorrect');
  }

  questionValidationIcon(elem, isCorrect) {
    this.hideQuestionValidationIcon(elem);

    if (isCorrect) {
      $(`${elem}.iconPlace`).addClass('lrn_correct');
    } else {
      $(`${elem}.iconPlace`).addClass('lrn_incorrect');
    }
  }
}
