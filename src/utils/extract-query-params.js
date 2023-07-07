export function extractQueryParams(query) {
  return query
    .substr(1) // substr(1) ignora o primeiro caractere (o ?)
    .split('&')
    .reduce((queryParams, param) => {
      const [key, value] = param.split('='); // ['page', '2']

      queryParams[key] = value;

      return queryParams;
    }, {});
}
