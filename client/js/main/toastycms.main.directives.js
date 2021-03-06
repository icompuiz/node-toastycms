/* global define: true, $:true */

'use strict';
define(['./_mod'], function(directives) {

    /**
     * pageTitle - Directive for set Page title - mata title
     */
    var pageTitle = ['$rootScope', '$timeout', function pageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = 'INSPINIA | Responsive Admin Theme';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) {
                    	title = 'INSPINIA | ' + toState.data.pageTitle;
                    }
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    }];

    /**
     * sideNavigation - Directive for run metsiMenu on sidebar navigation
     */
    var sideNavigation = [function sideNavigation() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                // Call the metsiMenu plugin and plug it to sidebar navigation
                element.metisMenu();
            }
        };
    }];

    /**
     * iboxTools - Directive for iBox tools elements in right corner of ibox
     */
    var iboxTools = ['$timeout', function iboxTools($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'partials/views/common/ibox_tools',
            controller: ['$scope', '$element', function($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function() {
                        var ibox = $element.closest('div.ibox');
                        var icon = $element.find('i:first');
                        var content = ibox.find('div.ibox-content');
                        content.slideToggle(200);
                        // Toggle icon from up to down
                        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                        ibox.toggleClass('').toggleClass('border-bottom');
                        $timeout(function() {
                            ibox.resize();
                            ibox.find('[id^=map-]').resize();
                        }, 50);
                    };
                    // Function for close ibox
                    $scope.closebox = function() {
                        var ibox = $element.closest('div.ibox');
                        ibox.remove();
                    };
            }]
        };
    }];

    /**
     * minimalizaSidebar - Directive for minimalize sidebar
     */
    var minimalizaSidebar = ['$timeout', function minimalizaSidebar($timeout) {
            return {
                restrict: 'A',
                template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
                controller: ['$scope', '$element', function($scope, $element) {
                    $scope.minimalize = function() {
                        $('body').toggleClass('mini-navbar');
                        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                            // Hide menu in order to smoothly turn on when maximize menu
                            $('#side-menu').hide();
                            // For smoothly turn on menu
                            $timeout(function() {
                                $('#side-menu').fadeIn(500);
                            }, 100);
                        } else {
                            // Remove all inline style from jquery fadeIn function to reset menu state
                            $('#side-menu').removeAttr('style');
                        }
                    };
                }]
            };
    }];


    directives.directive('pageTitle', pageTitle)
        .directive('sideNavigation', sideNavigation)
        .directive('iboxTools', iboxTools)
        .directive('minimalizaSidebar', minimalizaSidebar);


});
