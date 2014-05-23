export default Ember.Object.extend({
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