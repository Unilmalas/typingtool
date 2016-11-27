// posts services
angular.module('app')
.service('TypeSvc', function ($http) {
	
  this.fetch = function (module) {
    //return $http.get('/api/type');
	//console.log('service fetch: ' + module);
	return $http({
		url: '/api/type',
		method: "GET",
		params: { module: module }
	});
  }
  
  this.addAcct = function (acct) {
    return $http.post('/api/type/acct', acct);
  }

  this.addCust = function (cust) {
    return $http.post('/api/type/cust', cust);
  }
  
  this.addQuest = function (quest) {
    return $http.post('/api/type/quest', quest);
  }
  
  this.findAcct = function (module, acct) {
		// as much bussiness logic as possible into services (and away from controller)
		if(isNaN(acct)) { // returns true if acct is NOT a valid number
			// split search string into numeric (if at all) and non-numeric
			var numRegMatch = "";
			var res = acct.match(/\d+/g);
			//console.log('TypeSvc name: ' + acct + ' res1: ' + res);
			if (res!=null) {
				res.forEach( function (item) {
					numRegMatch += item;
				});
			}
			var txtRegMatch = ".*";
			res = acct.match(/\D+/g);
			//console.log('TypeSvc name: ' + acct + ' res2: ' + res);
			if (res!=null) {
				acct.match(/\D+/g).forEach( function (item) {
					txtRegMatch += item.trim() + ".*";
				});
			}
			//console.log('findAcct: ' + res + ' : ' + txtRegMatch);
			return $http({ // try account search by name or zip: careful here: currently thats "or", if and the separate name-only search has to be actvated
				url: '/api/type/acct_mixed',
				method: "GET",
				params: { module: module, name: txtRegMatch, zip: numRegMatch }
			});
			/*return $http({ // try account search by name
				url: '/api/type/acct_name',
				method: "GET",
				params: { acct: acct }
			});*/
		} else {
			// try account search by zip (only number)
			if(acct==null) acct = "";
			//console.log('TypeSvc zip: ' + acct);
			return $http({ // try account search by zip
				url: '/api/type/acct_zip',
				method: "GET",
				params: { module: module, acct: acct }
			});
		}
  }
  
  this.findAcctforCust = function (module, cust) {
	// assume cust is a valid customer (call comes from controller after customer is chosen from list)
	return $http({ // try account search by id from cust
		url: '/api/type/acct_id',
		method: "GET",
		params: { module: module, _id: cust._acct }
	});
  }
  
  this.findCust = function (module, acct, cust) {
	// as much bussiness logic as possible into services (and away from controller)
	var txtRegMatch = cust==null ? "" : cust;
	//console.log('findCust svc: ' + txtRegMatch);
	if (acct == null) {
		return $http({ // try cust search by name
			url: '/api/type/cust_name',
			method: "GET",
			params: { module: module, lastname: txtRegMatch } // todo: change latname to both names, omly temp!
		});
	} else { // acct is set, restrict search to customers in acct
		return $http({ // try cust search by name
			url: '/api/type/cust_acct',
			method: "GET",
			params: { module: module, lastname: txtRegMatch, _acct: acct } // todo: change latname to both names, omly temp!
		});		
	}
  }
  
  this.submitAnswers = function (module, cust, quests, tanswers) {
	// first post type, then post quests and answer for each question, referencing type
	// compile data to submit to post
	var mydata = {};
	var mycust = cust.split(" ");
	//console.log('module: ' + module + 'cust: ' + cust + ' quests ' + JSON.stringify(quests) + ' tanswers ' + tanswers);
	mydata.module = module;
	mydata.firstname = mycust[0];
	mydata.lastname = mycust[1];
	mydata.quests = quests;
	mydata.tanswers = tanswers;
	//console.log('JSON submit answer: ' + JSON.stringify(mydata));
	return $http.post('/api/type/answers', mydata);
  }
  
});