import wifi from 'node-wifi';

wifi.init({});

/**
 * Mode to be passed to the `networks->start` function.
 */
export const enum NetworkScanMode {
    Active,
    Available,
}

/**
 * A map of handlers pertaining to a certain {@link NetworkScanMode}
 */
export const HANDLERS = {
    [NetworkScanMode.Active]: wifi.getCurrentConnections,
    [NetworkScanMode.Available]: wifi.scan,
};
