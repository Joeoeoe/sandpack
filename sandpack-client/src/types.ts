import type { ITemplate } from "codesandbox-import-util-types";

export interface SandpackBundlerFile {
  code: string;
  hidden?: boolean;
  active?: boolean;
  readOnly?: boolean;
}

export type SandpackBundlerFiles = Record<string, SandpackBundlerFile>;

export interface Module {
  code: string;
  path: string;
}

export type Modules = Record<
  string,
  {
    code: string;
    path: string;
  }
>;

export type Dependencies = Record<string, string>;

export type ReactDevToolsMode = "latest" | "legacy";

export interface ModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: unknown | undefined;
}

export enum SandpackLogLevel {
  None = 0,
  Error = 10,
  Warning = 20,
  Info = 30,
  Debug = 40,
}

export interface ErrorStackFrame {
  columnNumber: number;
  fileName: string;
  functionName: string;
  lineNumber: number;
  _originalColumnNumber: number;
  _originalFileName: string;
  _originalFunctionName: string;
  _originalLineNumber: number;
  _originalScriptCode: Array<{
    lineNumber: number;
    content: string;
    highlight: boolean;
  }>;
}

export interface TranspiledModule {
  module: Module;
  query: string;
  source: ModuleSource | undefined;
  assets: Record<string, ModuleSource>;
  isEntry: boolean;
  isTestFile: boolean;
  childModules: string[];
  /**
   * All extra modules emitted by the loader
   */
  emittedAssets: ModuleSource[];
  initiators: string[];
  dependencies: string[];
  asyncDependencies: string[];
  transpilationDependencies: string[];
  transpilationInitiators: string[];
}

export interface BundlerState {
  entry: string;
  transpiledModules: Record<string, TranspiledModule>;
}

export type ClientStatus =
  | "initializing"
  | "installing-dependencies"
  | "transpiling"
  | "evaluating"
  | "running-tests"
  | "idle";

export type ListenerFunction = (msg: SandpackMessage) => void;
export type UnsubscribeFunction = () => void;

export type Listen = (
  listener: ListenerFunction,
  clientId?: string
) => UnsubscribeFunction;
export type Dispatch = (msg: SandpackMessage, clientId?: string) => void;

export interface SandpackError {
  message: string;
  line?: number;
  column?: number;
  path?: string;
  title?: string;
}

export interface SandpackErrorMessage {
  title: string;
  path: string;
  message: string;
  line: number;
  column: number;
  payload: {
    frames?: ErrorStackFrame[];
  };
}

export type SandpackMessageConsoleMethods =
  | "log"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "table"
  | "clear"
  | "time"
  | "timeEnd"
  | "count"
  | "assert";

export interface BaseSandpackMessage {
  type: string;
  $id?: number;
  codesandbox?: boolean;
}

export interface BaseProtocolMessage {
  type: string;
  msgId: string;
}

export interface ProtocolErrorMessage extends BaseProtocolMessage {
  error: {
    message: string;
  };
}

export interface ProtocolResultMessage extends BaseProtocolMessage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

export interface ProtocolRequestMessage extends BaseProtocolMessage {
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[];
}

export interface NpmRegistry {
  enabledScopes: string[];
  limitToScopes: boolean;
  registryUrl: string;
  /**
   * It must be `false` if you're providing a sef-host solution,
   * otherwise, it'll try to proxy from CodeSandbox Proxy
   */
  proxyEnabled: boolean;
  registryAuthToken?: string;
}

export type SandpackMessage = BaseSandpackMessage &
  (
    | {
        type: "initialized";
      }
    | {
        type: "start";
        firstLoad?: boolean;
      }
    | {
        type: "status";
        status: ClientStatus;
      }
    | {
        type: "state";
        state: BundlerState;
      }
    | {
        type: "success";
      }
    | ({
        type: "action";
        action: "show-error";
      } & SandpackErrorMessage)
    | {
        type: "action";
        action: "notification";
        notificationType: "error";
        title: string;
      }
    | {
        type: "done";
        compilatonError: boolean;
      }
    | {
        type: "urlchange";
        url: string;
        back: boolean;
        forward: boolean;
      }
    | {
        type: "resize";
        height: number;
      }
    | {
        type: "transpiler-context";
        data: Record<string, Record<string, unknown>>;
      }
    | {
        type: "compile";
        version: number;
        isInitializationCompile?: boolean;
        modules: Modules;
        externalResources: string[];
        hasFileResolver: boolean;
        disableDependencyPreprocessing?: boolean;
        template?: string | ITemplate;
        showOpenInCodeSandbox: boolean;
        showErrorScreen: boolean;
        showLoadingScreen: boolean;
        skipEval: boolean;
        clearConsoleDisabled?: boolean;
        reactDevTools?: ReactDevToolsMode;
        logLevel?: SandpackLogLevel;
        customNpmRegistries?: NpmRegistry[];
      }
    | {
        type: "refresh";
      }
    | {
        type: "urlback";
      }
    | {
        type: "urlforward";
      }
    | {
        type: "get-transpiler-context";
      }
    | {
        type: "activate-react-devtools";
      }
    | {
        type: "console";
        log: Array<{
          method: SandpackMessageConsoleMethods;
          id: string;
          data: string[];
        }>;
      }
  );

export type Template =
  | "angular-cli"
  | "create-react-app"
  | "create-react-app-typescript"
  | "svelte"
  | "parcel"
  | "vue-cli"
  | "static"
  | "solid";
