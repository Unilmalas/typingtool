// Posts controller
angular.module('app')
.controller('TypeCtrl', function ($scope, TypeSvc) {
	
  $scope.addAcct = function () {
    //if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      TypeSvc.addAcct({
        name:     'testscct',
		zip:	  '1130'
      })
      .success(function (post) {

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

  $scope.addCust = function () {
    //if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      TypeSvc.addCust({
        firstname:     'John',
		lastname:	  'Doe'
      })
      .success(function (post) {

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
	  $scope.myCust = cust.lastname;
	  $scope.custs = [];
  }
});