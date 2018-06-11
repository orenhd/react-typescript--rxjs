import React, { Component } from "react";

import {FormattedMessage, FormattedDate} from 'react-intl';
import { $t } from '../i18n/i18n.service';

import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import { Subscription } from 'rxjs/Subscription';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

const styles = require('./application.scss'); // use require to bypass typescript import, which requires typings 

import * as clickingExampleService from "../modules/clickingExample/clickingExample.service";

/* module components */
import ClickingExample from "../modules/clickingExample/clickingExample";
import TopTwentyAlbums from "../modules/topTwentyAlbums/topTwentyAlbums";

interface ApplicationState { open: boolean, greeting: string }

export default class Application extends Component<{}, ApplicationState> {

    state: ApplicationState = { open: false, greeting: '' };
    private subscriptions: Subscription[] = [];

    /* Lifecycle Methods */

    componentDidMount() {
        /* Map Services Subscriptions */

        this.subscriptions.push(clickingExampleService.userName$.subscribe((userName) => {
                this.setState({greeting: userName ? $t.formatMessage({ id: 'general.greeting' }, {userName}) : ''});
            })
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
        return <div className="application">
        <AppBar
            title={this.state.greeting}
            onLeftIconButtonClick={this.handleToggle}
        />
        <Drawer 
            className={styles.appDrawer}
            docked={false} 
            open={this.state.open}
            onRequestChange={this.handleRequestChange}
        >
          <MenuItem className={styles.menuItemTitle}>
                <FormattedMessage id="general.navigation" />
          </MenuItem>
          <NavLink activeClassName={styles.navLinkActive} to="/clicking-example">
            <MenuItem 
                leftIcon={<FontIcon className="material-icons">mouse</FontIcon>} 
                onClick={this.handleClose}
                >
                    <FormattedMessage id="clickingExample.clickingExample" />
            </MenuItem>
          </NavLink>
          <NavLink activeClassName={styles.navLinkActive} to="/top-twenty">
            <MenuItem 
                leftIcon={<FontIcon className="material-icons">album</FontIcon>} 
                onClick={this.handleClose}
                >
                    <FormattedMessage id="topTwentyAlbums.topTwentyAlbums" />
            </MenuItem>
          </NavLink>
        </Drawer>
        <Route path="/clicking-example" component={ClickingExample}/>
        <Route path="/top-twenty" component={TopTwentyAlbums}/>
        <Route exact path="/" render={() => (
            <Redirect to="/top-twenty"/>
        )}/>
        </div>;
    }
}