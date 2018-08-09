import _ from 'lodash';
import $ from 'jquery';

let data = [];
const activityNav = '.footer-bar ';
const activitySlides = '.activity-slides-area';

/**
 * Base View Constructor.
 * @param {number} dataJSON - exploration JSON data.
 * @constructor
 */
export default class BaseView {
  constructor(dataJSON) {
    data = dataJSON;
    this.buildContentArea();
    this.buildNavBar();
    this.buildActivitySlide();
    this.buildAudiosHTML();
    this.buildCaptionsHTML();
  }

  /**
   * Build and render navigation bar from template.
   */
  buildNavBar() {
    $(activityNav).show();
  }

  /**
   * Build and render navigation bar from template.
   */
  buildContentArea() {
    const templateString = $('#activity-content-area-template').html();
    const templateFn = _.template(templateString);
    const renderHTML = templateFn({ $, cells: data.config.cells });
    $('.activity-content-area').append(renderHTML);
  }

  /**
   * Build and render activity slide from template.
   */
  buildActivitySlide() {
    const templateString = $('#activity-slide-template').html();
    const templateFn = _.template(templateString);
    let widthTag = '';

    if (data.config.cells[0].widthTag !== '') {
      widthTag = `-${data.config.cells[0].widthTag}`;
    }

    let cell = `.${data.config.cells[0].type}${widthTag}-${data.config.cells[0].align}`;

    if (data.config.cells.length === 2) {
      const renderLeftHTML = templateFn({
        $,
        explorations: data.screen,
        alignFor: data.config.cells[0].align,
      });

      $(`${cell} ${activitySlides}`).append(renderLeftHTML);

      if (data.config.cells[1].widthTag !== '') {
        widthTag = `-${data.config.cells[1].widthTag}`;
      }

      cell = `.${data.config.cells[1].type}${widthTag}-${data.config.cells[1].align}`;
      const renderRightHTML = templateFn({
        $,
        explorations: data.screen,
        alignFor: data.config.cells[1].align,
      });

      $(`${cell} ${activitySlides}`).append(renderRightHTML);
    } else {
      const renderHTML = templateFn({
        $,
        explorations: data.screen,
        alignFor: '__ignore',
      });

      $(`${cell} ${activitySlides}`).append(renderHTML);
    }
  }

  /**
   * Build and render audios from template.
   */
  buildAudiosHTML() {
    const templateString = $('#audios-template').html();
    const templateFn = _.template(templateString);
    const renderHTML = templateFn({ explorations: data.screen });
    $(activityNav).append(renderHTML);
  }

  /**
   * Build and render captions from template.
   */
  buildCaptionsHTML() {
    const templateString = $('#captions-template').html();
    const templateFn = _.template(templateString);
    const renderHTML = templateFn({ explorations: data.screen });
    $(activityNav).append(renderHTML);
  }
}
