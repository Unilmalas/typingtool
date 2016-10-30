angular.module('app')
.service('UserSvc', function ($http) {
  var svc = this;
  
  svc.getUser = function () {
    return $http.get('/api/users'); // get the logged-in users information
  }
  
  svc.login = function (username, password) {
    return $http.post('/api/sessions', { // get a JWT coming back from the sessions/post
      username: username, password: password
	}).then(function (val) {
	  svc.token = val.data;
	  $http.defaults.headers.common['X-Auth'] = val.data;
      return svc.getUser();
    });
  }
  
  svc.register = function (username, password) {
	return $http.post('/api/users', { // create a user
		username: username, password: password
	}).then(function () {
		return svc.login(username, password);
	});
  }
  
  svc.removeToken = function () {
	$http.defaults.headers.common['X-Auth'] = "";
  }
});