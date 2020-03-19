# Node.js Krucible Client

The official Node.js [Krucible](https://usekrucible.com) client. Provides a simple interface to create and
connect to temporary Kubernetes clusters for testing and development purposes.

The client is written in Typescript but is callable from Javascript.


## Installation

```
npm install @krucible/krucible-client
```

## Quick Start

```javascript
const KrucibleClient = require("@krucible/krucible-client");

// API key and account ID can be obtained at https://usekrucible.com/api-keys
const client = new KrucibleClient({
  accountId: "a36b01f5-1b07-42d8-b817-58f628e3b604",
  apiKeyId: "307e7496-3019-470a-873d-c4a616a0ce70",
  apiKeySecret: "my-api-key-secret",
});

const { kubeConfig, cluster } = await client.createCluster({
  displayName: "my-test-client"
});

// kubeConfig is provided by the official Kubernetes client:
// https://github.com/kubernetes-client/javascript
const api = kubeConfig.makeApiClient(k8s.CoreV1Api);

// print a list of pod names
const { body } = await api.listNamespacedPod("kube-system");
console.log(body.items.map((pod) => pod.metadata.name));

console.log(cluster);
// {
//   id: '37bc9fb1-9039-43e5-b548-de0f3791eaa3',
//   displayName: 'my-test-client',
//   state: 'running',
//   createdAt: '2020-03-01T17:50:53.374Z',
//   expiresAt: '2020-03-01T18:50:53.374Z',
//   connectionDetails: {
//     server: 'https://usekrucible.com/servers/37bc9fb1-9039-43e5-b548-de0f3791eaa3',
//   }
// }
```

## API

### `new KrucibleClient(options)`

The constructor takes an options object, as detailed below, and returns a
client.


#### Options

The options object has three parameters: the account ID and an API key ID and
secret. All of these can be obtained from https://usekrucible.com/api-keys.

##### Example:
```typescript
const client = new KrucibleClient({
  accountId: "a36b01f5-1b07-42d8-b817-58f628e3b604",
  apiKeyId: "307e7496-3019-470a-873d-c4a616a0ce70",
  apiKeySecret: "my-api-key-secret"
})
```

### `client.createCluster(createConfig)`

The client can be used to create a new cluster by calling the `createCluster`
method. 

#### `createConfig`

The `createConfig` is an object with one required property: a display name for
the cluster.

#### result

The `createCluster` method returns a Promise that resolves to an object
containing a `KubeConfig` object, as provided by the official [Kubernetes
Javascript driver](https://github.com/kubernetes-client/javascript), and some
metadata about the cluster.

Note that the promise will resolve when the cluster is ready—this should take
about a minute.

##### Example:

```typescript
const { kubeConfig, cluster } = await client.createCluster({
  displayName: "my-test-client"
});
```
