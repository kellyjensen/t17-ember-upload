## Getting Started
### Install
Using bower `bower install t17-ember-upload --save`

### Import t17-ember-upload.js and t17-ember-upload.min.css in Brocfile.js

```js
app.import('vendor/t17-ember-upload/dist/t17-ember-upload.js', {
  exports: {
     't17-ember-upload': [
       'default',
       'UploadInputView',
       'DropzoneView',
       'FileObject',
       'UploadMixin',
     ]
  }
});

app.import('vendor/t17-ember-upload/dist/t17-ember-upload.min.css');
```

## Basic Setup

###Controller

1. Add upload-mixin to your controller.
2. Add the uploadUrl property.

```js
//app/controllers/category.js
import {UploadMixin} from 't17-ember-upload';

export default Ember.ObjectController.extend(UploadMixin, {
    uploadUrl: 'http://example.com/images'
});
```

### View

```js
//app/views/category.js
import {DropzoneView} from 't17-ember-upload';

export default DropzoneView.extend({
    element : '#two', //you can override the element of the dropzone, default is body
});
```

```js
//app/views/upload.js
import {UploadInputView} from 't17-ember-upload';

export default UploadInputView.extend();
```

### Template

```html
<!--app/templates/category.hbs-->
<div {{bind-attr class=":dropzone showDropzone:visible"}}>
    <div class="upload"></div>
    <div class="description">
        <span>Drop files to upload</span>
    </div>
</div>
```

Add the upload button.
```html
<!--app/templates/category.hbs-->
{{#view 'upload'}}
	{{view view.MultipleInput id="upload"}}
{{/view}}
```

###Example of category.hbs
```html
<!--app/templates/category.hbs-->
{{#if hasUploads}}
    <div>
      <button {{action "uploadAll"}}>Upload all</button>
      <label>Size: </label> {{totalFileSize}}
        <ul>
        {{#each file in files}}
            <li>
		<div>
		    {{#if file.isDisplayableImage}}
		        <img {{bind-attr src=file.base64Image}} />
		    {{else}}
		        <span>{{file.extension}}</span>
		    {{/if}}
		</div>
		<div>
		    {{#if file.isUploading}}
		        <span>uploading...</span>
		    {{/if}}
		    {{#if file.didError}}
		        <span>{{file.errorMessage.errors}}</span>
		    {{/if}}
		    {{#if file.didUpload}}
		        <span>Successfully uploaded</span>
		    {{/if}}
		    {{#unless file.didUpload}}
		        <a href="#" {{action "uploadFile" file}}>Upload</a>
		    {{/unless}}
		    <a href="#" {{action "removeFile" file}}>Remove File</a>
		</div>
            </li>
        {{/each}}
        </ul>
    </div>
{{/if}}
```
