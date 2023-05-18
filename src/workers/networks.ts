import { define, ParentThread } from 'nanolith';
import wifi, { type WiFiNetwork } from 'node-wifi';
import { diffNetworkList, sleep, sortNetworkList } from '../utils.js';
import { HANDLERS, NetworkScanMode } from '../constants.js';

type StartOptions = { mode: NetworkScanMode; interval?: number };

/**
 * Worker for watching and streaming network changes back to
 * the main thread.
 */
export const networks = await define({
    // This hook runs automatically during the service's launch process
    // and before the service can actually be used.
    __initializeService() {
        wifi.init({});
    },
    // The function that will actually be called inside the worker.
    async start({ mode, interval = 2 }: StartOptions) {
        // Grab the corresponding handler.
        const handler = HANDLERS[mode];

        // Start the loop.
        await run({
            handler,
            interval,
        });
    },
});

// Asynchronously and recursively loops to retrieve a
// list of networks, check for differences, and send
// updates to the main thread.
async function run({
    handler,
    interval,
    prev = null,
}: {
    handler: (typeof HANDLERS)[keyof typeof HANDLERS];
    interval: number;
    prev?: WiFiNetwork[] | null;
}): Promise<void> {
    // Wait
    await sleep(interval);

    // Grab the new list of networks and sort them prior
    // to diffing
    const curr = await handler();
    sortNetworkList(curr);

    // Check if this is either the first iteration of if there
    // is a diff. If so, update the main thread. Otherwise,
    // just keep scanning and skip the update step.
    const isDiff = prev === null || diffNetworkList(prev, curr);
    if (isDiff) ParentThread.sendMessage(curr);

    // Do it again
    return run({
        handler,
        interval,
        // The previous value stays the same if there was no diff,
        // but becomes the most recent list if there was an update.
        prev: isDiff ? curr : prev,
    });
}
