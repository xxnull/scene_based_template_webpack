const mils = 5000;
let timeStart = (Date.now() + mils);

/**
 * Allow to check loader process.
 */
function checkLearnosityLoading() {
  const timeNow = Date.now();
  let isToCheck = true;

  if (timeStart <= timeNow) {
    isToCheck = false;
    timeStart = (Date.now() + mils);
  }

  postMessage(isToCheck);
  setTimeout('checkLearnosityLoading()', 1000);
}

checkLearnosityLoading();
