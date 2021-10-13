import Icon, { IconB, IconC, IconD, IconM } from '~ui/icons/Icon';

const getRandom = array => array[Math.floor(Math.random() * array.length)];

const icons = ['home', 'remind', 'plus', 'chatOff', 'settings', 'hashtag'];
const size = ['small', 'medium', 'large', 'huge'];
const active = [true, false];
const style = [{ backgroundColor: 'red' }, null, null, null];
const spacingTop = ['1x', '2x', '3x'];

const generateIcons = () => {
  const res: any = [];
  for (let i = 0; i < 1000; i += 1) {
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

const generateStaticIcons = () => {
  const res: any = [];
  for (let i = 0; i < 1000; i += 1) {
    res.push({
      name: icons[0],
      size: size[0],
      active: active[0],
      style: style[0],
      // spacingTop: getRandom(spacingTop),
    });
  }

  return res;
};

const exD = () => {
  function mount() {
    return generateIcons();
  }

  function component() {
    return IconD;
  }

  function update() {
    return mount();
  }

  return {
    id: 'expD',
    name: 'Pure Component',
    mount,
    update,
    component,
  };
};

const exA = () => {
  function mount() {
    return generateIcons();
  }

  function component() {
    return Icon;
  }

  function update() {
    return mount();
  }

  return {
    id: 'expA',
    name: 'w/ useStyle',
    mount,
    update,
    component,
  };
};

const exM = () => {
  function mount() {
    return generateIcons();
  }

  function component() {
    return IconM;
  }

  function update() {
    return mount();
  }

  return {
    id: 'expM',
    name: 'w/ useMemoStyle',
    mount,
    update,
    component,
  };
};

const exC = () => {
  function mount() {
    return generateIcons();
  }

  function component() {
    return IconC;
  }

  function update() {
    return mount();
  }

  return {
    id: 'expC',
    name: 'Styles Array w/ IC memoization',
    mount,
    update,
    component,
  };
};

const exB = () => {
  function mount() {
    return generateIcons();
  }

  function component() {
    return IconB;
  }

  function update() {
    return mount();
  }

  return {
    id: 'expB',
    name: 'Styles Array',
    mount,
    update,
    component,
  };
};

const experiments = [exA(), exM(), exB(), exC(), exD()];

export default experiments;
