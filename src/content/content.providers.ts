import { CONTENT_REPOSITORY } from "../constants";
import { Content } from "./content.entity";

export const contentProviders = [
    {
        provide: CONTENT_REPOSITORY,
        useValue: Content,
    }
]