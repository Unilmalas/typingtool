// posts services
angular.module('app')
.service('TypeSvc', function ($http) {
	
  /*this.fetch = function (acct) {
    return $http.get('/api/type', acct);
  }*/
  
  this.addAcct = function (acct) {
    return $http.post('/api/type/acct', acct);
  }

  this.addCust = function (cust) {
    return $http.post('/api/type/cust', cust);
  }
  
  this.findAcct = function (acct) {
		// as much bussiness logic as possible into services (and away from controller)
		if(isNaN(acct)) { // returns true if acct is NOT a valid number
			//console.log('TypeSvc name: ' + acct);
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
			//console.log('TypeSvc zip: ' + acct);
			return $http({ // try account search by zip
				url: '/api/type/acct_zip',
				method: "GET",
				params: { acct: acct }
			});
		}
  }
  
  this.findCust = function (cust) {
	// as much bussiness logic as possible into services (and away from controller)
	var txtRegMatch = cust.split(" ");
	/*txtRegMatch.forEach(function(item, index, arr) {
        arr[index] = "/" + item + "/i"; // this will be used with $in: JS regex required by mongo https://docs.mongodb.com/manual/reference/operator/query/regex/
    });*/
	//console.log('findCust svc: ' + txtRegMatch);
	return $http({ // try account search by name
		url: '/api/type/cust_name',
		method: "GET",
		params: { lastname: txtRegMatch } // todo: change this, omly temp!
	});
  }
  
});