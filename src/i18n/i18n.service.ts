/**
 * i18n.service
 * - Exposes assets required by react-intl, 
 * as well as the intl object, allowing imperative access to the api
 */

import {IntlProvider, addLocaleData} from 'react-intl';

import en from 'react-intl/locale-data/en';

export const locale = 'en';
export const messages = require('./i18n.en.json');

addLocaleData(en);

const intelProvider: IntlProvider = new IntlProvider({
  locale,
  messages
}, {});

export const $t = intelProvider.getChildContext().intl;