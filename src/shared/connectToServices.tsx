import React, { PureComponent } from "react";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export interface SelectorsMap {
  [propKey: string]: Observable<any>
}

export interface MethodsMap {
  [propKey: string]: any // a service method
}

interface ConnectedComponentProps {
  selectorsMap: SelectorsMap,
  methodsMap: MethodsMap,
  WrappedComponent: any, // react component class or functional component
  passedProps: any
}

export const connect = (selectorsMap: SelectorsMap, methodsMap: MethodsMap) => (WrappedComponent: any) => {
  return class extends PureComponent<ConnectedComponentProps, any> {

    private subscriptions: Subscription[] = [];
  
    /* Lifecycle Methods */
  
    componentDidMount() {
      /* Subscribe to Mapped Selectors */

      this.subscriptions = Object.keys(selectorsMap).map((propKey): Subscription =>
        selectorsMap[propKey].subscribe((value) => {
          this.setState({ [propKey]: value });
        })
      );
    }
  
    componentWillUnmount() {
      /* Unubscribe from Mapped Selectors */
  
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }
  
    render() {
      return <WrappedComponent 
        {...this.props}
        {...this.state}
        {...methodsMap}
      />
    }
  }
}