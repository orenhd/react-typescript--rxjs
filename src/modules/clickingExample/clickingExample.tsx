import React, { PureComponent } from "react";

import { Subscription } from 'rxjs/Subscription'

import * as dataModels from './clickingExample.dataModels';

import UserNameBar from './components/userNameBar';
import ClickingPanel from './components/clickingPanel';

import * as clickingExampleService from "./clickingExample.service";

interface ClickingExamplesState { 
    userName: string;
    clickingData: dataModels.ClickingData;
}

export default class ClickingExample extends PureComponent<{}, ClickingExamplesState> {

    private subscriptions: Subscription[] = [];

    /* Lifecycle Methods */

    componentWillMount() {
        /* Map Services Subscriptions */

        this.subscriptions.push(clickingExampleService.userName$.subscribe((userName) => {
                this.setState({userName});
            })
        );

        this.subscriptions.push(clickingExampleService.clickingData$.subscribe((clickingData) => {
                this.setState({clickingData});
            })
        );
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    /* Class Methods */

    setUserName(userName: string) {
        clickingExampleService.setUserName(userName);
    }

    homeButtonClicked() {
        clickingExampleService.homeButtonClicked();
    }

    homeButtonClickedOutside() {
        clickingExampleService.homeButtonClickedOutside();
    }

    render() {
        return <div className="clicking-example margined-content">
            <UserNameBar 
                userName={this.state.userName} 
                userNameChangedHandler={this.setUserName}
            />
            <ClickingPanel
                clickingData={this.state.clickingData}
                homeButtonClickedHandler={this.homeButtonClicked}
                homeButtonClickedOutsideHandler={this.homeButtonClickedOutside}
            />
        </div>
    }
}