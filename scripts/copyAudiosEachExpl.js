const fs = require('fs');
const { exec } = require('child_process');

exec('ls src', (err, stdout, stderr) => {
  if (err) return;
  const explorations = stdout.split(/\n/g);

  const copyAudiosEachExpl = () => {
    const exploration = explorations.shift();
    if (!exploration) return;
    if (exploration.substr(0, 2) !== '19') {
      copyAudiosEachExpl();
      return;
    };
    console.log(exploration);
    const audioFolder = `src/${exploration}/audio/`;
    const cleanFolder = `rm -rf ${audioFolder}*`;
    const json = `src/${exploration}/data/activity.json`;
    const activity = JSON.parse(fs.readFileSync(json, 'utf8'));

    const screens = activity.screen;

    const startCopy = (err, stdout, stderr) => {
      if (err) console.log(stderr);
      copyCurrentScreenAudios();
    };

    console.log(screens.map(screen => screen.data_slide));

    let i = 0;

    const copyCurrentScreenAudios = () => {
      const screen = screens[i++];
      if (screen) {
        screen.audio_en = `audio/${exploration}_${screen.data_slide}.mp3`;
        screen.audio_sp = `audio/${exploration}_${screen.data_slide}.mp3`;
        console.log(`filename: ${screen.audio_en}`);
        const makeDir = `mkdir ${audioFolder}`;
        const copyBash = `cp ${screen.audio_en} ${audioFolder}`;
        exec(makeDir, () => exec(copyBash, startCopy));
      } else {
        fs.writeFile(json, JSON.stringify(activity, null, 4)+"\n", () => copyAudiosEachExpl());
      }
    };

    exec(cleanFolder, startCopy);
  };

  copyAudiosEachExpl();
});
