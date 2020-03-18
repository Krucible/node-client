import * as k8s from "@kubernetes/client-node";
import axios from "axios";
import { AxiosInstance } from "axios";

export enum State {
  Deprovisioned = "deprovisioned",
  Deprovisioning = "deprovisioning",
  FailedDeprovision = "failed-deprovision",
  FailedProvision = "failed-provision",
  Provisioning = "provisioning",
  Running = "running",
}

export interface ClusterExternalRepresentation {
  id: string;
  displayName: string;
  state: State;
  connectionDetails?: {
    server: string;
  };
  createdAt: string;
  expiresAt: string;
}

export interface KrucibleClientConfig {
  apiKeyId: string;
  apiKeySecret: string;
  accountId: string;
  baseURL?: string;
}

export interface CreateClusterConfig {
  displayName: string;
}

export interface CreateClusterResult {
  cluster: ClusterExternalRepresentation;
  kubeConfig: k8s.KubeConfig;
}

class KrucibleClient {
  requester: AxiosInstance;
  constructor(config: KrucibleClientConfig) {
    const baseURL = config.baseURL || "https://usekrucible.com/api";
    this.requester = axios.create({
      baseURL: `${baseURL}/accounts/${config.accountId}`,
      headers: {
        "Api-Key-Id": config.apiKeyId,
        "Api-Key-Secret": config.apiKeySecret,
      },
      validateStatus: () => true,
    });
  }

  async createCluster(createConfig: CreateClusterConfig): Promise<CreateClusterResult> {
    const createResp = await this.requester.post("/clusters", createConfig);
    if (createResp.status !== 201) {
      console.error(createResp.data);
      throw new Error("could not create cluster");
    }
    const cluster = await this.getReadyCluster(createResp.data.id);
    const kubeConfigResp = await this.requester.request({
      method: "GET",
      url: `/clusters/${cluster.id}/kube-config`,
    });
    if (kubeConfigResp.status !== 200) {
      throw new Error("couldn't get kubeConfig");
    }

    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromString(JSON.stringify(kubeConfigResp.data));

    return { kubeConfig, cluster };
  }

  // getReadyCluster blocks until cluster is ready or throws an error
  async getReadyCluster(clusterId: string): Promise<ClusterExternalRepresentation> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const clusterResp = await this.requester.request({
        url: `/clusters/${clusterId}`,
        method: "GET",
      });
      if (clusterResp.status !== 200) {
        throw new Error("failed to get cluster");
      }

      const cluster: ClusterExternalRepresentation = clusterResp.data;
      if (cluster.state === "running") {
        return cluster;
      }
      if (cluster.state !== "provisioning") {
        throw new Error("cluster did not enter running state");
      }
    }
  }
}

export default KrucibleClient;

async function test(): Promise<void> {
  const client = new KrucibleClient({
    baseURL: "http://localhost:3000/api",
    accountId: "a37b01f5-1b07-42d8-b817-58f628e3b604",
    apiKeyId: "307e7496-4019-470a-873d-c4a616a0ce70",
    apiKeySecret: "",
  });
  const { kubeConfig, cluster } = await client.createCluster({ displayName: "my-test-client" });

  console.log(cluster);

  const api = kubeConfig.makeApiClient(k8s.CoreV1Api);
  const { body } = await api.listNamespacedPod("kube-system");
  console.log(body.items.map((pod) => (pod.metadata ? pod.metadata.name : "pod has no name")));
}

if (require.main === module) {
  test();
}
