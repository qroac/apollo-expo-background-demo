import { Observable } from '@apollo/client';
import { ApolloLink } from '@apollo/client/link/core';
import { getOperationAST } from 'graphql';

export function defaultFormatter(req) {
  const operationName = req?.operationName || req.request?.operationName;
  const variables = req?.variables || req.request?.variables;
  return !variables || Object.keys(variables).length === 0
    ? operationName
    : `${operationName}(${JSON.stringify(variables)})`;
}

export const defaultLogger = (...args) => console.log.apply(null, args);

const getDefaultLogOptions = (options) => {
  const result = options;
  if (!result.formatter) {
    result.formatter = defaultFormatter;
  }
  if (!result.logger) {
    result.logger = defaultLogger;
  }

  return result;
};


export class LoggingLink extends ApolloLink {
  options;

  constructor(options) {
    super();
    this.options = getDefaultLogOptions(options);
  }

  request(operation, forward) {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    const isSubscription = !!operationAST && operationAST.operation === 'subscription';
    if (!isSubscription) {
      this.options.logger('[LOADING]', `<= ${this.options.formatter(operation)}`);
    }
    return new Observable((observer) => {
      if (isSubscription) {
        this.options.logger('[SUBSCRIBE]', `<= ${this.options.formatter(operation)}`);
      }
      const sub = forward(operation).subscribe({
        next: (result) => {
          this.options.logger('[RESULT]', result, `<= ${this.options.formatter(operation)}`);

          observer.next(result);
        },
        error: (error) => {
          this.options.logger('[ERROR]', error, `<=e ${this.options.formatter(operation)}`);
          console.log(error);
          observer.error(error);
        },
        complete: observer.complete.bind(observer),
      });
      return () => {
        if (isSubscription) {
          this.options.logger('[UNSUBSCRIBE]', `<= ${this.options.formatter(operation)}`);
        }
        sub.unsubscribe();
      };
    });
  }
}

export function formatResponse(logOptions, response, ...options) {
  const logOpts = getDefaultLogOptions(logOptions);
  logOpts.logger(`${JSON.stringify(response, undefined, 2)} <= ${logOpts.formatter(options[0])}`);
  return response;
}

export default (options) => ({
  link: new LoggingLink(options),
  formatResponse: formatResponse.bind(options),
});
