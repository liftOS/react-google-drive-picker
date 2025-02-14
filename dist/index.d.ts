import { authResult, CallbackDoc, PickerConfiguration } from "./typeDefs";
export type PickerCallback = (data: {
    action: string;
    docs: CallbackDoc[];
}) => void;
export interface IGoogleDriveDoc {
    id: string;
    name: string;
    mimeType: string;
}
export type GooglePickerActionsType = "loaded" | "cancel" | "picked" | "tokenError";
export default function useDrivePicker(): [
    (config: PickerConfiguration) => boolean | undefined,
    authResult | undefined
];
//# sourceMappingURL=index.d.ts.map