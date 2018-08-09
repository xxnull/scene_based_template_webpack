/**
 * Documentation for Custom Questions.
 * https://docs.learnosity.com/assessment/questions/knowledgebase/customquestions
 * https://docs.learnosity.com/demos/products/questionsapi/questiontypes/custom.php
 */

/* global LearnosityAmd */
/* global learningComponentsJS */
function LearnosityCustom($) {
  let lcJS = null;

  class CustomQuestion {
    constructor(init) {
      this.$ = $;
      this.init = init;

      const config = jQuery.extend(true, {}, learningComponentsJS.ComponentConfig.DragAndDrop);
      config.parentClass = init.$el;
      config.type = learningComponentsJS.ComponentType.DragAndDrop.JoinItems;
      config.width = 397;
      config.height = 200;
      config.resize = false;
      config.score = 1;
      config.operation = '[3, 2]';
      config.itemsPosition = 'right';
      config.padding = 20;
      config.dashArray = [1, 2];
      config.fillColor = 'transparent';
      config.strokeColor = 'black';
      config.strokeWidth = 2;
      config.item = [{
        shape: 'image',
        dashArray: [1, 0],
        fillColor: '',
        strokeColor: '',
        strokeWidth: 1,
        srcImage: 'images/bloque_1.png',
        width: 66, // 96
        height: 76, // 76
        weight: 0,
        groupId: '',
      }];

      lcJS = new learningComponentsJS.Factory(config);
      lcJS.change(this.changed.bind(this));

      init.events.trigger('ready');

      this.functionOverride();
    }
    changed(event) {
      this.init.events.trigger('changed', event);
    }
    functionOverride() {
      const facade = this.init.getFacade();
      facade.disable = this.disable;
      facade.enable = this.enable;
      facade.showAnswer = this.showAnswer;
      facade.guiValidate = this.guiValidate;
    }
    disable() {
      lcJS.disable();
    }
    enable() {
      lcJS.enable();
    }
    guiValidate() {
      lcJS.guiValidate();
    }
    showAnswer() {
      lcJS.showAnswer();
      this.guiValidate();
    }
  }

  class CustomQuestionScorer {
    constructor(question, response) {
      this.question = question;
      this.response = response;
    }
    isValid() {
      return lcJS.isValid();
    }
    score() {
      return lcJS.score();
    }
    maxScore() {
      return lcJS.maxScore();
    }
  }

  return {
    Question: CustomQuestion,
    Scorer: CustomQuestionScorer,
  };
}

LearnosityAmd.define(['jquery-v1.10.2'], LearnosityCustom);
