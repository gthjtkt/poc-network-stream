import { ServiceCluster } from 'nanolith';
import { NetworkScanMode } from './constants.js';
import { networks } from './workers/networks.js';

import type { WiFiNetwork } from 'node-wifi';

// Launch two threads using our "networks" definitions
// found in ./workers/networks.js.
const cluster = new ServiceCluster(networks);
const [active, available] = await cluster.launch(2);

// Listen for updates from the service threads. They will
// only update us here on the main thread when there is
// an update to the target source. This means that we aren't
// being bombarded with messages, and therefore our client
// isn't being bombarded either.
active!.onMessage<WiFiNetwork[]>((networks) => {
    console.log('Active:', networks);
});
available!.onMessage<WiFiNetwork[]>((networks) => {
    console.log('Available:', networks);
});

// Start the endless scanning tasks on the two spawned threads
// by calling their functions.
active!.call({
    name: 'start',
    params: [
        {
            mode: NetworkScanMode.Active,
            interval: 0.5,
        },
    ],
});
available!.call({
    name: 'start',
    params: [
        {
            mode: NetworkScanMode.Available,
            interval: 2,
        },
    ],
});

// Close both services after 20 seconds. In a real-world
// scenario, cluster.closeAll would be called after the
// server has closed (for example).
setTimeout(cluster.closeAll, 2e4);
