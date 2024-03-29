// Generated by Xata Codegen 0.28.3. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "publications",
    columns: [
      { name: "title", type: "string", unique: true },
      { name: "description", type: "text" },
      { name: "tags", type: "multiple" },
      { name: "category", type: "string" },
      { name: "authors", type: "string" },
      { name: "journal", type: "string" },
      { name: "date", type: "datetime" },
      { name: "link", type: "string" },
      { name: "image", type: "file[]" },
      { name: "draft", type: "bool", defaultValue: "false" },
      { name: "archived", type: "bool", defaultValue: "false" },
      { name: "slug", type: "string", unique: true },
      { name: "views", type: "int", defaultValue: "0" },
    ],
  },
  {
    name: "projects",
    columns: [
      { name: "title", type: "string", unique: true },
      { name: "description", type: "text" },
      { name: "category", type: "string" },
      { name: "authors", type: "string" },
      { name: "date", type: "datetime" },
      { name: "link", type: "string" },
      { name: "image", type: "file[]" },
      { name: "slug", type: "string", unique: true },
      { name: "views", type: "int", defaultValue: "0" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Publications = InferredTypes["publications"];
export type PublicationsRecord = Publications & XataRecord;

export type Projects = InferredTypes["projects"];
export type ProjectsRecord = Projects & XataRecord;

export type DatabaseSchema = {
  publications: PublicationsRecord;
  projects: ProjectsRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Fabian-Cano-s-workspace-k0kvqn.us-east-1.xata.sh/db/personalblog",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
