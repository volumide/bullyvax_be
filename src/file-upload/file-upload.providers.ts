import { FILE_UPLOAD_REPOSITORY } from "../constants";
import { File } from "./file.entity";

export const fileUploadProviders = [
    {
        provide: FILE_UPLOAD_REPOSITORY,
        useValue: File,
    }
]