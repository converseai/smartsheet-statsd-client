/**
 * StatsD requires environment variables to be set before the module is loaded.
 * This requires each test to load the module separately, instead of being loaded
 * at the top of the file.
 *
 * Before each tests runs, we are running `jest.restoreAllMocks` to ensure the
 * modules are dumped from node's cache.
 */

const OLD_ENV = process.env;
const TEST_HOST = '127.0.0.1';
const TEST_PORT = '1000';
const TEST_PREFIX = 'TEST_PREFIX';

beforeEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  jest.spyOn(global.console, 'warn').mockImplementation(() => {});
  process.env = { ...OLD_ENV };
});

describe('StatsD Config', () => {
  test('it does not throw error when environement vars are missing', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');
    expect(() => new StatsD()).not.toThrowError();
    expect(NodeStatsD).toBeCalledTimes(1);
    expect(NodeStatsD).toBeCalledWith({
      mock: true,
      host: undefined,
      port: undefined,
      prefix: undefined
    });
    expect(spy).toBeCalledTimes(4);
  });

  test('initiates node-statsd client with env vars', () => {
    process.env.STATSD_HOST = TEST_HOST;
    process.env.STATSD_PORT = TEST_PORT;
    process.env.STATSD_PREFIX = TEST_PREFIX;
    // ADDING PRODUCTION ENVIRONMENT WILL INITIALIZE NODE-STATSD AS mock === false BUT
    // WILL NOT CREATE A CONNECTION BECAUSE THE AUTOMOCK IN __mocks_/node-statsd.ts RETURNS
    // A MOCKED CLASS WITH UNDEFINED FUNCTIONS.
    process.env.NODE_ENV = 'production';
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');
    expect(() => new StatsD()).not.toThrowError();
    expect(NodeStatsD).toBeCalledTimes(1);
    expect(NodeStatsD).toBeCalledWith({
      mock: false,
      host: TEST_HOST,
      port: parseInt(TEST_PORT, 10),
      prefix: TEST_PREFIX
    });
    expect(spy).not.toBeCalled();
  });

  test('System tags are set!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');
    expect(NodeStatsD).toBeCalledTimes(1);
    const tags = { a: 'a', b: 'b' };
    const client = new StatsD({ tags });
    expect(client).toHaveProperty('systemTags', tags);
  });
});

describe('Method Parameters', () => {
  test('Close is firing!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];

    const client = new StatsD();
    client.close('a');
    expect(mockStatsDInstance.close).toBeCalledTimes(1);
    expect(mockStatsDInstance.close).toBeCalledWith();
  });

  test('Methods are fired with 1 param!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];

    const client = new StatsD();
    client.increment('a');
    client.decrement('a');

    expect(mockStatsDInstance.increment).toBeCalledTimes(1);
    expect(mockStatsDInstance.increment).toBeCalledWith(
      'a',
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(mockStatsDInstance.decrement).toBeCalledTimes(1);
    expect(mockStatsDInstance.decrement).toBeCalledWith(
      'a',
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  test('Methods are fired with 2 params!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const userArgs = ['a', 1];
    const expectedArgs = ['a', 1, undefined, undefined, undefined];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);
    client.sendAll(...userArgs);
    client.send(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledTimes(1);
    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledTimes(1);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledTimes(1);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledTimes(1);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledTimes(1);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledTimes(1);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledTimes(1);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledTimes(1);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(
      ...expectedArgs,
      undefined
    );
    expect(mockStatsDInstance.send).toBeCalledTimes(1);
    expect(mockStatsDInstance.send).toBeCalledWith(...expectedArgs, undefined);
  });

  test('Methods are fired with callback!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const callback = () => {};
    const userArgs = ['a', 1, callback];
    const expectedArgs = ['a', 1, undefined, undefined, callback];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });

  test('Methods are fired with sample rate!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const userArgs = ['a', 1, 1.2];
    const expectedArgs = ['a', 1, 1.2, undefined, undefined];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });

  test('Methods are fired with sample rate and callback!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const callback = () => {};
    const userArgs = ['a', 1, 1.2, callback];
    const expectedArgs = ['a', 1, 1.2, undefined, callback];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });
});

describe('Tags', () => {
  test('Converting tag object to tags array!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const tags = { a: 'a', b: 'b' };
    const userArgs = ['a', 1, tags];
    const expectedArgs = ['a', 1, undefined, ['a:a', 'b:b'], undefined];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });
  test('Converting local and global tag object to tags array!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const tags = { a: 'a', b: 'b' };
    const systags = { sys: 'sys', a: 'override' };
    const userArgs = ['a', 1, tags];
    const expectedArgs = [
      'a',
      1,
      undefined,
      ['a:override', 'b:b', 'sys:sys'],
      undefined
    ];

    const client = new StatsD({ tags: systags });
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });
  test('Method firing with sample rate and tags!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const tags = { a: 'a', b: 'b' };
    const userArgs = ['a', 1, 1.2, tags];
    const expectedArgs = ['a', 1, 1.2, ['a:a', 'b:b'], undefined];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });
  test('Method firing with tag and callback!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const tags = { a: 'a', b: 'b' };
    const callback = () => {};
    const userArgs = ['a', 1, tags, callback];
    const expectedArgs = ['a', 1, undefined, ['a:a', 'b:b'], callback];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });
  test('Method firing with sample rate, tag and callback!', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const tags = { a: 'a', b: 'b' };
    const callback = () => {};
    const userArgs = ['a', 1, 1.2, tags, callback];
    const expectedArgs = ['a', 1, 1.2, ['a:a', 'b:b'], callback];

    const client = new StatsD();
    client.increment(...userArgs);
    client.decrement(...userArgs);
    client.gauge(...userArgs);
    client.histogram(...userArgs);
    client.timing(...userArgs);
    client.set(...userArgs);
    client.unique(...userArgs);

    expect(mockStatsDInstance.increment).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.decrement).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.gauge).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.histogram).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.timing).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.set).toBeCalledWith(...expectedArgs);
    expect(mockStatsDInstance.unique).toBeCalledWith(...expectedArgs);
  });
});

describe('Send and SendAll', () => {
  test('All arguments.', () => {
    const { StatsD: NodeStatsD } = require('node-statsd');
    const { StatsD } = require('./');

    const mockStatsDInstance = NodeStatsD.mock.instances[0];
    const client = new StatsD();
    const callback = () => {};

    const firstArgs = ['a', 'c', 1];
    const firstExpectedArgs = ['a', 'c', 1, undefined, undefined, undefined];
    client.send(...firstArgs);
    client.sendAll(...firstArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...firstExpectedArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...firstExpectedArgs);

    const secondArgs = ['a', 'c', 1, 1.2];
    const secondExpectedArgs = ['a', 'c', 1, 1.2, undefined, undefined];
    client.send(...secondArgs);
    client.sendAll(...secondArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...secondExpectedArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...secondExpectedArgs);

    const thirdArgs = ['a', 'c', 1, { a: 'a' }];
    const thirdExpectedArgs = ['a', 'c', 1, undefined, ['a:a'], undefined];
    client.send(...thirdArgs);
    client.sendAll(...thirdArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...thirdExpectedArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...thirdExpectedArgs);

    const fourthArgs = ['a', 'c', 1, callback];
    const fourthExpectedArgs = ['a', 'c', 1, undefined, undefined, callback];
    client.send(...fourthArgs);
    client.sendAll(...fourthArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...fourthExpectedArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...fourthExpectedArgs);

    const firstCombinedArgs = ['a', 'c', 1, 1.2, callback];
    const firstCombinedExpArgs = ['a', 'c', 1, 1.2, undefined, callback];
    client.send(...firstCombinedArgs);
    client.sendAll(...firstCombinedArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...firstCombinedExpArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...firstCombinedExpArgs);

    const secondCombinedArgs = ['a', 'c', 1, { a: 'a' }, callback];
    const secondCombinedExpArgs = ['a', 'c', 1, undefined, ['a:a'], callback];
    client.send(...secondCombinedArgs);
    client.sendAll(...secondCombinedArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...secondCombinedExpArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...secondCombinedExpArgs);

    const thirdCombinedArgs = ['a', 'c', 1, 1.2, { a: 'a' }];
    const thirdCombinedExpArgs = ['a', 'c', 1, 1.2, ['a:a'], undefined];
    client.send(...thirdCombinedArgs);
    client.sendAll(...thirdCombinedArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...thirdCombinedExpArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...thirdCombinedExpArgs);

    const allArgs = ['a', 'c', 1, 1.2, { a: 'a' }, callback];
    const allExpArgs = ['a', 'c', 1, 1.2, ['a:a'], callback];
    client.send(...allArgs);
    client.sendAll(...allArgs);
    expect(mockStatsDInstance.send).toBeCalledWith(...allExpArgs);
    expect(mockStatsDInstance.sendAll).toBeCalledWith(...allExpArgs);
  });
});
