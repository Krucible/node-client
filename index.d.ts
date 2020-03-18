import * as k8s from "@kubernetes/client-node";
import { AxiosInstance } from "axios";
export declare enum State {
    Deprovisioned = "deprovisioned",
    Deprovisioning = "deprovisioning",
    FailedDeprovision = "failed-deprovision",
    FailedProvision = "failed-provision",
    Provisioning = "provisioning",
    Running = "running"
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
declare class KrucibleClient {
    requester: AxiosInstance;
    constructor(config: KrucibleClientConfig);
    createCluster(createConfig: CreateClusterConfig): Promise<CreateClusterResult>;
    getReadyCluster(clusterId: string): Promise<ClusterExternalRepresentation>;
}
export default KrucibleClient;
