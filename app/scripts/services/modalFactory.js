define(['./module'], function(services) {
    'use strict';
    services.service('ModalFactory', ['$modal',
        function($modal) {
        	
            var createModal = function(modalSettings) {

                

            };

            return {
                createModal: createModal
            }
        }
    ])
});
