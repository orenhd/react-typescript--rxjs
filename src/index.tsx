/**
 * index.ts
 * - Responsible only for init. of the React instacne, 
 * by rendering the main Application Component, along with its localization, material-ui theming and routing
 **/

import * as React from "react";
import * as ReactDOM from "react-dom";

import { HashRouter } from 'react-router-dom';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {IntlProvider} from 'react-intl';

import * as i18nService from "./i18n/i18n.service";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Application from "./application/application"

ReactDOM.render(
    <IntlProvider locale={i18nService.locale} messages={i18nService.messages} key={i18nService.locale}>
        <MuiThemeProvider>
            <HashRouter>
                <Application/>
            </HashRouter>
        </MuiThemeProvider>
    </IntlProvider>,
    document.getElementById("app")
);