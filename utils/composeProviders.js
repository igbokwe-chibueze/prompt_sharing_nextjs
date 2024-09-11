// utils/composeProviders.js
export const composeProviders = (...providers) => {
    return ({ children }) => (
      providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
    );
  };