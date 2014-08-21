/**
 * attach controllers to this module
 * if you get 'unknown {x}Provider' errors from angular, be sure they are
 * properly referenced in one of the module dependencies in the array.
 * below, you can see we bring in our controllers and constants modules
 * which avails each service of, for example, the `config` constants object.
 **/
define(['angular', 
	'codemirror',
    'codemirror/mode/htmlmixed/htmlmixed',
    'ui-codemirror',
], function(ng, codemirror) {
    'use strict';
    window.CodeMirror = codemirror;
    return ng.module('toastycms.controllers', ['toastycms.models', 'ui.codemirror']);
});
