import React, { PureComponent } from "react";

import { $t } from '../../../i18n/i18n.service'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

const styles = require('./clickingPanel.scss');

import * as dataModels from '../clickingExample.dataModels';

import { getDocumentClickHandler } from '../../../shared/addons/clickOutside.addon';

interface ClickingPanelProps { 
    clickingData: dataModels.ClickingData | null;
    homeButtonClickedHandler: () => void;
    homeButtonClickedOutsideHandler: () => void;
}

export default class ClickingPanel extends PureComponent<ClickingPanelProps, {}> {

    /* Private Class Properties */

    private homeButtonWrapperRef: HTMLDivElement | null;

    /* Lifecycle Methods */

    componentDidMount() {
        this.boundDocumentClickHandler = getDocumentClickHandler(this, this.homeButtonWrapperRef, this.props.homeButtonClickedOutsideHandler);
        document.addEventListener('click', this.boundDocumentClickHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.boundDocumentClickHandler);
    }

    /* Class Methods */

    boundDocumentClickHandler(event: MouseEvent) {}

    render() {
        const { clickingData, homeButtonClickedHandler, homeButtonClickedOutsideHandler } = this.props;
        return <div className="clicking-panel">
            <div className={`${styles.homeButtonWrapper} margined-content`} ref={(homeButtonWrapper) => {this.homeButtonWrapperRef = homeButtonWrapper}}>
                <FloatingActionButton mini={true} onClick={homeButtonClickedHandler}>
                    <FontIcon className="material-icons">home</FontIcon>
                </FloatingActionButton>
            </div>
            {clickingData && clickingData.homeButtonClickCount && <p className={styles.clickingDataText}>
                {$t.formatMessage({id: 'clickingExample.homeButtonClicked'}, 
                    {count: clickingData.homeButtonClickCount})}
            </p>}
            {clickingData && clickingData.homeButtonClickOutsideCount && <p className={styles.clickingDataText}>
                {$t.formatMessage({id: 'clickingExample.homeButtonClickedOutside'}, 
                    {count: clickingData.homeButtonClickOutsideCount})}
            </p>}
        </div>
    }
}

