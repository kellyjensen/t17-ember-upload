t17-ember-upload
================

####at the moment works only for [Ember App Kit](https://github.com/stefanpenner/ember-app-kit) / [Ember CLI](https://github.com/stefanpenner/ember-cli)

trick17.media Ember Upload is an asynchronous file uploader with HTML5's drag and drop.

##Features

* Upload files asynchronously
* Upload with HTML5's drag and drop
* Instant image previews after dropping
* Allows the deletion of files before they're uploaded
* Keeps a track of all files

## Getting Started
### Install
Using bower `bower install t17-ember-upload --save`

### Include

* CSS: ```<link rel="stylesheet" href="/vendor/t17-ember-upload/dist/t17-ember-upload.min.css">```
* Javascript: ```<script src="/vendor/t17-ember-upload/dist/t17-ember-upload.js"></script>```

## Basic Setup

###Controller

1. Add upload-mixin to your controller.
2. Add the uploadUrl property.

```js
//app/controllers/category.js
import uploadMixin from "t17-ember-upload/upload-mixin";

export default Ember.ObjectController.extend(uploadMixin, {
    uploadUrl: 'http://example.com/images'
});
```

### View

```js
//app/views/category.js
import dropzoneView from "t17-ember-upload/dropzone-view";

export default dropzoneView.extend({
    element : '#two', //you can override the element of the dropzone, default is body
});
```

```js
//app/views/upload.js
import uploadInputView from "t17-ember-upload/upload-input-view";

export default uploadInputView.extend();
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

##Thanks
Inspired by [workmanw/embernati-upload-demo](https://github.com/workmanw/embernati-upload-demo) and [benefitcloud/ember-uploader](https://github.com/benefitcloud/ember-uploader)

## License
Copyright (c) 2014 trick17.media
Licensed under the MIT license.
