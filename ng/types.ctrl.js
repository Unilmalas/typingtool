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
			.success(function (acct) {
				$scope.myAcct = acct;
			});
		//}
  }
});