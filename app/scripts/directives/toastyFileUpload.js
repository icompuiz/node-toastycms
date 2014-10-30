define(['./module'], function(directives) {
    'use strict';

    directives.directive('toastyFileUpload', [
        function() {
            return {

                restrict: 'E',
                scope: {
                    onUploaderReady: '&',
                    file: '=model'
                },
                templateUrl: 'partials/directives/toastyFileUpload',
                controller: ['$scope', 'FileUploader', function($scope, FileUploader) {

                    $scope.uploader = new FileUploader({
                        queueLimit: 1
                    });

                    $scope.$watch('file.parent', function(parentId) {

                        if (parentId) {

                            $scope.uploader.url = '/api/fs/directories/' + parentId + '/files';
                            _.forEach($scope.uploader.queue, function(item) {
                                item.url = $scope.uploader.url;
                            });

                        }

                    });


                    function doUpload(doUploadTaskDone) {

                    	if ($scope.uploader.queue.length) {
	                        $scope.uploader.queue[0].formData = [$scope.file];

	                        $scope.uploader.onCompleteItem = function(item, response, status) {

	                            console.log(item);
	                            console.log(response);

	                            if (200 === status) {
	                                doUploadTaskDone(null, response);
	                            } else {
	                                var error = new Error('An error occurred while uploading the file');
	                                doUploadTaskDone(error);
	                            }

	                        };

	                        $scope.uploader.uploadAll();
                    	}


                    }

                    $scope.onUploaderReady({
                        uploaderOptions: {
                            upload: doUpload
                        }
                    });

                }]

            };
        }
    ]);
});
