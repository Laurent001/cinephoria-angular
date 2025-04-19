// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// pour https de confiance (pas auto-signé sinon android refuse)
// dns (ovh) => mon serveur local apache => backend node lancé sur pc portable (env dev)
export const environment = {
  production: false,
  url: 'https://cinephoria.affiche.site',
};
