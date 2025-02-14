/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let google: any;
declare let window: any;

import { useEffect, useState } from "react";
import {
  authResult,
  CallbackDoc,
  defaultConfiguration,
  PickerConfiguration,
} from "./typeDefs";
import useInjectScript from "./useInjectScript";

export default function useDrivePicker(): [
  (config: PickerConfiguration) => boolean | undefined,
  authResult | undefined,
] {
  const defaultScopes = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
  ];

  const [loaded, error] = useInjectScript("https://apis.google.com/js/api.js");
  const [loadedGsi, errorGsi] = useInjectScript(
    "https://accounts.google.com/gsi/client",
  );
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [openAfterAuth, setOpenAfterAuth] = useState(false);
  const [config, setConfig] =
    useState<PickerConfiguration>(defaultConfiguration);
  const [authRes, setAuthRes] = useState<authResult>();

  let picker: any;

  useEffect(() => {
    if (loaded && !error && loadedGsi && !errorGsi && !pickerApiLoaded) {
      loadApis();
    }
  }, [loaded, error, loadedGsi, errorGsi, pickerApiLoaded]);

  useEffect(() => {
    if (
      openAfterAuth &&
      config.token &&
      loaded &&
      !error &&
      loadedGsi &&
      !errorGsi &&
      pickerApiLoaded
    ) {
      createPicker(config);
      setOpenAfterAuth(false);
    }
  }, [
    openAfterAuth,
    config.token,
    loaded,
    error,
    loadedGsi,
    errorGsi,
    pickerApiLoaded,
  ]);

  const handleAuthResult = (authResult: any) => {
    if (authResult && !authResult.error) {
      setAuthRes(authResult);
      setPickerApiLoaded(true);
    } else {
      console.error("Authentication error:", authResult.error);
    }
  };

  const onAuthApiLoad = () => {
    window.gapi.auth.authorize(
      {
        client_id: config.clientId,
        scope: defaultScopes,
        immediate: false,
      },
      handleAuthResult,
    );
  };

  const openPicker = (config: PickerConfiguration) => {
    setConfig(config);

    if (!config.token) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: [...(defaultScopes || []), ...(config?.customScopes || [])].join(
          " ",
        ),
        callback: (tokenResponse: authResult) => {
          setAuthRes(tokenResponse);
          createPicker({ ...config, token: tokenResponse.access_token });
        },
      });

      client.requestAccessToken();
    } else if (loaded && !error && pickerApiLoaded) {
      return createPicker(config);
    } else {
      setOpenAfterAuth(true);
    }
  };

  const loadApis = () => {
    window.gapi.load("auth", { callback: onAuthApiLoad });
    window.gapi.load("picker", { callback: onPickerApiLoad });
  };

  const onPickerApiLoad = () => {
    setPickerApiLoaded(true);
  };

  const createPicker = ({
    title,
    token,
    appId = "",
    supportDrives = true,
    developerKey,
    viewId = "DOCS",
    disabled,
    multiselect,
    setOrigin,
    showUploadView = false,
    showUploadFolders,
    setParentFolder = "",
    viewMimeTypes,
    customViews,
    locale = "en",
    setIncludeFolders = false,
    setSelectFolderEnabled,
    disableDefaultView = false,
    callbackFunction,
    navHidden = false,
    filterImagesAndVideos = false,
    filterPDFs = false,
    filterFolders = false,
    filterStarred = true,
  }: PickerConfiguration) => {
    if (disabled) return false;

    const view = new google.picker.DocsView(google.picker.ViewId[viewId]);
    if (viewMimeTypes) view.setMimeTypes(viewMimeTypes);
    if (setIncludeFolders) view.setIncludeFolders(true);
    if (setSelectFolderEnabled) view.setSelectFolderEnabled(true);

    const starredView = new google.picker.DocsView(
      google.picker.ViewId[viewId],
    );
    starredView.setStarred(filterStarred).setLabel("Starred");
    if (viewMimeTypes) starredView.setMimeTypes(viewMimeTypes);
    if (setIncludeFolders) starredView.setIncludeFolders(true);
    if (setSelectFolderEnabled) starredView.setSelectFolderEnabled(true);

    const uploadView = new google.picker.DocsUploadView();
    if (viewMimeTypes) uploadView.setMimeTypes(viewMimeTypes);
    if (showUploadFolders) uploadView.setIncludeFolders(true);
    if (setParentFolder) {
      uploadView.setParent(setParentFolder);
      view.setParent(setParentFolder);
    }

    const sharedDriveView = new google.picker.DocsView();
    sharedDriveView.setOwnedByMe(false);
    if (viewMimeTypes) sharedDriveView.setMimeTypes(viewMimeTypes);
    if (setIncludeFolders) sharedDriveView.setIncludeFolders(true);
    if (setSelectFolderEnabled) sharedDriveView.setSelectFolderEnabled(true);
    if (supportDrives) sharedDriveView.setEnableDrives(true);

    const foldersView = new google.picker.DocsView(
      google.picker.ViewId.FOLDERS,
    );
    if (setIncludeFolders) foldersView.setIncludeFolders(true);
    if (setSelectFolderEnabled) foldersView.setSelectFolderEnabled(true);

    const imagesAndVideos = new google.picker.DocsView(
      google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS,
    );
    const pdfs = new google.picker.DocsView(google.picker.ViewId.PDFS);

    picker = new google.picker.PickerBuilder()
      .setAppId(appId)
      .setOAuthToken(token)
      .setDeveloperKey(developerKey)
      .setLocale(locale)
      .setCallback((data: { action: string; docs: CallbackDoc[] }) => {
        const pickerDialogs = document.querySelectorAll(".picker-dialog");
        const pickerDialogsBg = document.querySelectorAll(".picker-dialog-bg");

        function clearView(close: boolean) {
          if (close || data?.docs?.length) {
            callbackFunction?.({ action: "cancel", docs: [] });
            setTimeout(() => {
              picker.build().setVisible(false);
              pickerDialogs?.forEach((it) => it.remove());
              pickerDialogsBg?.forEach((it) => it.remove());
            }, 100);
          }
        }

        pickerDialogsBg?.forEach((it) => {
          const elem = it as HTMLDivElement;
          elem.onclick = () => {
            clearView(true);
          };
        });

        callbackFunction?.(data);

        clearView(data?.action === "cancel");
      });

    if (setOrigin) {
      picker.setOrigin(setOrigin);
    }

    if (!disableDefaultView) {
      picker.addView(view);
    }

    if (filterFolders) {
      picker.addView(foldersView);
    }

    if (supportDrives) {
      picker.addView(sharedDriveView);
      picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
    }

    if (filterImagesAndVideos) {
      picker.addView(imagesAndVideos);
    }

    if (filterPDFs) {
      picker.addView(pdfs);
    }

    if (navHidden) {
      picker.enableFeature(google.picker.Feature.NAV_HIDDEN);
    }

    if (customViews) {
      customViews.forEach((view) => picker.addView(view));
    }

    if (multiselect) {
      picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (showUploadView) {
      picker.addView(uploadView);
    }

    if (filterStarred) {
      picker.addView(starredView);
    }

    picker.setTitle(title || "Google Drive Picker");
    picker.build().setVisible(true);
    return true;
  };

  return [openPicker, authRes];
}
