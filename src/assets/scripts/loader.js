import $ from 'jquery';

function stopLoaderWorker(worker) {
  $('.loading-screen').hide();
  $('.activity-start-screen').show();
  worker.terminate();
}

export default function startLoaderWorker() {
  let worker;

  if (typeof (Worker) !== 'undefined') {
    if (typeof (w) === 'undefined') {
      worker = new Worker('../assets/scripts/worker.js');
    }

    worker.onmessage = (event) => {
      if (typeof (window.itemsApp) !== 'undefined' &&
        typeof (window.itemsApp.getItems) === 'function' &&
        event.data) {
        const items = window.itemsApp.getItems();
        const itemsCount = document.querySelectorAll('.learnosity-item').length;
        const count = Object.keys(items)
          .filter(key => Object.prototype.hasOwnProperty.call(items, key))
          .reduce(counter => counter + 1, 0);

        let questionsLoaded = false;

        try {
          window.itemsApp.questions();
          questionsLoaded = true;
        } catch (e) {
          questionsLoaded = false;
        }

        if (itemsCount === count && questionsLoaded) {
          stopLoaderWorker(worker);
        }
      } else if (!event.data) {
        if (typeof (window.itemsApp) !== 'undefined') {
          window.itemsApp.reset();
        }

        window.execute();
      }
    };
  } else {
    console.error('Sorry, your browser does not support Web Workers...');
  }
}
