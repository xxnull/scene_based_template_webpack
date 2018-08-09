import Toggle from './modules/events/toggles';

export default class ShellModel {
  constructor(slidesCount, data) {
    this.data = data;
    this.curSlide = 1;
    this.totalSlides = 1;
    this.selectedLang = 'en';
    this.audioPlayer = null;
    this.locale = null;
    this.doneBtn = $('.btn-done');
    this.nextBtn = $('.btn-next');
    this.slideElem = null;
    this.checkBtn = null;
    this.tryBtn = null;
    this.showBtn = null;
    this.Toggle = new Toggle();
    this.resetActivityHandler = this.baseResetHandler.bind(this);
    this.init(slidesCount);

    $('.start-btn img').on('click', () => {
      $('.activity-start-screen').hide();
      $('.activity').show();
      $('.footer-bar').addClass('masked');
      this.startActivity();
    });

    this.handleInputValidation();
  }

  /**
   * @param {number} totalSlides - the number of slides in the activity
   */
  init(totalSlides) {
    this.totalSlides = totalSlides;

    $('.btn-audio-caption, .btn-reset, .btn-playpause, .btn-next, .btn-done').hide();
    $('.activity-navigation .btn-vol').click(() => {
      this.audioToggleHandler();
    });

    $('.activity-navigation .btn-audio-caption').click(() => {
      this.audioCaptionToggleHandler();
    });

    this.nextBtn.click(() => {
      this.disableCurrentScreen();
      this.nextButtonHandler();
      this.showSlide();
    });

    $('.activity .activity-navigation .btn-back').click(() => {
      this.backButtonHandler();
    });

    $('.activity-navigation .btn-reset').click(() => {
      this.resetButtonHandler();
    });

    this.doneBtn.click(() => {
      this.disableButton(this.doneBtn, true);
      this.disableCurrentScreen();
      window.itemsApp.save();
    });

    $('.activity-navigation .btn-playpause').click((event) => {
      if ($(event.currentTarget).hasClass('btn-play')) {
        this.playAudioHandler();
      } else {
        this.pauseAudioHandler();
      }
    });

    $('.activity-navigation .language-toggle .option').click((event) => {
      $('.activity-navigation .language-toggle .option').removeClass('active');
      $(event.currentTarget).addClass('active');

      this.selectedLang = $(event.currentTarget).attr('lang-id');
      const langSelector = $('.activity-navigation .language-toggle');

      if (langSelector.hasClass('open')) {
        langSelector.removeClass('open').addClass('closed');

        // TESTING ONLY:
        if (this.locale) {
          this.locale.applyLocale(this.selectedLang);
        }
      } else {
        langSelector.removeClass('closed').addClass('open');
      }
    });
  }

  /**
   *
   */
  startActivity() {
    $('.activity .activity-wrapper').show();
    $('.btn-audio-caption,.btn-reset,.btn-playpause,.btn-next,.btn-done').show();
    this.showHideNextBackButtons();
    this.showSlide();
  }

  /**
   *
   */
  audioToggleHandler() {
    const toggleVolBtn = $('.activity-navigation .btn-vol');
    if (toggleVolBtn.hasClass('btn-audio-on')) {
      toggleVolBtn
        .removeClass('btn-audio-on')
        .addClass('btn-audio-off')
        .attr('aria-label', 'A mute button'); // TODO: use locale.
      this.muteUnmuteAudio(0);
    } else {
      toggleVolBtn
        .removeClass('btn-audio-off')
        .addClass('btn-audio-on')
        .attr('aria-label', 'An audio button'); // TODO: use locale.
      this.muteUnmuteAudio(1);
    }
  }

  /**
   *
   */
  audioCaptionToggleHandler() {
    const caption = $('.footer-bar .activity-audio-caption');
    if (caption.is(':visible')) {
      caption.slideUp();
      $('.activity-container').removeClass('captions-active');
    } else {
      caption.slideDown();
      $('.activity-container').addClass('captions-active');
    }
  }

  /**
   *
   */
  nextButtonHandler() {
    if (this.curSlide < this.totalSlides) {
      this.curSlide = this.curSlide + 1;
      this.showHideNextBackButtons();
    }
  }

  /**
   *
   */
  backButtonHandler() {
    if (this.curSlide > 1) {
      this.curSlide = this.curSlide - 1;
      this.showHideNextBackButtons();
      this.showSlide();
    }
  }

  /**
   *
   */
  resetButtonHandler() {
    const ref = this;
    this.curSlide = 1;
    ref.resetActivityHandler();
    ref.showHideNextBackButtons();
  }

  /**
   *
   */
  showHideNextBackButtons() {
    const backBtn = $('.activity .activity-navigation .btn-back');
    if (this.curSlide > 1) {
      backBtn.show();
    } else {
      backBtn.hide();
    }

    if (this.curSlide < this.totalSlides - 1) {
      this.nextBtn.show();
    } else {
      this.nextBtn.hide();
    }

    if (this.curSlide === this.totalSlides - 1) {
      this.doneBtn.show().removeClass('disabled');
    } else if (this.curSlide === this.totalSlides) {
      // this.doneBtn.addClass("disabled");
    } else {
      this.doneBtn.hide();
    }
  }

  /**
   *
   */
  showSlide() {
    const slides = $('.defaultstyle');
    slides.hide();
    slides.removeClass('current-slide');
    $('.footer-bar .activity-audio-caption .slide-audio').hide();
    this.pauseAllAudios();

    slides.each((i, elem) => {
      const slide = parseInt($(elem).attr('data-slide'), 10);
      const after = $(elem).attr('data-after');

      if (slide < this.curSlide) {
        if (after === 'show') {
          $(elem).show();
        } else {
          $(elem).hide();
        }
      } else if (slide === this.curSlide) {
        $(elem).show();
        $(elem).addClass('current-slide');
      } else {
        $(elem).hide();
      }
    });

    // By default always disable the next button on slide load.
    if (this.curSlide > 1 && this.curSlide < this.totalSlides) {
      this.disableNextButton(true);
    }

    this.loadSlideElements();
    this.playAudioHandler();
    this[`step${this.curSlide}Handler`]();
    setTimeout(() => this.scrollIntoView(), 50);
  }

  /**
   *
   */
  loadSlideElements() {
    this.slideElem = $(`.defaultstyle[data-slide="${this.curSlide}"]`);
    this.checkBtn = this.slideElem.find('.btn-check');
    this.tryBtn = this.slideElem.find('.btn-try-again');
    this.showBtn = this.slideElem.find('.btn-show-me');
  }

  /**
   *
   */
  pauseAllAudios() {
    $('.activity-audio').each((i, elem) => {
      try {
        $(elem)[0].pause();
        $(elem)[0].currentTime = 0;
      } catch (e) { /**/ }
    });
  }

  /**
   * @param vol
   */
  muteUnmuteAudio(vol) {
    $('.activity-audio').each((i, elem) => {
      $(elem)[0].volume = vol;
    });
  }

  /**
   *
   */
  playAudioHandler() {
    $(`.footer-bar .activity-audio-caption .slide-audio[data-slide='${this.curSlide}']`).show();

    if (this.audioPlayer) {
      this.audioPlayer.removeEventListener('ended', this.onAudioEnded);
    }

    let locale;

    if (this.selectedLang === 'en') {
      locale = '.english ';
    } else {
      locale = '.spanish ';
    }

    this.audioPlayer = null;

    if ($(`${locale}.activity-audio[data-slide='${this.curSlide}']`).length > 0) {
      const [player] = $(`${locale}.activity-audio[data-slide='${this.curSlide}']`);
      this.audioPlayer = player;
      this.audioPlayer.play();
      this.audioPlayer.addEventListener('ended', this.onAudioEnded);

      const bntPlay = $('.activity-navigation .btn-playpause ');

      bntPlay.removeClass('btn-play')
        .addClass('btn-stop')
        .attr('aria-label', 'A pause button'); // TODO: use locale.
    }
  }

  /**
   *
   */
  pauseAudioHandler() {
    if ($(`.activity-audio[data-slide='${this.curSlide}']`).length > 0) {
      $(`.activity-audio[data-slide='${this.curSlide}']`)[0].pause();
      const bntPlay = $('.activity-navigation .btn-playpause ');

      bntPlay.removeClass('btn-stop')
        .addClass('btn-play')
        .attr('aria-label', 'A play button'); // TODO: use locale.
    }
  }

  /**
   *
   */
  onAudioEnded() {
    const bntPlay = $('.activity-navigation .btn-playpause ');

    bntPlay.removeClass('btn-stop')
      .addClass('btn-play')
      .attr('aria-label', 'A play button'); // TODO: use locale.
  }

  /**
   *
   * @param {string} learnosityId - the Learnosity item id.
   */
  disableQuestion(learnosityId) {
    const item = window.itemsApp.getItems()[learnosityId];
    $.each(item.response_ids, (idx, responseId) => {
      window.itemsApp.question(responseId).disable();
    });
  }

  /**
   * @function disableCurrentScreen
   */
  disableCurrentScreen() {
    const elem = `.activity-slides-area div[data-slide='${this.curSlide}'] `;
    const learnosityItems = $(`${elem}.learnosity-item`);
    learnosityItems.each((index, learnosityItem) => {
      this.disableQuestion($(learnosityItem).attr('data-reference'));
    });
  }

  /**
   *
   * @param {string} learnosityId - the Learnosity item id.
   */
  enableQuestion(learnosityId, isCustom) {
    if (isCustom) {
      const question = window.itemsApp.questionsApp().questions()[learnosityId];
      question.enable();
    } else {
      const item = window.itemsApp.getItems()[learnosityId];
      $.each(item.response_ids, (idx, responseId) => {
        window.itemsApp.question(responseId).enable();
      });
    }
  }

  /**
   *
   * @return {RegExpMatchArray | null} returns whether this is a mobile/table device.
   */
  isTablet() {
    const deviceAgent = navigator.userAgent.toLowerCase();
    return deviceAgent.match(/(mobi|tablet|iphone|ipod|ipad|android)/);
  }

  /**
   * Sets the disabled property on an element.
   * @param {element} elem - the jquery element
   * @param {boolean} value - the disabled value (true, false).
   */
  disableButton(elem, value) {
    elem.prop('disabled', value);
    if (value === true) {
      elem.addClass('disabled');
    } else {
      elem.removeClass('disabled');
    }
  }

  /**
   * Disables the Next button.
   * @param {boolean} value - {true} to disable or {false} to enable
   */
  disableNextButton(value) {
    this.disableButton(this.nextBtn, value);
  }

  /**
   * Disables the Done button.
   * @param {boolean} value - {true} to disable or {false} to enable
   */
  disableDoneButton(value) {
    this.disableButton(this.doneBtn, value);
  }

  /**
   *
   * @param enableCheck - whether to enable the check button or not.
   */
  showCheckAnswerButtons(enableCheck) {
    this.checkBtn.show();
    this.tryBtn.hide();
    this.showBtn.hide();

    if (enableCheck === undefined || !enableCheck) {
      this.checkBtn.prop('disabled', true);
      this.checkBtn.addClass('disabled');
    } else {
      this.checkBtn.prop('disabled', false);
      this.checkBtn.removeClass('disabled');
    }
  }

  /**
   *
   */
  showCheckAnswerCorrectButtons() {
    this.checkBtn.hide();
    this.tryBtn.hide();
    this.showBtn.hide();
  }

  /**
   *
   */
  showCheckAnswerIncorrectButtons() {
    this.checkBtn.hide();
    this.tryBtn.show();
    this.showBtn.show();
  }

  /**
   *
   * @param enableCheck - whether to enable the check or disable the check.
   */
  showTryAgainButtons(enableCheck) {
    this.showCheckAnswerButtons(enableCheck);
  }

  /**
   *
   */
  showShowAnswerButtons() {
    this.checkBtn.hide();
    this.tryBtn.hide();
    this.showBtn.hide();
  }

  scrollIntoView(side = null) {
    const screen = this.getCurrentScreen() || {};
    const finalSide = side || screen.align;
    const prefix = this.data.config.cells[0].type || 'column';
    const selector = `.${prefix}-${finalSide} .activity-slides-area`;
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }

  /**
   * Base init handler buttons
   */
  initBaseButtons(isCustom = false) {
    const elem = `.defaultstyle[data-slide='${this.curSlide}'] `;

    // Init variables
    this.checkBtn = $(`${elem}#check_btn`);
    this.tryBtn = $(`${elem}#try_btn`);
    this.showBtn = $(`${elem}#show_btn`);

    // Add click handlers.
    this.checkBtn.off('click').on('click', this.stepBaseCheckAnswer.bind(this, isCustom));
    this.tryBtn.off('click').on('click', this.stepBaseTryAgain.bind(this, isCustom));
    this.showBtn.off('click').on('click', this.stepBaseShowAnswer.bind(this, isCustom));
  }

  /**
   * @param {string} learnosityId - the Learnosity item id.
   * @return {boolean} whether the question(s) are correct.
   */
  checkAnswer(learnosityId, isCustom = false) {
    let response = false;
    const checkAnswerInternal = (question) => {
      const hasValidation = question.checkValidation().has_validation;
      let valid = false;

      if (!hasValidation) {
        valid = true;
      } else {
        question.validate();
        valid = !!question.isValid();
      }

      if (typeof this.customCheckAnswer === 'function') {
        valid = this.customCheckAnswer(question, valid, hasValidation);
      }

      question.disable();

      return valid;
    };

    if (isCustom) {
      const question = window.itemsApp.questionsApp().questions()[learnosityId];
      question.guiValidate();
      response = checkAnswerInternal(question);
    } else {
      const item = window.itemsApp.getItems()[learnosityId];

      response = item.response_ids.map((responseId) => {
        const question = window.itemsApp.question(responseId);
        return checkAnswerInternal(question);
      }).every(valid => valid);
    }
    return response;
  }

  /**
   * Base check answer click handler.
   */
  stepBaseCheckAnswer(isCustom = false) {
    const elem = `.defaultstyle[data-slide='${this.curSlide}'] `;
    let learnosityItems = $(`${elem}.learnosity-item`);

    if (isCustom) {
      learnosityItems = $(`${elem}.learnosity-custom-question`);
    }

    const isValid = learnosityItems.toArray().every((learnosityItem) => {
      const reference = $(learnosityItem).attr('data-reference');
      return this.checkAnswer(reference, isCustom);
    });

    if (isValid) {
      this.showCheckAnswerCorrectButtons();

      if (this.curSlide < this.totalSlides - 1) {
        this.disableNextButton(false);
      } else {
        this.disableDoneButton(false);
      }
    } else {
      this.showCheckAnswerIncorrectButtons();
    }
  }

  /**
   * Base try again click handler.
   */
  stepBaseTryAgain(isCustom = false) {
    const elem = `.defaultstyle[data-slide='${this.curSlide}'] `;
    let learnosityItems = $(`${elem}.learnosity-item`);

    if (isCustom) {
      learnosityItems = $(`${elem}.learnosity-custom-question`);
    }

    this.showTryAgainButtons(true); // Update button visibility.

    learnosityItems.each((index, learnosityItem) => {
      const reference = $(learnosityItem).attr('data-reference');
      this.enableQuestion(reference, isCustom);
    });

    this.Toggle.hideQuestionValidationIcon(elem);
  }

  /**
  * Base show answer click handler.
  */
  stepBaseShowAnswer(isCustom = false) {
    this.showShowAnswerButtons();

    if (this.curSlide < (this.totalSlides - 1)) {
      this.disableNextButton(false);
    } else {
      this.disableDoneButton(false);
    }

    const elem = `.defaultstyle[data-slide='${this.curSlide}'] `;
    let learnosityItems = $(`${elem}.learnosity-item`);

    if (isCustom) {
      learnosityItems = $(`${elem}.learnosity-custom-question`);
    }

    learnosityItems.each((index, learnosityItem) => {
      const reference = $(learnosityItem).attr('data-reference');

      if (isCustom) {
        const question = window.itemsApp.questionsApp().questions()[reference];

        const hasValidation = question.checkValidation().has_validation;
        if (hasValidation) question.showAnswer();
      } else {
        const items = window.itemsApp.getItems();
        const { questions } = items[reference];

        questions.forEach((questionData) => {
          const question = window.itemsApp.questions()[questionData.response_id];
          const hasValidation = question.checkValidation().has_validation;
          if (hasValidation) question.validate({ showCorrectAnswers: true });
          if (this.customShowMeAnswer) this.customShowMeAnswer();
        });
      }
    });

    setTimeout(() => this.scrollIntoView(), 50);
  }

  /**
   * Base reset click handler.
   */
  baseResetHandler(withNext = false) {
    this.Toggle.loadingScreen(true);
    window.itemsApp.reset();
    window.execute(); // from learnosityHandler.js

    setTimeout(() => {
      this.startActivity();
      this.Toggle.loadingScreen(false);
      this.Toggle.startScreen(false);
    }, 3000);

    this.disableNextButton(withNext); // Enable the next button
    this.disableDoneButton(true); // Disable the done button
  }

  /**
   * Show floating element of current slide
   */
  showCurrentFloatElement() {
    const $elems = $(`.defaultstyle[data-slide='${this.curSlide}']`);
    const floatElements = $('.lrn.lrn_float_element_container .lrn-float-element[data-lrn-float]');

    $elems.each((index, elem) => {
      floatElements.each((index2, floatElement) => {
        const $div = $(`div#${$(floatElement).attr('data-lrn-float')}`);
        const $container = $(floatElement).parent();

        if ($div.closest(elem).length) {
          $container.addClass('show_element');
        } else {
          $container.removeClass('show_element');
        }
      });
    });
  }


  /**
   * Common start for many step-handlers
   */
  startStepHandler(enableNavButton = false, isCustom = false) {
    const setCheckButtonState = () => {
      const isEnabled = this.shouldCheckBeEnable();
      const navButton = this.curSlide === this.totalSlides - 1
        ? this.doneBtn
        : this.nextBtn;

      if (isEnabled) {
        this.checkBtn
          .prop('disabled', false)
          .removeClass('disabled');
        if (enableNavButton) {
          navButton
            .prop('disabled', false)
            .removeClass('disabled');
        }
      } else {
        this.checkBtn
          .prop('disabled', true)
          .addClass('disabled');
        if (enableNavButton) {
          navButton
            .prop('disabled', true)
            .addClass('disabled');
        }
      }
    };

    const elem = `.defaultstyle[data-slide='${this.curSlide}'] `;
    let learnosityItems = null;

    if (isCustom) {
      learnosityItems = $(`${elem}.learnosity-custom-question`);
    } else {
      learnosityItems = $(`${elem}.learnosity-item`);
    }

    this.currentQuestions = [];

    learnosityItems.each((index, learnosityItem) => {
      const reference = $(learnosityItem).attr('data-reference');

      if (isCustom) {
        const questions = window.itemsApp.questionsApp().questions()[reference];
        this.currentQuestions.push(questions);
        // this.enableQuestion(reference); // Enable the inputs.
      } else {
        let { questions } = window.itemsApp.getItems()[reference];
        questions = questions.map((question) => {
          const responseId = question.response_id; // Get the response ID.
          return window.itemsApp.questions()[responseId]; // Get lernosity question.
        });
        this.currentQuestions.push(...questions);
        this.enableQuestion(reference); // Enable the inputs.
      }
    });

    this.currentQuestions.forEach((question) => {
      question.on('changed', () => setCheckButtonState());
    });

    this.showCheckAnswerButtons(); // Update button visibility.
    this.disableNextButton(true); // Disable 'Next' button.
    this.initBaseButtons(isCustom); // Init buttons handlers.
  }

  /**
  * Should slide check button state be enabled.
  */
  shouldCheckBeEnable() {
    return this.currentQuestions.every((question) => {
      const response = question.getResponse();
      const { type } = question.getQuestion();
      const omit = ['highlight'];
      const hasValidation = omit.indexOf(type) === -1;
      let enableCheck = false;

      if (response && hasValidation) {
        switch (type) {
          case 'mcq':
          case 'association':
          case 'clozeformula':
          case 'clozetext': {
            const values = response.value || response.responses;
            const blanks = values.filter(value => value === '' || value === null);
            enableCheck = blanks.length === 0;
            break;
          }
          case 'formulaV2': {
            const values = response.responses;
            const blanks = values.filter(value => value === '' || value === null);
            enableCheck = blanks.length === 0;
            break;
          }
          case 'imageclozeassociation':
          case 'fillshape': {
            const values = response.responses || response.value || [];
            enableCheck = values
              .some(value => (Array.isArray(value) ? !!value.length : !!value));
            break;
          }
          case 'imageclozeformula': {
            const values = response.value;
            enableCheck = values.every(value => (value || '').trim());
            break;
          }
          case 'longtextV2': {
            const values = response.responses || response.value;
            const text = values.replace(/<\/?[^>]+(>|$)/g, '');
            enableCheck = !!text.length;
            break;
          }
          case 'numberlineplot': {
            const values = response.responses || response.value;
            enableCheck = values.length;
            break;
          }
          case 'simpleShading': {
            enableCheck = response.value.length;
            break;
          }
          default:
            enableCheck = true;
            break;
        }
      } else if (!hasValidation) {
        enableCheck = true;
      }

      return enableCheck;
    });
  }

  getCurrentScreen() {
    const { screen } = this.data;
    return screen[this.curSlide - 1];
  }

  handleInputValidation() {
    const handleInput = (event, $input) => {
      const screen = this.getCurrentScreen() || {};
      const input = $input.text();
      const { length } = input;
      const { onlyNumbers = false } = screen.keypad || {};
      const maxLength = (screen.keypad || {}).maxLength
        || (this.data.config.grade > 3 ? 8 : 6);

      let stop;
      let key;
      const isKey = (/^key/g).test(event.type);
      if (isKey) {
        stop = length > maxLength;
        key = event.keyCode;
      } else {
        stop = (length - 1) > maxLength;
        key = $(event.target).html().charCodeAt();
      }

      if (onlyNumbers) {
        stop = stop || (key < 48 || key > 59);
      }
      if (stop) {
        if (isKey) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          const backspace = 'button.lrn_btn_grid[title="Backspace"]:visible';
          $(backspace).click();
        }
      }
    };

    const selectors = [
      '.mq-editable-field.mq-inner-editable',
      '.lrn_textinput.lrn-clozeformula-input.lrn_cloze_response',
    ];

    const focused = [
      '.lrn_math_editable.mq-editable-field.mq-math-mode.lrn_focused',
      '.mq-editable-field.mq-inner-editable',
    ];

    const buttonSelector = 'button[data-mq-command="write"]';

    $(document.body).on('keydown', selectors.join(), (e) => {
      const $input = $(e.currentTarget);
      handleInput(e, $input);
    });

    $(document.body).on('click touchend', buttonSelector, (e) => {
      const $input = $(focused.join());
      handleInput(e, $input, true);
    });
  }

  /**
   * Deprecated method
   * Will be removed soon
   */
  removeValidationStyles() { }
}
