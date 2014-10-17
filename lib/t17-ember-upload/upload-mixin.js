import FileObject from "t17-ember-upload/file-object";

export default Ember.Mixin.create({
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
                    Ember.keys(data).forEach(function (key) {
                        fd.append(key.toString(), data.get(key).toString());
                    });
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
                file.set('responseData', data);
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
                var fileUploadModel = FileObject.create({ fileToUpload: files[i] });
                if (Ember.isNone(this.get('files').findBy('name', files[i].name))){
                    this.get('files').pushObject(fileUploadModel);
                }
            }
        },
    }
});
