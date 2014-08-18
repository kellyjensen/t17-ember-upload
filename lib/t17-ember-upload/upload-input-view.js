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
        },
        didInsertElement: function (){
            //bugfix firefox old mac
            //its not fireing the input type="file" from label
            //workaround: triggers the input type="file"
            if(bowser.name === "Firefox" && bowser.version <= 16){
                var $parent = this.$().closest('.upload');

                $parent.children('label').on('click', function (){
                    $parent.children('input').trigger('click');
                });
            }
        },
    }),
});