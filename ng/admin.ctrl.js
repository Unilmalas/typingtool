// Admin controller
angular.module('app')
.controller('AdminCtrl', function ($scope, AdminSvc) {
  
  $scope.module = "jak"; // hard-coded for now, will add a wrapper later and set it there
  //console.log('calling admin module');
  
  // initial load of questions (todo: when implementing types will need to change this)
  AdminSvc.fetch($scope.module)
  .success(function () {
	$scope.myAcct = null; // inits acct
	$scope.myCust = null; // inits cust
  });

  $scope.updateAcct = function () { // actually upsert: creates a new document when no document matches
    if ($scope.isAuth) { // authorized? todo: add admin flag on user
      AdminSvc.updateAcct({
		module:	  $scope.myAcct.module,
        name:     $scope.myAcct.name,
		zip:	  $scope.myAcct.zip
      })
      .success(function (acct) {
		console.log('acct updated');
      })
    } else {
		console.log('You are not authenticated');
	}
  }
  
  $scope.findAcct = function () { // called from admin accounts
	//console.log('findAcct: ' + $scope.myAcct);
	if ($scope.isAuth) {
		AdminSvc.findAcct ($scope.module, $scope.myAcct.name)
		.success(function (accts) {
			$scope.accts = accts;
		});
	} else {
	console.log('You are not authenticated');
	}
  }
  
  $scope.findCustAcct = function () { // called from admin customers
	//console.log('findCustAcct: ' + $scope.myAcct);
	if ($scope.isAuth) {
		AdminSvc.findCustAcct ($scope.module, $scope.myCust.acct)
		.success(function (caccts) {
			$scope.caccts = caccts;
		});
	} else {
	console.log('You are not authenticated');
	}
  }
  
  $scope.setAcct = function (acct) {
	  $scope.myAcct.module = acct.module;
	  $scope.myAcct.name = acct.name;
	  $scope.myAcct.zip = acct.zip;
	  $scope.myAcct._id = acct._id;
	  $scope.accts = [];
  }
  
  $scope.setAcctCust = function (cacct) {
	  //console.log('setAcctCust ' + JSON.stringify(cacct));
	  $scope.myCust.acct = cacct.name;
	  $scope.myCust._acct = cacct._id;
	  $scope.caccts = [];
  }

  $scope.updateCust = function () { // upsert cust
    console.log('update cust ctrl ' + JSON.stringify($scope.myCust));
    if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      AdminSvc.updateCust({
		module:	  		$scope.module,
        firstname:     	$scope.myCust.firstname,
		lastname:	  	$scope.myCust.lastname,
		_acct:			$scope.myCust._acct
      })
      .success(function (cust) {
		console.log('cust updated');
      })
    } else {
		console.log('You are not authenticated!');
	}
	/*      AdminSvc.addCust({
		module:	  $scope.module,
        firstname:     'John',
		lastname:	  'Doe'
      })
      .success(function (cust) {
		console.log('cust stored');
      })
    } else {
		console.log('You are not authenticated!');
	}*/
  }
  
  $scope.findCust = function () {
	if ($scope.isAuth) {
		if ( $scope.myAcct != null ) {
			if ($scope.myAcct._id) { // myAcct is set: search customers with restriction to acct
				AdminSvc.findCust ($scope.module, $scope.myAcct._id, $scope.myCust.lastname)
				.success(function (custs) {
					$scope.custs = custs;
				});
			} // todo: else what ????
		} else { // to do: take out and let svc deal with it
			//console.log($scope.myCust);
			AdminSvc.findCust ($scope.module, null, $scope.myCust.lastname)
			.success(function (custs) {
				$scope.custs = custs;
			});				
		}
	} else {
	console.log('You are not authenticated!');
	}
  }
  
  $scope.setCust = function (cust) {
	  $scope.myCust.module = $scope.module;
	  $scope.myCust.firstname = cust.firstname;
	  $scope.myCust.lastname = cust.lastname;
	  $scope.custs = [];
	  //console.log('admin ctrl ' + cust._acct);
	  AdminSvc.findAcctforCust ($scope.module, cust)
	  .success(function (custacct) {
		  //console.log('setcust ' + JSON.stringify(custacct) + ' acct name ' + custacct.name);
		  $scope.myCust.acct = custacct.name;
		  $scope.myCust._acct = custacct._id;
		  //$scope.myAcct.name = custacct.name;
		  //$scope.myAcct._id = custacct._id;
	  });
  }

  $scope.clearSearch = function () {
	$scope.acct = {};
	$scope.cacct = {};
	$scope.cust = {};
	$scope.myAcct.name = null; // inits acct
	$scope.myAcct.zip = null;
	$scope.myAcct._id = null;
	$scope.myCust = null; // inits cust
  }
  
  $scope.updateQuest = function () { // upsert question
    if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      AdminSvc.addQuest({
		module:	  	$scope.module,
		type:		't',
        question:	'What is the capital of Assyria?',
		answers:	["I don't know that.", "Ashur", "Babylon"],
		points:		[0, 2, 1]
      })
      .success(function (quest) {
		console.log('question stored');
      });
    } else {
		console.log('You are not authenticated!');
	}
  }
  
});