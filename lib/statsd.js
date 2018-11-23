"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_statsd_1 = require("node-statsd");
const STATSD_CONFIG = {
    mock: true,
    port: undefined,
    host: undefined,
    prefix: undefined
};
if (process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV !== null &&
    process.env.NODE_ENV === 'production') {
    STATSD_CONFIG.mock = false;
}
else {
    console.warn(`NODE_ENV=${process.env.NODE_ENV}! StatsD will NOT initialize a connection!`);
}
if (process.env.STATSD_HOST !== undefined && process.env.STATSD_HOST !== null) {
    STATSD_CONFIG.host = process.env.STATSD_HOST;
}
else {
    console.warn(`STATSD_HOST=${process.env.STATSD_HOST}! StatsD will initialize with the default host 'localhost'.`);
}
if (process.env.STATSD_PORT !== undefined && process.env.STATSD_PORT !== null) {
    STATSD_CONFIG.port = Number.parseInt(process.env.STATSD_PORT, 10);
}
else {
    console.warn(`STATSD_PORT=${process.env.STATSD_PORT}! StatsD will initialize with the default port 8125.`);
}
if (process.env.STATSD_PREFIX !== undefined &&
    process.env.STATSD_PREFIX !== null) {
    STATSD_CONFIG.prefix = process.env.STATSD_PREFIX;
}
else {
    console.warn(`STATSD_PREFIX=${process.env.STATSD_PREFIX}! StatsD will initialize with no prefix.`);
}
const STATSD_CLIENT = new node_statsd_1.StatsD(STATSD_CONFIG);
const fixOverloadedParams = (maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) => {
    if (maybeSampleRateOrTagsOrCallback !== undefined &&
        typeof maybeSampleRateOrTagsOrCallback !== 'number') {
        maybeCallback = maybeTagsOrCallback;
        maybeTagsOrCallback = maybeSampleRateOrTagsOrCallback;
        maybeSampleRateOrTagsOrCallback = undefined;
    }
    if (maybeTagsOrCallback !== undefined &&
        typeof maybeTagsOrCallback !== 'object') {
        maybeCallback = maybeTagsOrCallback;
        maybeTagsOrCallback = undefined;
    }
    const tags = maybeTagsOrCallback;
    const callback = maybeCallback;
    const sampleRate = maybeSampleRateOrTagsOrCallback;
    return { callback, sampleRate, tags };
};
const getTagsArray = (tags) => {
    const keys = Object.keys(tags);
    return keys.length > 0 ? keys.map(key => `${key}:${tags[key]}`) : undefined;
};
class StatsD {
    /**
     * Create a new instance of StatsD wrapper. This does not create a new connection of the statsd.
     * The client will not connect unless `NODE_ENV=production`, a host is provided via `STATSD_HOST`,
     * a port is provided via `STATSD_PORT`. A prefix can also be given via `STATSD_PREFIX` E.g. uuid.
     * @param config.tags A key/value map of strings representing tags.
     */
    constructor(config = { tags: {} }) {
        this.systemTags = config.tags;
    }
    /**
     * Close the underlying socket and stop listening for data on it.
     */
    close() {
        STATSD_CLIENT.close();
    }
    decrement(stat, value, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.decrement(stat, value, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    gauge(stat, value, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.gauge(stat, value, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    histogram(stat, value, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.histogram(stat, value, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    increment(stat, value, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.increment(stat, value, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    send(stat, value, type, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.send(stat, value, type, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    sendAll(stat, value, type, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.sendAll(stat, value, type, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    set(stat, value, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.set(stat, value, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    timing(stat, value, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.timing(stat, value, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
    unique(stat, value, maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback) {
        const { callback, sampleRate, tags } = fixOverloadedParams(maybeSampleRateOrTagsOrCallback, maybeTagsOrCallback, maybeCallback);
        return STATSD_CLIENT.unique(stat, value, sampleRate, getTagsArray(Object.assign({}, tags, this.systemTags)), callback);
    }
}
exports.StatsD = StatsD;
//# sourceMappingURL=statsd.js.map