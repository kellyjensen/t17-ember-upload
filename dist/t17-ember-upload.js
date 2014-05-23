define("t17-ember-upload", 
  ["t17-ember-upload/upload-input-view","t17-ember-upload/dropzone-view","t17-ember-upload/file-object","t17-ember-upload/upload-mixin","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var uploadInputMixin = __dependency1__.uploadInputMixin;
    var dropzoneView = __dependency2__.dropzoneView;
    var fileObject = __dependency3__.fileObject;
    var uploadMixin = __dependency4__.uploadMixin;

    __exports__.uploadInputMixin = uploadInputMixin;
    __exports__.dropzoneView = dropzoneView;
    __exports__.fileObject = fileObject;
    __exports__.uploadMixin = uploadMixin;
  });
define("t17-ember-upload/dropzone-view", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.View.extend({
        element: 'body',
        didInsertElement: function() {
            var self = this;
            var dragDropEventHasFiles = function(evt) {
                try {
                    return evt.dataTransfer.types.contains('Files');
                } catch (e) {}
                return false;
            };
            var addDropzone = function() {
                self.controller.set('showDropzone', true);
            };
            var removeDropzone = function() {
                self.controller.set('showDropzone', false);
            };
            $('.dropzone').on('click', removeDropzone);
            $(this.get('element')).on('dragover', function(evt) {
                if (dragDropEventHasFiles(evt)) {
                    addDropzone();
                    return false;
                }
            }).on('dragleave', function(evt) {
                if (dragDropEventHasFiles(evt)) {
                    if ($(evt.target).hasClass('dropzone')){
                        removeDropzone();
                    }
                    return false;
                }
            }).on('drop', function(evt) {
                removeDropzone();
                if (dragDropEventHasFiles(evt)) {
                    self.controller.send('filesDropped', evt.dataTransfer.files);
                    return false;
                }
            });
        },
        willDestroyElement: function () {
            $(this.get('element')).unbind('dragover').unbind('dragleave').unbind('drop');
        }
    });
  });
define("t17-ember-upload/file-object", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Object.extend({
        init: function() {
            this._super();
            Ember.assert("File to upload required on init.", !!this.get('fileToUpload'));
            this.set('uploadPromise', Ember.Deferred.create());
        },
        readFile: function() {
            var self = this;
            var fileToUpload = this.get('fileToUpload');
            var isImage = fileToUpload.type.indexOf('image') === 0;
            this.set('name', fileToUpload.name);
            this.set('size', fileToUpload.size);
            // Don't read anything bigger than 10 MB
            if (isImage && fileToUpload.size < 10 * 1024 * 1024) {
                this.set('isDisplayableImage', isImage);
                var reader = new FileReader();
                reader.onload = function(e) {
                    self.set('base64Image', e.target.result);
                };
                reader.readAsDataURL(fileToUpload);
            }
        }.on('init'),
        name: '',
        size: 0,
        isDisplayableImage: false,
        base64Image: '',
        fileToUpload: null,
        uploadJqXHR: null,
        uploadPromise: null,
        isUploading: false,
        didUpload: false,
        didError: false,
        errorMessage: null,
        extension: function () {
            var ext = /(?:\.([^.]+))?$/;
            return ext.exec(this.get('name'))[1];
        }.property('name'),
    });
  });
define("t17-ember-upload/upload-input-view", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.View.extend({
        MultipleInput: Ember.View.extend({
            tagName: 'input',
            classNames: 'files',
            attributeBindings: ['type', 'multiple'],
            type: 'file',
            multiple: 'multiple',
            change: function(e) {
                var input = e.target;
                this.get('parentView.controller').send('filesDropped', input.files);
            }
        }),
    });
  });
define("t17-ember-upload/upload-mixin", 
  ["t17-ember-upload/file-object","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fileObject = __dependency1__["default"];

    __exports__["default"] = Ember.Mixin.create({
        init: function() {
            this._super();
            Ember.assert("UploadUrl required.", !!this.get('uploadUrl'));
        },
        files: [],
        totalFileSize: function() {
            var total = 0;
            this.get('files').forEach(function(file) {
                total += file.get('size');
            });
            return total;
        }.property('files.@each.size'),
        hasUploads: function() {
            return this.get('files.length') > 0;
        }.property('files.length'),
        hasCompleted: function() {
            return !!this.get('files').findProperty('didUpload');
        }.property('files.@each.didUpload'),
        actions: {
            removeFile: function(file) {
                this.get('files').removeObject(file);
            },
            removeCompleted: function() {
                var completed = this.get('files').filter(function(files){
                    if (files.get('didUpload') && !files.get('didError')){
                        return true;
                    }
                });
                this.get('files').removeObjects(completed);
            },
            uploadFile: function(file) {
                if (file.get('isUploading') || file.get('didUpload') || file.get('didError')) {
                    return file.get('uploadPromise');
                }

                var fileToUpload = file.get('fileToUpload');
                var name = file.get('name');
                var fd = new FormData();
                fd.append('Content-Type', fileToUpload.type);
                fd.append('file', fileToUpload);

                if (Ember.isArray(this.get('postData'))){
                    this.get('postData').forEach(function(data){
                        for (var key in data){
                            fd.append(key, data[key]);
                        }
                    });
                }

                file.set('isUploading', true);
                $.ajax({
                    url: this.get('uploadUrl'),
                    type: "POST",
                    data: fd,
                    processData: false,
                    contentType: false,
                    headers: this.get('requestHeaders'),
                    xhr: function() {
                        return $.ajaxSettings.xhr();
                    }
                }).done(function(data, textStatus, jqXHR) {
                    var value = "";
                try {
                    value = data.getElementsByTagName('Location')[0].textContent;
                } catch (e) { }
                    file.set('isUploading', false);
                    file.set('didUpload', true);
                    file.get('uploadPromise').resolve(value);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    file.set('isUploading', false);
                    file.set('didError', true);
                    file.set('errorMessage', $.parseJSON(jqXHR.responseText));
                    file.get('uploadPromise').reject(errorThrown);
                });
                return file.get('uploadPromise');
            },
            uploadAll: function() {
                var self = this;
                this.get('files').forEach(function(item) {
                    self.send('uploadFile', item);
                });
            },
            filesDropped: function(files){
                for (var i = 0; i < files.length; i++) {
                    var fileUploadModel = fileObject.create({ fileToUpload: files[i] });
                    if (Ember.isNone(this.get('files').findBy('name', files[i].name))){
                        this.get('files').pushObject(fileUploadModel);
                    }
                }
            },
        }
    });
  });