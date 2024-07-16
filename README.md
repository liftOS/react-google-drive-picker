# React-google-drive-picker

Google drive picker

## Description

Google drive picker custom hook.

## Getting Started

### Installing

With npm
```
npm i @liftos-js/react-google-drive-picker
```
With yarn
```
yarn add @liftos-js/react-google-drive-picker
```

### Usage

```js
import  { useEffect } from 'react';
import useDrivePicker from '@liftos-js/react-google-drive-picker'


function App() {
  const [openPicker, authResponse] = useDrivePicker();  
  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: "xxxxxxxxxxxxxxxxx",
      developerKey: "xxxxxxxxxxxx",
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true, 
      supportDrives: true, // shared drives feature enable and display on navbar
      multiselect: true,
      filterImagesAndVideos: true // images and videos menu activated on navbar
      filterPDFs: true // pdfs menu activated on navbar
      filterFolders: true // folders menu activated on navbar
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data)
      },
    })
  }


  
  return (
    <div>
        <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export default App;
```


## Picker configuration props

## Picker Props

|    params        |   value  |  default value   |          description          |
|------------------|----------|------------------|-------------------------------|
| callbackFunction  |function    |  REQUIRED       |Callback function that will be called on picker action |
|    clientId      |  string  |     REQUIRED     |      Google client id         |
|    developerKey  |  string  |     REQUIRED     |      Google developer key     |
|    disableDefaultView  |  boolean  |     false     |      disables default view     |
|    viewId        |  string  |     DOCS         |         ViewIdOptions         |
|    viewMimeTypes |  string  |     optional     |Comma separated mimetypes. Use this in place of viewId if you need to filter multiple type of files. list: https://developers.google.com/drive/api/v3/mime-types.|
|setIncludeFolders|  boolean  |     false        |Show folders in the view items.|
|setSelectFolderEnabled|boolean|     false       |Allows the user to select a folder in Google Drive.|
|   token          |  string  |     optional     | access_token to skip auth part|
| setOrigin        |  string  |     optional     | Sets the origin of the Google Picker dialog |
|  multiselect     |  boolean |     false        | Enable picker multiselect     |
| supportDrives    |  boolean |     false        |    Support shared drives      |
| showUploadView   |  boolean |     false        |     Enable upload view        |
| showUploadFolders|  boolean |     false        |Enable folder selection(upload)|
| filterImagesAndVideos   |  boolean |     false        |     Enable image and video menu on navbar        |
| filterPDFs|  boolean |     false        | Enable pdfs menu on navbar |
| filterFolders|  boolean |     false        | Enable folders menu on navbar |
| setParentFolder  |  string  |     disabled     |  Drive folder id to upload    |
| customViews      |ViewClass[]|    optional     |  Array of custom views you want to add to the picker|
| customScopes      |string[]|    ['https://www.googleapis.com/auth/drive.readonly']     |  Array of custom scopes you want to add to the picker|
| locale           |string    |    en            | List of supported locales https://developers.google.com/picker/docs#i18n|


  ## viewId options
|    option            |         description             |
|----------------------|---------------------------------|
|    DOCS            |All Google Drive document types. |
|  DOCS_IMAGES          |Google Drive photos.             
|DOCS_IMAGES_AND_VIDEOS |Google Drive photos and videos.  |
|    DOCS_VIDEOS        |Google Drive videos.             |
|    DOCUMENTS          |	Google Drive Documents.         |
|    FOLDERS            |Google Drive Folders.            |
|    DRAWINGS           |Google Drive Drawings.           |
|    FORMS              |	Google Drive Forms.             |
|    PDFS               |PDF files stored in Google Drive.|
|    SPREADSHEETS       |Google Drive Spreadsheets.       |

## Author

[@Selcuk Sarikoz](https://www.linkedin.com/in/selcuk-sarikoz/)

[@Baris Ozdemirci](https://www.linkedin.com/in/ozdemircibaris/)

## Author (v1.2.2)

[@Jose medina](https://www.linkedin.com/in/jos%C3%A9-medina-56479a128/)
