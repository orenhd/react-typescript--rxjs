import React, { Component } from "react";

import { FormattedMessage } from 'react-intl';
import { $t } from '../i18n/i18n.service';

import { NavLink, Route, Redirect } from 'react-router-dom';

import { Subscription } from 'rxjs/Subscription';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';

const styles = require('./application.scss'); // use require to bypass typescript import, which requires typings 

import * as clickingExampleService from "../modules/clickingExample/clickingExample.service";
import * as topTwentyAlbumsService from "../modules/topTwentyAlbums/topTwentyAlbums.service";

import * as topTwentyDataModels from '../modules/topTwentyAlbums/topTwentyAlbums.dataModels';

import * as clickingExmapleConsts from '../modules/clickingExample/clickingExample.consts';
import * as topTwentyConsts from '../modules/topTwentyAlbums/topTwentyAlbums.consts';

/* module components */
import ClickingExample from "../modules/clickingExample/clickingExample";
import TopTwentyAlbums from "../modules/topTwentyAlbums/topTwentyAlbums";

interface ApplicationState {
    open: boolean,
    greeting: string,
    currentGenre: topTwentyDataModels.ITunesGenre | null;
}

export default class Application extends Component<{}, ApplicationState> {

    state: ApplicationState = { open: false, greeting: '', currentGenre: null };
    private subscriptions: Subscription[] = [];

    /* Lifecycle Methods */

    componentDidMount() {
        /* Map Services Subscriptions */

        this.subscriptions.push(clickingExampleService.userName$.subscribe((userName) => {
                this.setState({greeting: userName ? $t.formatMessage({ id: 'general.greeting' }, {userName}) : ''});
            }),
            topTwentyAlbumsService.currentGenre$.subscribe((currentGenre: topTwentyDataModels.ITunesGenre | null) => {
                this.setState({ currentGenre });
            }),
        );
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    /* Class Methods */

    handleToggle = () => this.setState({ open: !this.state.open});
    handleRequestChange = (open: boolean) => this.setState({open});
    handleClose = () => this.setState({ open: false });

    render() {
        const { open, greeting, currentGenre } = this.state;
        return <div className="application">
        <AppBar
            title={greeting}
            iconElementRight={currentGenre ? <Chip>{currentGenre.title}</Chip> : undefined}
            onLeftIconButtonClick={this.handleToggle}
        />
        <Drawer 
            className={styles.appDrawer}
            docked={false} 
            open={open}
            onRequestChange={this.handleRequestChange}
        >
          <MenuItem className={styles.menuItemTitle}>
                <FormattedMessage id="general.navigation" />
          </MenuItem>
          <NavLink activeClassName={styles.navLinkActive} to={`/${clickingExmapleConsts.MODULE_ROUTE}`}>
            <MenuItem 
                leftIcon={<FontIcon className="material-icons">mouse</FontIcon>} 
                onClick={this.handleClose}
                >
                    <FormattedMessage id="clickingExample.clickingExample" />
            </MenuItem>
          </NavLink>
          <NavLink activeClassName={styles.navLinkActive} to={`/${topTwentyConsts.MODULE_ROUTE}`} >
            <MenuItem 
                leftIcon={<FontIcon className="material-icons">album</FontIcon>} 
                onClick={this.handleClose}
                >
                    <FormattedMessage id="topTwentyAlbums.topTwentyAlbums" />
            </MenuItem>
          </NavLink>
        </Drawer>
        <Route path={`/${clickingExmapleConsts.MODULE_ROUTE}`} component={ClickingExample}/>
        <Route path={`/${topTwentyConsts.MODULE_ROUTE}`} component={TopTwentyAlbums}/>
        <Route path={`/${topTwentyConsts.MODULE_ROUTE}/:genreId`} component={TopTwentyAlbums}/>
        <Route exact path="/" render={() => (
            <Redirect to={`/${topTwentyConsts.MODULE_ROUTE}`} />
        )}/>
        </div>;
    }
}