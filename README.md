# <img src="https://platform.labs.text.com/console/favicon.ico" widht="24px" height="24px" /> Text Platform - Developer SDK

> The `Developer-SDK` is a part of the Text Platform Developer Studio and its main purpose is to arm your project with tooling that optimizes usage of `Text Platform` ecosystem.

[![mit](https://img.shields.io/badge/license-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)

## Installation

To use the `Developer SDK`, you need to install it first. You can do this using npm or yarn:

```bash
npm install @livechat/developer-sdk
```

## Developer App

The `App` is class that provides methods for initializing and configuring your developer application.

### Config

In order to use the `App` class in your project first you need to define your `AppConfig` accordingly to shape:

```ts
interface AppConfig {
  appId: string;
  blocks?: {
    authorization?: {
      clientId?: string;
    }
  },
  auth?: {
    mode?: "popup" | "iframe" | "redirect";
  };
}
```

We suggest store config in dedicated file: `livechat.config.json`

```ts
// livechat.config.json
{
  ...
}
```

but you can also store in it variable:

```ts
const config: AppConfig = {
  // ...
};
```

1. Developer App ID

A required property of `AppConfig` is `appId` - it can be obtained directly from Developer Console by extracting it from url:

```
https://platform.text.com/console/apps/{appId}/monitor
```

2. Authorization

If your Developer App has authorization block you can use `Developer-SDK` to process authorization for you. You can find value for property `clientId` in your Authorization block in Developer Console. Second parameter is `mode` - use can use three different strategies: `popup`, `iframe`, `redirect` (default if not given).

### Initialization

Use the `App.init` method to initialize your Developer App. It takes an `AppConfig` as its argument and returns an `App` instance:

```ts
import { App, AppConfig } from "@livechat/developer-sdk";
import lcConfig from "./livechat.config.json";

const config = lcConfig as unknown as AppConfig;
const app = App.init(config);
```

### Authorization

In order to trigger authorization you can use `authorize` method on your app instance:

```ts
await app.authorize();
```

Keep in mind that `authorize` method behavior vary depending on authorization strategy:

- for `popup` and `iframe` it resolves as soon as login process is finished and returns authorization data (also `app.authorization` is being filled)
- for `redirect` it returns `undefined`, but it redirects to login process and when it's back `authorize` method has to be call again to finalize authorization

Usage:

#### In react

In react applications you can build custom hook to ensure proper app initialization and authorization

```ts
function useDeveloperApp() {
  const [developerApp, setDeveloperApp] = useState<App | null>(null);

  useEffect(() => {
    const app = App.init(config);

    if (config.auth?.clientId) {
      app.authorize().then(() => setDeveloperApp(app));
    } else {
      setDeveloperApp(app);
    }
  }, []);

  return developerApp;
}
```

### Reporting

Developer app instance allows you to use Developer Console Reporting feature.

Usage:

```ts
await app.features.reporting.sendError("4xx");
```

Definition:

```ts
interface ReportingFeature {
  sendError(type: "4xx" | "5xx", payload?: string): Promise<void>;
}
```

API:

```yml
POST https://api.text.com/app_monitoring/${appId}/events
BODY
  required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            organization_id:
              type: string
              format: uuid
              description: Organization ID associated with the event
              example: 3aa138c1-c137-41c6-6b26-cface5857378
            type:
              type: string
              description: "Event type. Supported types: 4xx, 5xx"
              example: "4xx"
            payload:
              type: string
              description: "Event payload. Max length: 1 kB."
              example: "{\"code\": 404, \"reason\": \"Not found\"}"
```
