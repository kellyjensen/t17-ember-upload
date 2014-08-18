export default Ember.View.extend({
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