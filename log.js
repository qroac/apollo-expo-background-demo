import minilog from 'minilog';

minilog.enable();

const loggerName = typeof window !== 'undefined' ? 'frontend' : 'backend';

const log = minilog(loggerName);
log.suggest.defaultResult = false;
log.suggest.clear().allow(loggerName, 'debug');

export default log;
