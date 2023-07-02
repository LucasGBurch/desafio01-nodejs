export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g;

  // RegExp que pega o ID gerado pelo UUID
  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');
  // CUIDADO, ctrl + shift + F tira o escapar do hífen na RegEx: \-

  // console.log(pathWithParams);

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}