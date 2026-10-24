import { load, ReCaptchaInstance } from "recaptcha-v3";
import { onMounted, onUnmounted } from "vue";

const BYPASS = import.meta.env.VITE_BYPASS_RECAPTCHA === "true";
const BYPASS_TOKEN = "success";

// reCAPTCHA is loaded only by the pages that submit a token, so Google's script (and its cross-site cookies)
// stays off every other page. The library loads the script once and reuses it on later visits.
function loadRecaptcha(): Promise<ReCaptchaInstance> {
  return load(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
}

export function useRecaptcha() {
  let mounted = false;

  onMounted(async () => {
    mounted = true;
    const instance = await loadRecaptcha();
    if (mounted) {
      instance.showBadge();
    }
  });

  onUnmounted(async () => {
    mounted = false;
    const instance = await loadRecaptcha();
    instance.hideBadge();
  });

  async function getToken(action: string): Promise<string> {
    if (BYPASS) {
      return BYPASS_TOKEN;
    }
    const instance = await loadRecaptcha();
    return instance.execute(action);
  }

  return { getToken };
}
