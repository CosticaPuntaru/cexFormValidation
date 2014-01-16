/**
 * Created by pc on 12/13/13.
 */
angular.module('cexFormValidation',[]);

angular.module('cexFormValidation').directive('elementAlert', function () {

	if(!String.prototype.capitalize )
		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1);
		}

	return {
		restrict: 'A',
		require: '^form',
		scope : {
			elementAlert: '@'
		},
		compile: function (tElement, tAttrs, transclude) {
			return function($scope, $el, attrs, form){

				if(form[attrs.name]){
					$scope.$watch(function(){
						return JSON.stringify(form[attrs.name]);
					}, function(oldValidity, newValidity){
						$scope.$broadcast('checkErrors');
					})
				}else{
					console.log('elementAlert missing input name for ',$el,form,attrs);
					return;
				}

				if(!$scope.hasOwnProperty('formErrorMessages') )
					$scope.formErrorMessages = {};

				var elementAlert = {};
				if(attrs.elementAlert){
					elementAlert = $scope.elementAlert;
				}

				if(!elementAlert.messages)
					elementAlert.messages = {};

				$scope.formErrorMessages.other = attrs['otherMsg'] || 'This field is incorrectly filled';
				$scope.formErrorMessages.email =  attrs['emailMsg'] || '"{value}" is a invalid email address';
				$scope.formErrorMessages.required =  attrs['requiredMsg'] || 'this field is requierd';
				$scope.formErrorMessages.minlength = attrs['minlengthMsg']  || attrs['ngMinlengthMsg']  ||  'this field must have at least {attr} characters';
				$scope.formErrorMessages.maxlength = attrs['maxlengthMsg']  || attrs['ngMaxlengthMsg']  || 'this field must have under {attr} characters';

				if(! elementAlert.order || !Array.isArray(elementAlert.order) )
					elementAlert.order =[];

				$scope.currentErrorMessage = [];

				$scope.applyErrors = function(){
					var currentErrorMessage = "";

					var errorLimit = elementAlert['visibleErrors'] || 1;

					$scope.currentErrorMessage = $scope.currentErrorMessage.sort(function(a,b){
						if(elementAlert.order.indexOf(a) > elementAlert.order.indexOf(b))
							return 1;
						if(elementAlert.order.indexOf(a) < elementAlert.order.indexOf(b))
							return -1;
						return 0;
					})

					for(var i = 0 ; i< $scope.currentErrorMessage.length &&(errorLimit==-1 || i<errorLimit) ; i++){
						var message = $scope.formErrorMessages['other'];
						if(elementAlert.messages && elementAlert.messages[$scope.currentErrorMessage[i]]){
							message=elementAlert.messages[$scope.currentErrorMessage[i]];
						}else if($scope.formErrorMessages[$scope.currentErrorMessage[i]]){
							message = $scope.formErrorMessages[$scope.currentErrorMessage[i]];
						} else{
							console.log('missing error message for',$scope.currentErrorMessage[i],attrs);
						}
						message = message
							.replace('{value}', $el.val()||"???")
							.replace('{attr}',attrs[$scope.currentErrorMessage[i]]||attrs['ng'+$scope.currentErrorMessage[i].capitalize()]||"???");
						currentErrorMessage += '<div class="error-line" >' + message + '</div>';
					}

					if($scope.alert){
						$scope.alert.remove();
					}

					$scope.alert = angular.element('<div ">'+currentErrorMessage+'</div>');

					$scope.alert.css({'position':'absolute','margin-top': - $el.outerHeight()-$el.outerHeight()/2 +3, 'margin-left':$el.outerWidth()}).addClass('input-validation-error');
					$el.after($scope.alert);
				}
				$scope.$on('hideErrors',function(){
					$scope.hideErrors();
				})
				$scope.hideErrors = function(){
					if($scope.alert){
						$scope.alert.remove();
					}
				}
				$scope.$on('checkErrors',function(){
					if (form.$pristine) {
						return;
					}

					$scope.currentErrorMessage = [];
					for(var err in  form[attrs.name].$error){
						if(form[attrs.name].$error[err]){
							$scope.currentErrorMessage.push(err);
						}
					}
					if($scope.currentErrorMessage.length){
						$scope.applyErrors();
					}else if($scope.alert){
						$scope.alert.remove();
					}
				})
			}
		},
		link: function ($scope, $el, attrs, ctrl) {

		}
	}
});
