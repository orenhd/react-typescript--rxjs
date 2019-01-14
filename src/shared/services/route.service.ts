import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { fromEvent } from 'rxjs/observable/fromEvent';

/* Private BehaviorSubjects */

const _windowLocation$: BehaviorSubject<Location> = new BehaviorSubject<Location>(window.location);

/* Private Observables */

const _hashChangeEvent$: Observable<HashChangeEvent> = fromEvent(window, 'hashchange');

/* Private Subscriptions */

const _hashChangeEventSubscription: Subscription = _hashChangeEvent$.subscribe(() => {
  _windowLocation$.next(window.location);
});

/* Public Selectors */

export const parsedHash$: Observable<string[]> = _windowLocation$.map((windowLocation: Location) => {
  const { hash } = windowLocation;

  if (!hash) return [];

  return hash.split('/');
});