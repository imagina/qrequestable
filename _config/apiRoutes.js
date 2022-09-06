const moduleName = 'requestable';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase: urlBase,
  version: moduleVersion,
  requestables: `${urlBase}/requestables`,
  statuses: `${urlBase}/statuses`,
  categories: `${urlBase}/categories`,
  orderStatus: `${urlBase}/statuses/order-status`,
}
