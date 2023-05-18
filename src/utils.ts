import type { WiFiNetwork } from 'node-wifi';

export const sleep = (secs: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, secs));

/**
 * Sorts a list of network list by SSID (in place).
 */
export const sortNetworkList = (networks: WiFiNetwork[]) => {
    networks.sort((a, b) => a.ssid.localeCompare(b.ssid));
};

/**
 * Returns `true` if the two provided networks are different.
 */
const diffNetworks = (first: WiFiNetwork, second: WiFiNetwork) => {
    return first?.ssid !== second?.ssid || first?.security !== second?.security;
};

/**
 * Returns `true` if any of the networks in the lists (sorted by SSID) are different.
 */
export const diffNetworkList = (first: WiFiNetwork[], second: WiFiNetwork[]) => {
    return first.length !== second.length || first.some((item, index) => diffNetworks(item, second[index]));
};
