// Posts controller
angular.module('app')
.controller('TypeCtrl', function ($scope, TypeSvc) {
  
  $scope.module = "jak"; // hard-coded for now, will add a wrapper later and set it there
  
  // initial load of questions (todo: when implementing types will need to change this)
  TypeSvc.fetch($scope.module)
  .success(function (quests) {
	$scope.trackAnswers = []; // to track answered questions
	$scope.nQuest = 0; // number of questions to be answered
	$scope.answersIncomplete = false; // answers incomplete flag to display message
	$scope.quests = quests; // to be shown in question jumbotron
	// internal storage to track answered questions
	var i=0;
	for(quest in quests) $scope.trackAnswers[i++] = -1;
	$scope.nQuest = i;
	
	$scope.myAcct = null; // inits acct
	$scope.myAcctId = null;
	$scope.myCust = null; // inits cust
  });

  $scope.addAcct = function () { // test data
    if ($scope.isAuth) { // authorized?
      TypeSvc.addAcct({
		module:	  $scope.module,
        name:     'testscct',
		zip:	  '1130'
      })
      .success(function (acct) {
		console.log('acct stored');
      })
    } else {
		console.log('You are not authenticated');
	}
  }
  
  $scope.findAcct = function () {
	if ($scope.isAuth) {
		TypeSvc.findAcct ($scope.module, $scope.myAcct)
		.success(function (accts) {
			$scope.accts = accts;
		});
	} else {
	console.log('You are not authenticated');
	}
  }
  
  $scope.setAcct = function (acct) {
	  $scope.myAcct = acct.name;
	  $scope.myAcctId = acct._id;
	  $scope.accts = [];
  }

  $scope.addCust = function () { // test data
    if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      TypeSvc.addCust({
		module:	  $scope.module,
        firstname:     'John',
		lastname:	  'Doe'
      })
      .success(function (cust) {
		console.log('cust stored');
      })
    } else {
		console.log('You are not authenticated!');
	}
  }
  
  $scope.findCust = function () {
	if ($scope.isAuth) {
		if ($scope.myAcctId) { // myAcct is set: search customers with restriction to acct
			TypeSvc.findCust ($scope.module, $scope.myAcctId, $scope.myCust)
			.success(function (custs) {
				$scope.custs = custs;
			});
		} else { // to do: take out and let svc deal with it
			TypeSvc.findCust ($scope.module, null, $scope.myCust)
			.success(function (custs) {
				$scope.custs = custs;
			});				
		}
	} else {
	console.log('You are not authenticated!');
	}
  }
  
  $scope.setCust = function (cust) {
	  $scope.myCust = cust.firstname + " " + cust.lastname;
	  $scope.custs = [];
	  TypeSvc.findAcctforCust ($scope.module, cust)
	  .success(function (custacct) {
		  //console.log('setcust ' + JSON.stringify(custacct) + ' acct name ' + custacct.name);
		  $scope.myAcct = custacct.name;
		  $scope.myAcctId = custacct._id;
	  });
  }
  
  $scope.addQuest = function () { // test data
    if ($scope.isAuth) { // postBody from: input ng-model='postBody' in template posts.html
      TypeSvc.addQuest({
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
  
  $scope.answerQuest = function (answer, anserind, index) {
	  // log answer for question and store points
	  $scope.trackAnswers[index] = anserind;
	  //console.log(' track: ' + $scope.trackAnswers[index] + ' points ' + points + ' index ' + index);
  }
  
  $scope.submitAnswers = function () {
	// check if user logged in and authorized
	if ($scope.isAuth) { // authorized?
	  // check if all questions have been answered
	  var i=0;
	  for (i=0; i<$scope.trackAnswers.length; i++) {
		  if($scope.trackAnswers[i]<0) break;
	  }
	  if(i<$scope.nQuest) {
		  console.log('not all questions answered');
		  $scope.answersIncomplete = true; // show warning (ng-show)
		  return;
	  } else $scope.answersIncomplete = false;
	  // submit answers to db
	  //console.log('submit answers ctrl: ' + $scope.module);
	  TypeSvc.submitAnswers ($scope.module, $scope.myCust, $scope.quests, $scope.trackAnswers)
	  .success(function () {
		console.log('answers submitted');
		
		// clear account and customer after submit
		$scope.myAcct = null; // inits acct
		$scope.myAcctId = null;
		$scope.myCust = null; // inits cust
	  });
    } else {
		console.log('You are not authenticated!');
	}	  
  }
  
});