// routes
angular.module('app') // getter
.config(function ($routeProvider) {
  $routeProvider 	// each route has a controller and a template associated with it
	.when('/typing',         { controller: 'TypeCtrl', templateUrl: '/templates/type.html' })  // html-files are loaded on demand
	//.when('/register', { controller: 'RegisterCtrl', templateUrl: '/templates/register.html' })
	.when('/prereg', { controller: 'PreRegCtrl', templateUrl: '/templates/prereg.html' }) // preregistration of user till conf
	.when('/confreg', { controller: 'ConfRegCtrl', templateUrl: '/templates/confreg.html' }) // confirm user registration
	.when('/confmail', { controller: 'ConfMailCtrl', templateUrl: '/templates/confreg.html' }) // confirm user from e-mail
	.when('/login',    { controller: 'LoginCtrl', templateUrl: '/templates/login.html' })
	.when('/logout',	 { controller: 'LogoutCtrl', templateUrl: '/templates/logout.html' })
	.when('/admin',	 { controller: 'AdminCtrl', templateUrl: '/templates/admin.html' })
	// routes like /color/:color/largecode/:largecode*\/edit will match /color/brown/largecode/code/with/slashes/edit 
	// and extract: color: brown largecode: code/with/slashes and stored in $routeParams under the given name
	.otherwise(			{ redirectTo: '/layouts/home.html' }); // home page (should I put this into templates too...?)
  //$locationProvider.html5Mode(true);
});