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

// Define a type for your picker callback
export type PickerCallback = (data: {
  action: string;
  docs: CallbackDoc[];
}) => void;

// Define a type for your selected documents (replace with your actual type)
export interface IGoogleDriveDoc {
  id: string;
  name: string;
  mimeType: string;
  // Add other properties as needed
}

export type GooglePickerActionsType = "loaded" | "cancel" | "picked" | "tokenError";

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
  const [pickerInstance, setPickerInstance] = useState<any>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);

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
      pickerApiLoaded &&
      !tokenInvalid
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
    tokenInvalid,
  ]);

  const handleAuthResult = (authResult: any) => {
    if (authResult && !authResult.error) {
      setAuthRes(authResult);
      setPickerApiLoaded(true);
      setTokenInvalid(false);
    } else {
      console.error("Authentication error:", authResult.error);
      setTokenInvalid(true);
      closePicker();
      config.callbackFunction?.({ action: "tokenError", docs: [] }); // <== Callback on auth failure
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

  const closePicker = () => {
    const pickerDialogs = document.querySelectorAll(".picker-dialog");
    const pickerDialogsBg = document.querySelectorAll(".picker-dialog-bg");

    if (pickerInstance) {
      try {
        pickerInstance.setVisible(false);
      } catch (e) {
        console.error("Error hiding picker:", e);
      }

      setPickerInstance(null);
    }

    pickerDialogs?.forEach((it) => it.remove());
    pickerDialogsBg?.forEach((it) => it.remove());
  };

  const openPicker = (config: PickerConfiguration) => {
    setConfig(config);

    if (tokenInvalid) {
      console.warn("Token is invalid, not opening picker.");
      config.callbackFunction?.({ action: "tokenError", docs: [] }); // <== Callback when token is invalid
      return false;
    }

    if (!config.token) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        scope: [...(defaultScopes || []), ...(config?.customScopes || [])].join(
          " ",
        ),
        callback: (tokenResponse: authResult) => {
          if (tokenResponse && tokenResponse.access_token) {
            setAuthRes(tokenResponse);
            setTokenInvalid(false);
            createPicker({ ...config, token: tokenResponse.access_token });
          } else {
            console.error("Token retrieval failed:", tokenResponse);
            setTokenInvalid(true);
            closePicker();
            config.callbackFunction?.({ action: "tokenError", docs: [] }); // <== Callback on token fetch failure
          }
        },
        error_callback: (error: any) => {
          console.error("Error during token retrieval:", error);
          setTokenInvalid(true);
          closePicker();
          config.callbackFunction?.({ action: "tokenError", docs: [] }); // <== Callback on token fetch error
        },
      });

      client.requestAccessToken();
    } else if (loaded && !error && pickerApiLoaded) {
      validateToken(config.token)
        .then(() => {
          createPicker(config);
        })
        .catch(() => {
          console.error("Token validation failed, not opening picker.");
          setTokenInvalid(true);
          closePicker();
          config.callbackFunction?.({ action: "tokenError", docs: [] }); // <== Callback on validation failure
        });

      return true;
    } else {
      setOpenAfterAuth(true);
    }

    return undefined;
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
    if (disabled || tokenInvalid) return false;

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

    const picker = new google.picker.PickerBuilder()
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
              if (picker) {
                picker.setVisible(false);
                setPickerInstance(null);
              }
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
    const builtPicker = picker.build();
    setPickerInstance(builtPicker);
    builtPicker.setVisible(true);

    return true;
  };

  const validateToken = async (token: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
      );

      if (!response.ok) {
        console.error("Token validation failed:", response.status, response.statusText);
        setTokenInvalid(true);
        throw new Error(`Token validation failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Token validation successful:", data);
      setTokenInvalid(false);
    } catch (error: any) {
      console.error("Error validating token:", error);
      setTokenInvalid(true);
      throw error;
    }
  };

  return [openPicker, authRes];
}
