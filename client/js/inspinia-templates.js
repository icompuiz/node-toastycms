angular.module('inspinia.templates', ['404', 'index', 'partials/common/footer', 'partials/common/ibox_tools', 'partials/common/navigation', 'partials/common/topnavbar', 'partials/main', 'partials/minor']);

angular.module("404", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("404",
    "");
}]);

angular.module("index", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("index",
    "<!DOCTYPE html(ng-app='inspinia')><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/><!-- Page title set in pageTitle directive--><title page-title=\"\"></title><!-- Bootstrap and Fonts--><link href=\"css/bootstrap.min.css\" rel=\"stylesheet\"/>    <link href=\"font-awesome/css/font-awesome.css\" rel=\"stylesheet\"/><!-- Main Inspinia CSS files--><link href=\"css/animate.css\" rel=\"stylesheet\"/>    <link href=\"css/style.css\" rel=\"stylesheet\"/><!-- ControllerAs syntax--><!-- Main controller with serveral data used in Inspinia theme on diferent view--><body ng-controller=\"MainCtrl as main\"><!-- Wrapper--><div id=\"wrapper\"><!-- Navigation--><div ng-include=\"'views/common/navigation.html'\"></div><!-- Page wraper--><!-- ng-class with current state name give you the ability to extended customization your view--><div id=\"page-wrapper\" class=\"gray-bg {{$state.current.name}}\"><!-- Page wrapper--><div ng-include=\"'views/common/topnavbar.html'\"></div><!-- Main view--><div ui-view=\"\"></div><!-- Footer--><div ng-include=\"'views/common/footer.html'\"></div></div><!-- End page wrapper--></div><!-- End wrapper--></body><!-- jQuery and Bootstrap--><script src=\"js/jquery/jquery-2.1.1.min.js\"></script><script src=\"js/plugins/jquery-ui/jquery-ui.js\"></script><script src=\"js/bootstrap/bootstrap.min.js\"></script><!-- MetsiMenu--><script src=\"js/plugins/metisMenu/jquery.metisMenu.js\"></script><!-- Peace JS--><script src=\"js/plugins/pace/pace.min.js\"></script><!-- SlimScroll--><script src=\"js/plugins/slimscroll/jquery.slimscroll.min.js\"></script><!-- Custom and plugin javascript--><script src=\"js/inspinia.js\"></script><!-- Angular scripts--><script src=\"js/angular/angular.min.js\"></script><script src=\"js/ui-router/angular-ui-router.min.js\"></script><script src=\"js/bootstrap/ui-bootstrap-tpls-0.11.0.min.js\"></script><!-- Angular Dependiences--><!-- Anglar App Script--><script src=\"js/app.js\"></script><script src=\"js/config.js\"></script><script src=\"js/directives.js\"></script><script src=\"js/controllers.js\"></script></head>");
}]);

angular.module("partials/common/footer", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/common/footer",
    "<div class=\"footer\"><div class=\"pull-right\">Example text   </div><div><strong>Copyright</strong> Example Company &copy; 2014-2015</div></div>");
}]);

angular.module("partials/common/ibox_tools", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/common/ibox_tools",
    "<div class=\"ibox-tools dropdown\"><a ng-click=\"showhide()\"><i class=\"fa fa-chevron-up\">    </i></a><a href=\"\" class=\"dropdown-toggle\"><i class=\"fa fa-wrench\"></i></a><a ng-click=\"closebox()\"><i class=\"fa fa-times\"></i></a></div>");
}]);

angular.module("partials/common/navigation", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/common/navigation",
    "<nav role=\"navigation\" class=\"navbar-default navbar-static-side\"><div class=\"sidebar-collapse\"><ul id=\"side-menu\" side-navigation=\"\" class=\"nav\"><li class=\"nav-header\"><div class=\"dropdown profile-element\"><!-- Picture of user--><!-- <img alt=\"image\" class=\"img-circle\" src=\"img/profile_small.jpg\"/>--><a href=\"\" class=\"dropdown-toggle\"><span class=\"clear\"><span class=\"block m-t-xs\"><strong class=\"font-bold\">{{main.userName}}</strong></span>                                <span class=\"text-muted text-xs block\">Example menu<b class=\"caret\"></b></span></span></a>                    <ul class=\"dropdown-menu animated fadeInRight m-t-xs\"><li><a href=\"\">Logout</a></li></ul></div>                <div class=\"logo-element\">IN+</div></li>            <li ui-sref-active=\"active\"><a ui-sref=\"main\"><i class=\"fa fa-laptop\"></i> <span class=\"nav-label\">Main page</span></a></li>            <li ui-sref-active=\"active\"><a ui-sref=\"minor\"><i class=\"fa fa-desktop\"></i> <span class=\"nav-label\">Minor page</span></a></li></ul></div></nav>");
}]);

angular.module("partials/common/topnavbar", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/common/topnavbar",
    "<div class=\"row border-bottom\"><nav role=\"navigation\" style=\"margin-bottom: 0\" class=\"navbar navbar-static-top white-bg\"><div class=\"navbar-header\"><span minimaliza-sidebar=\"\"></span>            <form role=\"search\" method=\"post\" action=\"\" class=\"navbar-form-custom\"><div class=\"form-group\"><input id=\"top-search\" type=\"text\" placeholder=\"Search for something...\" name=\"top-search\" class=\"form-control\"/></div></form></div>        <ul class=\"nav navbar-top-links navbar-right\"><li><a href=\"\"><i class=\"fa fa-sign-out\"></i> Log out</a></li></ul></nav></div>");
}]);

angular.module("partials/main", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/main",
    "<div class=\"wrapper wrapper-content animated fadeInRight\"><div class=\"row\"><div class=\"col-lg-12\"><div class=\"text-center m-t-lg\"><h1>{{main.helloText}}</h1>                <small>{{main.descriptionText}}</small></div></div></div></div>");
}]);

angular.module("partials/minor", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/minor",
    "<div class=\"wrapper wrapper-content animated fadeInRight\"><div class=\"row\"><div class=\"col-lg-12\"><div class=\"text-center m-t-lg\"><h1>Simple example of second view</h1>                <small>Configure in config.js as minor state.</small></div></div></div></div>");
}]);
