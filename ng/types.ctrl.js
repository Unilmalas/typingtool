// Posts controller
angular.module('app')
.controller('TypeCtrl', function ($scope, TypeSvc) {

  // initial load of questions (todo: when implementing types will need to change this)
  TypeSvc.fetch()
  .success(function (quests) {
	$scope.quests = quests; // to be shown in question jumbotron
  });

  $scope.addAcct = function () { // test data
    //if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      TypeSvc.addAcct({
        name:     'testscct',
		zip:	  '1130'
      })
      .success(function (acct) {
		console.log('acct stored');
      })
    /*} else {
		console.log('You are not authenticated or post empty!');
	}*/
  }
  
  $scope.findAcct = function () {
		//if ($scope.isAuth) {
			TypeSvc.findAcct ($scope.myAcct)
			.success(function (accts) {
				$scope.accts = accts;
			});
		//}
  }
  
  $scope.setAcct = function (acct) {
	  $scope.myAcct = acct.name;
	  $scope.accts = [];
  }

  $scope.addCust = function () { // test data
    //if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      TypeSvc.addCust({
        firstname:     'John',
		lastname:	  'Doe'
      })
      .success(function (cust) {
		console.log('cust stored');
      })
    /*} else {
		console.log('You are not authenticated or post empty!');
	}*/
  }
  
  $scope.findCust = function () {
		//if ($scope.isAuth) {
			TypeSvc.findCust ($scope.myCust)
			.success(function (custs) {
				$scope.custs = custs;
			});
		//}
  }
  
  $scope.setCust = function (cust) {
	  $scope.myCust = cust.firstname + " " + cust.lastname;
	  $scope.custs = [];
	  TypeSvc.findAcctforCust (cust)
	  .success(function (custacct) {
		  //console.log('setcust ' + JSON.stringify(custacct) + ' acct name ' + custacct.name);
		  $scope.myAcct = custacct.name;
	  })
  }
  
  $scope.addQuest = function () { // test data
    //if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      TypeSvc.addQuest({
        question:	' What is the capital of Assyria?',
		answers:	["I don't know that.", "Ashur", "Babylon"],
		points:		[0, 2, 1]
      })
      .success(function (quest) {
		console.log('question stored');
      })
    /*} else {
		console.log('You are not authenticated or post empty!');
	}*/
  }
  
});