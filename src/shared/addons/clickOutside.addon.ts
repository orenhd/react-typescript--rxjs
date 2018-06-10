/**
 * getDocumentClickHandler
 * A higher-order function returning a document click handler for click outside events
 * @param compClass:any - a react component class
 * @param nodeRef: any - the native dom element ref. to be clicked outside
 * @param callback:Function - the callback functio for click outside event
 */

export function getDocumentClickHandler(compClass: any, elRef: any, callback: Function): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
        if (!elRef) return;

        if (elRef === event.target) return;

        let curEl: any = event.target;

        while(curEl.parentElement) {
            if (curEl.parentElement === elRef) {
                return;
            } else {
                curEl = curEl.parentElement;
            }
        }

        if (callback) callback();
    }
}