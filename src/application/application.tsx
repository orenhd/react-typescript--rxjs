import React, { Component } from "react";

import { FormattedMessage } from 'react-intl';
import { $t } from '../i18n/i18n.service';

import { NavLink, Route, Redirect } from 'react-router-dom';

import { connect, SelectorsMap } from '../shared/connectToServices';

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

interface ApplicationProps {
    userName: string;
    currentGenre: topTwentyDataModels.ITunesGenre | null;
}

interface ApplicationState {
    open: boolean;
}

export class Application extends Component<ApplicationProps, ApplicationState> { // export disconnected class for testing purposes

    state: ApplicationState = { open: false };

    /* Class Methods */

    handleToggle = () => this.setState({ open: !this.state.open });
    handleRequestChange = (open: boolean) => this.setState({ open });
    handleClose = () => this.setState({ open: false });

    render() {
        const { userName, currentGenre } = this.props;
        const { open } = this.state;
        return <div className="application">
            <AppBar
                title={userName ? $t.formatMessage({ id: 'general.greeting' }, { userName }) : ''}
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
            <Route path={`/${clickingExmapleConsts.MODULE_ROUTE}`} component={ClickingExample} />
            <Route exact path={`/${topTwentyConsts.MODULE_ROUTE}`} component={TopTwentyAlbums} />
            <Route exact path={`/${topTwentyConsts.MODULE_ROUTE}/:genreId`} component={TopTwentyAlbums} />
            <Route exact path="/" render={() => (
                <Redirect to={`/${topTwentyConsts.MODULE_ROUTE}`} />
            )} />
        </div>;
    }
}

const mapSelectorsToProps: SelectorsMap = {
    userName: clickingExampleService.userName$,
    currentGenre: topTwentyAlbumsService.currentGenre$,
}

export default connect(mapSelectorsToProps, {})(Application);