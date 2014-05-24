ToastyCMS 
==============
A CMS for developers like their bread baked twice.


ToastyCMS is my contribution to the world of content management systems. This version of ToastyCMS has been written completly using NodeJS using MongoDB as its core database. The client front end has been developed using AngularJS.

Out of the box Toasty provides an innovative file management system, access control mechanisms, as well at traditional content management features. 
- Defining Static Webpages using a Type -> Template -> Definition style of content management
- Extending the CMS with custom client side and server side modules.
 - Defining client side modules using an api exposed through AngularJS.
 - Defining server side modules using an api exposed through NodeJS.
- Managing access using a Windows NT inspired style of managing permissions
 - Access permissions are handled on every resource using cascading users and groups with create, read, update, and delete permissions  
- A simple built in file system that stores files in MongoDB using GridStore rather than reading and writing files to the hard disk.   

ToastyCMS is largely a personal project and not intended to compete with other, well established CMS platforms out there. It was originally designed with the CakePHP web framework in mind. 

The previous version of ToastyCMS can be found at http://github.com/icompuiz/toastycms and documentation can be found at http://toastycms.com/content/documentation. 
- High level Architecture: https://www.dropbox.com/s/m1f6fy94wjd93na/ToastyMap.pdf
- Model Specification: https://www.dropbox.com/s/wot7ldfugwnq1k7/ModelSpec.docx

Current documentation is coming soon, but in the mean time here are some snaps of my high level architecture/class diagram for it.
- Diagram 1: https://www.dropbox.com/s/eihyoy77q439k7e/WP_20140511_00_37_09_Pro.jpg
- Diagram 2: https://www.dropbox.com/s/jy2jo8ol2zfzn2c/WP_20140510_16_38_07_Pro.jpg
