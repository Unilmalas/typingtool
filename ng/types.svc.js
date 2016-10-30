// posts services
angular.module('app')
.service('TypeSvc', function ($http) {
	
  /*this.fetch = function (acct) {
    return $http.get('/api/type', acct);
  }*/
  
  this.addAcct = function (acct) {
    return $http.post('/api/type', acct);
  }
  
  this.findAcct = function (acct) {
		// as much bussiness logic as possible into services (and away from controller)
		if(isNaN(acct)) { // returns true if acct is NOT a valid number
			console.log('TypeSvc name: ' + acct);
			// split search string into numeric (if at all) and non-numeric
			var numRegMatch = ".*";
			acct.match(/\d+/g).forEach( function (item) {
				numRegMatch += item + ".*";
			});
			var txtRegMatch = ".*";
			acct.match(/\D+/g).forEach( function (item) {
				txtRegMatch += item.trim() + ".*";
			});
			return $http({ // try account search by name
				url: '/api/type/acct_mixed',
				method: "GET",
				params: { name: txtRegMatch, zip: numRegMatch }
			});
			/*return $http({ // try account search by name
				url: '/api/type/acct_name',
				method: "GET",
				params: { acct: acct }
			});*/
			
			
		} else {
			// try account search by zip (only number)
			console.log('TypeSvc zip: ' + acct);
			return $http({ // try account search by zip
				url: '/api/type/acct_zip',
				method: "GET",
				params: { acct: acct }
			});
		}
  }
  
  this.findCust = function (cust) {
    return $http.get('/api/type/cust', cust);
  }
  
});