//@ts-nocheck
export const LICENSES = [
  {
    value: 'all-rights-reserved',
    text: 'All rights reserved',
    selectable: true,
  },
  {
    value: 'attribution-cc',
    text: 'Creative Commons Attribution',
    selectable: true,
  },
  {
    value: 'attribution-sharealike-cc',
    text: 'Attribution-ShareAlike BY-SA',
    selectable: true,
  },
  {
    value: 'attribution-noderivs-cc',
    text: 'Attribution-NoDerivs CC BY-ND',
    selectable: true,
  },
  {
    value: 'attribution-noncommercial-cc',
    text: 'Attribution-NonCommerical CC BY-NC',
    selectable: true,
  },
  {
    value: 'attribution-noncommercial-sharealike-cc',
    text: 'Attribution-NonCommerical-ShareAlike',
    selectable: true,
  },
  {
    value: 'attribution-noncommercial-noderivs-cc',
    text: 'Attribution-NonCommerical-NoDerivs',
    selectable: true,
  },
  {
    value: 'publicdomaincco',
    text: 'Public Domain CCO "No Rights Reserved',
    selectable: true,
  },

  // Software licenses. Used by ancient content.

  { value: 'gnuv3', text: 'GNU v3 General Public License' },
  { value: 'gnuv1.3', text: 'GNU v1.3 Free Documentation License' },
  { value: 'gnu-lgpl', text: 'GNU Lesser General Public License' },
  { value: 'gnu-affero', text: 'GNU Affero General Public License' },
  { value: 'apache-v1', text: 'Apache License, Version 1.0' },
  { value: 'apache-v1.1', text: 'Apache License, Version 1.1' },
  { value: 'apache-v2', text: 'Apache License, Version 2.0' },
  { value: 'mozillapublic', text: 'Mozilla Public License' },
  { value: 'bsd', text: 'BSD License' },
];

export const ACCESS = [
  { value: 0, text: 'Unlisted' },
  { value: 1, text: 'Loggedin' },
  { value: 2, text: 'Public' },
];

export type AccessType = typeof ACCESS[number]['value'];

export const REASONS = [
  { value: 1, label: 'Illegal' },
  { value: 2, label: 'Should be marked as explicit' },
  { value: 3, label: 'Encourages or incites violence' },
  {
    value: 4,
    label: 'Threatens, harasses, bullies or encourages others to do so',
  },
  { value: 5, label: 'Personal and confidential information' },
  {
    value: 6,
    label: 'Maliciously targets users (@name, links, images or videos)',
  },
  {
    value: 7,
    label: 'Impersonates someone in a misleading or deceptive manner',
  },
  { value: 8, label: 'Spam' },
  { value: 10, label: 'This infringes my copyright' },
  { value: 11, label: 'Another reason' },
];

export const REPORT_ACTIONS = {
  explicit: 'Marked as Explicit',
  spam: 'Marked as Spam',
  delete: 'Deleted',
};

/**
 * Get the license text
 */
const getText = (data, value) => {
  const lic = data.find((license) => value === license.value);
  if (!lic) return;
  return lic.text;
};

export const getLicenseText = (value) => {
  return getText(LICENSES, value);
};

export const getAccessText = (value) => {
  return getText(ACCESS, value);
};
