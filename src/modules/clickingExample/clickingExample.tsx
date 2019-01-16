import React, { SFC } from "react";

import { connect, SelectorsMap, MethodsMap } from '../../shared/connectToServices';

import * as dataModels from './clickingExample.dataModels';

import UserNameBar from './components/userNameBar';
import ClickingPanel from './components/clickingPanel';

import * as clickingExampleService from "./clickingExample.service";

interface ClickingExamplesProps { 
    userName: string;
    clickingData: dataModels.ClickingData | null;
    setUserName: any;
    homeButtonClicked: any;
    homeButtonClickedOutside: any;
}

const ClickingExample: SFC<ClickingExamplesProps> = (props: ClickingExamplesProps) => { // export disconnected class for testing purposes
    const { userName, clickingData, setUserName, homeButtonClicked, homeButtonClickedOutside } = props;
    return <div className="clicking-example margined-content">
        { userName !== undefined && <UserNameBar
            userName={userName} 
            userNameChangedHandler={setUserName}
        />}
        <ClickingPanel
            clickingData={clickingData}
            homeButtonClickedHandler={homeButtonClicked}
            homeButtonClickedOutsideHandler={homeButtonClickedOutside}
        />
    </div>
}

const mapSelectorsToProps: SelectorsMap = {
    userName: clickingExampleService.userName$,
    clickingData: clickingExampleService.clickingData$,
}

const mapMethodsToProps: MethodsMap = {
    setUserName: clickingExampleService.setUserName,
    homeButtonClicked: clickingExampleService.homeButtonClicked,
    homeButtonClickedOutside: clickingExampleService.homeButtonClickedOutside,
}

export default connect(mapSelectorsToProps, mapMethodsToProps)(ClickingExample);