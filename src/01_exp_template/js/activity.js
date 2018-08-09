/* global itemsApp */
import ShellModel from '../../assets/scripts/shell';

export default class ActivityModel extends ShellModel {
  step1Handler() {
    this.disableNextButton(false);
    this.loadCustomQuestions();
  }

  step2Handler() {
    this.startStepHandler(false, true);
  }

  step3Handler() {
    this.startStepHandler();
  }

  step4Handler() {
    this.startStepHandler(false, true);
  }

  step5Handler() {
    this.startStepHandler();
  }

  step6Handler() {
    this.startStepHandler(true);
  }

  loadCustomQuestions() {
    if (itemsApp.questionsApp().append) {
      itemsApp.questionsApp().append({
        questions: [
          {
            response_id: 'custom-dnd-04_exp1_int_exp_4',
            type: 'custom',
            js: 'js/screen02.js',
            score: 1,
          },
          {
            response_id: 'custom-dnd-04_exp1_int_exp_4',
            type: 'custom',
            js: 'js/screen04.js',
            score: 1,
          },
        ],
      });
    }
  }
}
