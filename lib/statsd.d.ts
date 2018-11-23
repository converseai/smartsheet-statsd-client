import { Callback } from 'node-statsd';
interface Tags {
    [key: string]: string;
}
export interface StatsDConfig {
    tags: Tags;
}
export declare class StatsD {
    private systemTags;
    /**
     * Create a new instance of StatsD wrapper. This does not create a new connection of the statsd.
     * The client will not connect unless `NODE_ENV=production`, a host is provided via `STATSD_HOST`,
     * a port is provided via `STATSD_PORT`. A prefix can also be given via `STATSD_PREFIX` E.g. uuid.
     * @param config.tags A key/value map of strings representing tags.
     */
    constructor(config?: StatsDConfig);
    /**
     * Close the underlying socket and stop listening for data on it.
     */
    close(): void;
    /**
     * Decrements a stat by a specified amount
     * @param stat The stat(s) to send
     * @param value The value to send. Optional
     * @param sampleRate The Number of times to sample (0 to 1). Optional.
     * @param tags The Array of tags to add to metrics. Optional.
     * @param callback Callback when message is done being delivered. Optional.
     */
    decrement(stat: string | string[], value?: number, callback?: Callback): void;
    decrement(stat: string | string[], value?: number, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    decrement(stat: string | string[], value?: number, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    /**
     * Gauges a stat by a specified amount
     * @param stat The stat(s) to send
     * @param value The value to send
     * @param sampleRate The Number of times to sample (0 to 1). Optional.
     * @param tags The Array of tags to add to metrics. Optional.
     * @param callback Callback when message is done being delivered. Optional.
     */
    gauge(stat: string | string[], value: number, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    gauge(stat: string | string[], value: number, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    gauge(stat: string | string[], value: number, callback?: Callback): void;
    /**
     * Represents the histogram stat
     * @param stat The stat(s) to send
     * @param value The value to send
     * @param sampleRate The Number of times to sample (0 to 1). Optional.
     * @param tags The Array of tags to add to metrics. Optional.
     * @param callback Callback when message is done being delivered. Optional.
     */
    histogram(stat: string | string[], value: any, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    histogram(stat: string | string[], value: any, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    histogram(stat: string | string[], value: any, callback?: Callback): void;
    /**
     * Increments a stat by a specified amount
     * @param stat The stat(s) to send
     * @param value The value to send. Optional
     * @param sampleRate The Number of times to sample (0 to 1). Optional.
     * @param tags The Array of tags to add to metrics. Optional.
     * @param callback Callback when message is done being delivered. Optional.
     */
    increment(stat: string | string[], value?: number, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    increment(stat: string | string[], value: any, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    increment(stat: string | string[], value: any, callback?: Callback): void;
    /**
     * Sends a stat across the wire
     * @param stat The stat(s) to send
     * @param value The value to send
     * @param type The type of message to send to statsd
     * @param sampleRate The Number of times to sample (0 to 1)
     * @param tags The Array of tags to add to metrics
     * @param callback Callback when message is done being delivered. Optional.
     */
    send(stat: string | string[], value: any, type: string, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    send(stat: string | string[], value: any, type: string, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    send(stat: string | string[], value: any, type: string, callback?: Callback): void;
    /**
     * Checks if stats is an array and sends all stats calling back once all have sent
     * @param stat The stat(s) to send
     * @param value The value to send
     * @param type The type of metric to send
     * @param sampleRate The Number of times to sample (0 to 1). Optional.
     * @param tags The Array of tags to add to metrics. Optional.
     * @param callback Callback when message is done being delivered. Optional.
     */
    sendAll(stat: string | string[], value: any, type: string, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    sendAll(stat: string | string[], value: any, type: string, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    sendAll(stat: string | string[], value: any, type: string, callback?: Callback): void;
    /**
     * See StatsD.unique
     */
    set(stat: string | string[], value: any, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    set(stat: string | string[], value: any, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    set(stat: string | string[], value: any, callback?: Callback): void;
    /**
     * Represents the timing stat
     * @param stat The stat(s) to send
     * @param time The time in milliseconds to send
     * @param sampleRate The Number of times to sample (0 to 1). Optional.
     * @param tags The Array of tags to add to metrics. Optional.
     * @param callback Callback when message is done being delivered. Optional.
     */
    timing(stat: string | string[], time: number, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    timing(stat: string | string[], time: number, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    timing(stat: string | string[], time: number, callback?: Callback): void;
    /**
     * Counts unique values by a specified amount
     * @param stat The stat(s) to send
     * @param value The value to send
     * @param sampleRate The Number of times to sample (0 to 1). Optional.
     * @param tags The Array of tags to add to metrics. Optional.
     * @param callback Callback when message is done being delivered. Optional.
     */
    unique(stat: string | string[], value: any, sampleRate?: number, tags?: Tags, callback?: Callback): void;
    unique(stat: string | string[], value: any, sampleRateOrTags?: number | Tags, callback?: Callback): void;
    unique(stat: string | string[], value: any, callback?: Callback): void;
}
export {};
