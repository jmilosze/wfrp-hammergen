import { AxiosInstance, isAxiosError } from "axios";
import { ref } from "vue";

export const MAINTENANCE_MESSAGE = "maintenance";
export const STATUS_PATH = "/api/status";

const maintenance = ref(false);

function isMaintenanceError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 503 && error.response.data?.message === MAINTENANCE_MESSAGE;
}

// Any request answered with the backend's maintenance 503 switches the whole app to the maintenance screen,
// so tabs opened before maintenance started stop working as soon as they talk to the API.
export function setupMaintenanceInterceptor(instance: AxiosInstance): number {
  return instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isMaintenanceError(error)) {
        maintenance.value = true;
      }
      return Promise.reject(error);
    },
  );
}

export async function checkMaintenance(instance: AxiosInstance): Promise<void> {
  const { data } = await instance.get<{ data: { maintenance: boolean } }>(STATUS_PATH);
  maintenance.value = data.data.maintenance;
}

export function resetMaintenanceState(): void {
  maintenance.value = false;
}

export function useMaintenance() {
  return { maintenance };
}
