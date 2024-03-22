// This only allows for dev/production. For staging, look into env-cmd.
const environment = process.env.NODE_ENV;

export const isProductionEnvironment = () => {
  return environment === "production";
};
export const isDevelopmentEnvironment = () => {
  return environment === "development";
};
