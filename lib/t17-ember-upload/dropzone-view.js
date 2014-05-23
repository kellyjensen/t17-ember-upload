export default Ember.View.extend({
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