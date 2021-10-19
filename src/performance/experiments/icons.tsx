import { Icon, IconNext } from '~ui/icons';

const getRandom = array => array[Math.floor(Math.random() * array.length)];

const icons = ['home', 'remind', 'plus', 'chatOff', 'settings', 'hashtag'];
const size = ['tiny', 'small', 'medium', 'large', 'huge'];
const active = [true, false];
const style = [{ backgroundColor: 'red' }, null, null, null];
const spacingTop = ['1x', '2x', '3x'];

const generateIcons = () => {
  const res: any = [];
  for (let i = 0; i < 10000; i += 1) {
    res.push({
      name: getRandom(icons),
      size: getRandom(size),
      active: getRandom(active),
      style: getRandom(style),
      spacingTop: getRandom(spacingTop),
    });
  }

  return res;
};

const experimentA = {
  id: 'experimentA',
  name: 'Legacy Icon Component',
  mount: generateIcons,
  update: generateIcons,
  component: IconNext,
};

const experimentB = {
  id: 'experimentB',
  name: 'Next Icon Component',
  mount: generateIcons,
  update: generateIcons,
  component: Icon,
};

const experiments = [experimentA, experimentB];

export default experiments;
