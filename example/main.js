var app = angular.module('MyApp', ['cexFormValidation']);

app.controller('RegisterForm', ['$scope','$timeout', function ($scope,$timeout) {
	$scope.datas = {
		register :{
			first:"",
			last: "",
			email:"",
			pass:"",
			retrypass:""
		}
	};
	$scope.alerts = {
		'incorect login' : {
			type:'error',
			msg:'please fill all the data before registering'
		}
	}

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
	$scope.register = function(reg){
		$scope.alerts['incorect login'].show = true;
	}
}]);
