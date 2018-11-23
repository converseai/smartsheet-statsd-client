const StatsD = jest.genMockFromModule('node-statsd') as any;
StatsD.prototype.unique = jest.fn();
export { StatsD };
