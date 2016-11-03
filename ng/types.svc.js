// posts services
angular.module('app')
.service('TypeSvc', function ($http) {
	
  this.fetch = function () {
    return $http.get('/api/type');
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
  
  this.findAcctforCust = function (cust) {
	// assume cust is a valid customer (call comes from controller after customer is chosen from list)
	return $http({ // try account search by zip
		url: '/api/type/acct_id',
		method: "GET",
		params: { _id: cust._acct }
	});
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
  
  this.submitAnswers = function (cust, quests, tanswers) {
	// first post type, then post quests and answer for each question, referencing type
	// compile data to submit to post
	var mydata = {};
	var mycust = cust.split(" ");
	//console.log('cust: ' + cust + ' quests ' + JSON.stringify(quests) + ' tanswers ' + tanswers);
	mydata.firstname = mycust[0];
	mydata.lastname = mycust[1];
	mydata.quests = quests;
	mydata.tanswers = tanswers;
	//console.log('JSON submit answer: ' + JSON.stringify(mydata));
	return $http.post('/api/type/answers', mydata);
  }
  
});