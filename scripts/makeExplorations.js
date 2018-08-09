const fs = require('fs');
const { exec } = require('child_process');

const items = JSON.parse(fs.readFileSync('items.json', 'utf8')).items;

const makeExploration = () => {
  const item = items.pop();
  console.log(item);
  if (item) {
    const { jira, learnosity, exploration, omit = false } = item;

    if (omit) {
      makeExploration();
      return;
    }

    const inicio = `git checkout master && git checkout -b ${jira}`;
    const copia = `cp -R limpia src/${exploration}`;
    const fin = `git add src/${exploration} && git commit -m "${jira}: ${exploration}" && git push origin ${jira}`;

    exec(inicio, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      exec(copia, (err) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log({ inicio, copia, fin });

        const filename = `src/${exploration}/data/activity.json`;
        const ids = learnosity.split(",");
        const activity = JSON.parse(fs.readFileSync(filename, 'utf8'));
        const screen = activity.screen[0];
        activity.screen = [];
        let grade = exploration.split("_")[0];
        grade = parseInt(grade.substr(grade.length - 1))
        activity.config.grade = grade;

        ids.forEach((id, index) => {
          const template = { ...screen };
          template.data_slide = index + 1;
          template.learnosity_id = `${exploration}_${id}`;
          activity.screen.push(template);
        })

        fs.writeFile(filename, JSON.stringify(activity, null, 4));
        exec(fin, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          makeExploration();
        });
      });
    });
  }
};

makeExploration();
