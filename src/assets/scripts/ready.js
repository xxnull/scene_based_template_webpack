import $ from 'jquery';
import _ from 'lodash';
import Loader from './loader';

export default function Ready(ActivityModel, data) {
  $('a').first().trigger('focus');
  Loader();
  const sliders = _.uniq($('.defaultstyle')
    .map((i, e) => $(e).data('slide')));
  return new ActivityModel(sliders.length + 1, data);
}
