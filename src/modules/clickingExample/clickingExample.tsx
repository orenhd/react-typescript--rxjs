import * as React from "react";

import { Subscription } from 'rxjs/Subscription'

import * as dataModels from './clickingExample.dataModels';

import UserNameBar from './components/userNameBar';
import ClickingPanel from './components/clickingPanel';

import * as clickingExampleService from "./clickingExample.service";

interface ClickingExamplesState { 
    userName: string;
    clickingData: dataModels.ClickingData;
    subscriptions: Subscription[];
}

export default class ClickingExample extends React.Component<{}, ClickingExamplesState> {

    /* Lifecycle Methods */

    componentWillMount() {
        let subscriptions: Subscription[] = [];

        /* Map Services Subscriptions */

        subscriptions.push(clickingExampleService.userName$.subscribe((userName) => {
                this.setState({userName});
            })
        );

        subscriptions.push(clickingExampleService.clickingData$.subscribe((clickingData) => {
                this.setState({clickingData});
            })
        );

        this.setState({subscriptions});
    }

    componentWillUnmount() {
        this.state.subscriptions.forEach((subscription) => {
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