import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Ready from '../assets/scripts/ready';
import BaseView from '../assets/scripts/baseview';
import ActivityModel from './js/activity';
import data from './data/activity.json';
import './styles/custom.scss';

require('../assets/styles/global.scss');
require('bootstrap-loader');

(() => {
  // View preload and config.
  const baseview = new BaseView(data);
  // View instance for exploration.
  $(document).ready(() => Ready(ActivityModel, data));
})();
