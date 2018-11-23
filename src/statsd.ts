import {
  Callback,
  StatsD as NodeStatsD,
  StatsDConfig as NodeStatsDConfig
} from 'node-statsd';

interface Tags {
  [key: string]: string;
}

interface Parameters {
  callback: Callback;
  sampleRate: number;
  tags: Tags;
}

const STATSD_CONFIG: NodeStatsDConfig = {
  mock: true,
  port: undefined,
  host: undefined,
  prefix: undefined
};

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV !== null &&
  process.env.NODE_ENV === 'production'
) {
  STATSD_CONFIG.mock = false;
} else {
  console.warn(
    `NODE_ENV=${process.env.NODE_ENV}! StatsD will NOT initialize a connection!`
  );
}

if (process.env.STATSD_HOST !== undefined && process.env.STATSD_HOST !== null) {
  STATSD_CONFIG.host = process.env.STATSD_HOST;
} else {
  console.warn(
    `STATSD_HOST=${
      process.env.STATSD_HOST
    }! StatsD will initialize with the default host 'localhost'.`
  );
}

if (process.env.STATSD_PORT !== undefined && process.env.STATSD_PORT !== null) {
  STATSD_CONFIG.port = Number.parseInt(process.env.STATSD_PORT, 10);
} else {
  console.warn(
    `STATSD_PORT=${
      process.env.STATSD_PORT
    }! StatsD will initialize with the default port 8125.`
  );
}

if (
  process.env.STATSD_PREFIX !== undefined &&
  process.env.STATSD_PREFIX !== null
) {
  STATSD_CONFIG.prefix = process.env.STATSD_PREFIX;
} else {
  console.warn(
    `STATSD_PREFIX=${
      process.env.STATSD_PREFIX
    }! StatsD will initialize with no prefix.`
  );
}

const STATSD_CLIENT = new NodeStatsD(STATSD_CONFIG);

const fixOverloadedParams = (
  maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
  maybeTagsOrCallback?: Tags | Callback,
  maybeCallback?: Callback
): Parameters => {
  if (
    maybeSampleRateOrTagsOrCallback !== undefined &&
    typeof maybeSampleRateOrTagsOrCallback !== 'number'
  ) {
    maybeCallback = maybeTagsOrCallback as Callback;
    maybeTagsOrCallback = maybeSampleRateOrTagsOrCallback as Tags | Callback;
    maybeSampleRateOrTagsOrCallback = undefined;
  }

  if (
    maybeTagsOrCallback !== undefined &&
    typeof maybeTagsOrCallback !== 'object'
  ) {
    maybeCallback = maybeTagsOrCallback as Callback;
    maybeTagsOrCallback = undefined;
  }

  const tags = maybeTagsOrCallback as Tags;
  const callback = maybeCallback as Callback;
  const sampleRate = maybeSampleRateOrTagsOrCallback as number;

  return { callback, sampleRate, tags };
};

const getTagsArray = (tags: Tags): string[] | undefined => {
  const keys = Object.keys(tags);
  return keys.length > 0 ? keys.map(key => `${key}:${tags[key]}`) : undefined;
};

export interface StatsDConfig {
  tags: Tags;
}

export class StatsD {
  private systemTags: Tags;

  /**
   * Create a new instance of StatsD wrapper. This does not create a new connection of the statsd.
   * The client will not connect unless `NODE_ENV=production`, a host is provided via `STATSD_HOST`,
   * a port is provided via `STATSD_PORT`. A prefix can also be given via `STATSD_PREFIX` E.g. uuid.
   * @param config.tags A key/value map of strings representing tags.
   */
  public constructor(config: StatsDConfig = { tags: {} }) {
    this.systemTags = config.tags;
  }

  /**
   * Close the underlying socket and stop listening for data on it.
   */
  public close(): void {
    STATSD_CLIENT.close();
  }

  /**
   * Decrements a stat by a specified amount
   * @param stat The stat(s) to send
   * @param value The value to send. Optional
   * @param sampleRate The Number of times to sample (0 to 1). Optional.
   * @param tags The Array of tags to add to metrics. Optional.
   * @param callback Callback when message is done being delivered. Optional.
   */
  public decrement(
    stat: string | string[],
    value?: number,
    callback?: Callback
  ): void;
  public decrement(
    stat: string | string[],
    value?: number,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public decrement(
    stat: string | string[],
    value?: number,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public decrement(
    stat: string | string[],
    value?: number,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.decrement(
      stat,
      value,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }

  /**
   * Gauges a stat by a specified amount
   * @param stat The stat(s) to send
   * @param value The value to send
   * @param sampleRate The Number of times to sample (0 to 1). Optional.
   * @param tags The Array of tags to add to metrics. Optional.
   * @param callback Callback when message is done being delivered. Optional.
   */
  public gauge(
    stat: string | string[],
    value: number,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public gauge(
    stat: string | string[],
    value: number,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public gauge(
    stat: string | string[],
    value: number,
    callback?: Callback
  ): void;
  public gauge(
    stat: string | string[],
    value: number,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.gauge(
      stat,
      value,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }

  /**
   * Represents the histogram stat
   * @param stat The stat(s) to send
   * @param value The value to send
   * @param sampleRate The Number of times to sample (0 to 1). Optional.
   * @param tags The Array of tags to add to metrics. Optional.
   * @param callback Callback when message is done being delivered. Optional.
   */
  public histogram(
    stat: string | string[],
    value: any,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public histogram(
    stat: string | string[],
    value: any,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public histogram(
    stat: string | string[],
    value: any,
    callback?: Callback
  ): void;
  public histogram(
    stat: string | string[],
    value: number,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.histogram(
      stat,
      value,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }

  /**
   * Increments a stat by a specified amount
   * @param stat The stat(s) to send
   * @param value The value to send. Optional
   * @param sampleRate The Number of times to sample (0 to 1). Optional.
   * @param tags The Array of tags to add to metrics. Optional.
   * @param callback Callback when message is done being delivered. Optional.
   */
  public increment(
    stat: string | string[],
    value?: number,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public increment(
    stat: string | string[],
    value: any,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public increment(
    stat: string | string[],
    value: any,
    callback?: Callback
  ): void;
  public increment(
    stat: string | string[],
    value?: number,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.increment(
      stat,
      value,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }

  /**
   * Sends a stat across the wire
   * @param stat The stat(s) to send
   * @param value The value to send
   * @param type The type of message to send to statsd
   * @param sampleRate The Number of times to sample (0 to 1)
   * @param tags The Array of tags to add to metrics
   * @param callback Callback when message is done being delivered. Optional.
   */
  public send(
    stat: string | string[],
    value: any,
    type: string,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public send(
    stat: string | string[],
    value: any,
    type: string,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public send(
    stat: string | string[],
    value: any,
    type: string,
    callback?: Callback
  ): void;
  public send(
    stat: string | string[],
    value: number,
    type: string,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.send(
      stat,
      value,
      type,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }

  /**
   * Checks if stats is an array and sends all stats calling back once all have sent
   * @param stat The stat(s) to send
   * @param value The value to send
   * @param type The type of metric to send
   * @param sampleRate The Number of times to sample (0 to 1). Optional.
   * @param tags The Array of tags to add to metrics. Optional.
   * @param callback Callback when message is done being delivered. Optional.
   */
  public sendAll(
    stat: string | string[],
    value: any,
    type: string,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public sendAll(
    stat: string | string[],
    value: any,
    type: string,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public sendAll(
    stat: string | string[],
    value: any,
    type: string,
    callback?: Callback
  ): void;
  public sendAll(
    stat: string | string[],
    value: number,
    type: string,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.sendAll(
      stat,
      value,
      type,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }

  /**
   * See StatsD.unique
   */
  public set(
    stat: string | string[],
    value: any,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public set(
    stat: string | string[],
    value: any,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public set(stat: string | string[], value: any, callback?: Callback): void;

  public set(
    stat: string | string[],
    value: number,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.set(
      stat,
      value,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }
  /**
   * Represents the timing stat
   * @param stat The stat(s) to send
   * @param time The time in milliseconds to send
   * @param sampleRate The Number of times to sample (0 to 1). Optional.
   * @param tags The Array of tags to add to metrics. Optional.
   * @param callback Callback when message is done being delivered. Optional.
   */
  public timing(
    stat: string | string[],
    time: number,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public timing(
    stat: string | string[],
    time: number,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public timing(
    stat: string | string[],
    time: number,
    callback?: Callback
  ): void;
  public timing(
    stat: string | string[],
    value: number,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.timing(
      stat,
      value,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }

  /**
   * Counts unique values by a specified amount
   * @param stat The stat(s) to send
   * @param value The value to send
   * @param sampleRate The Number of times to sample (0 to 1). Optional.
   * @param tags The Array of tags to add to metrics. Optional.
   * @param callback Callback when message is done being delivered. Optional.
   */
  public unique(
    stat: string | string[],
    value: any,
    sampleRate?: number,
    tags?: Tags,
    callback?: Callback
  ): void;
  public unique(
    stat: string | string[],
    value: any,
    sampleRateOrTags?: number | Tags,
    callback?: Callback
  ): void;
  public unique(stat: string | string[], value: any, callback?: Callback): void;
  public unique(
    stat: string | string[],
    value: number,
    maybeSampleRateOrTagsOrCallback?: number | Tags | Callback,
    maybeTagsOrCallback?: Tags | Callback,
    maybeCallback?: Callback
  ): void {
    const { callback, sampleRate, tags } = fixOverloadedParams(
      maybeSampleRateOrTagsOrCallback,
      maybeTagsOrCallback,
      maybeCallback
    );
    return STATSD_CLIENT.unique(
      stat,
      value,
      sampleRate,
      getTagsArray(Object.assign({}, tags, this.systemTags)),
      callback
    );
  }
}
