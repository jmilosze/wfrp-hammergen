import { computed, ref, shallowRef, watch, WatchOptions } from "vue";
import { useAuth } from "./auth.ts";
import { useEdition } from "./edition.ts";
import { ContentApi, Edition, EDITIONS, Variants, Visibility, WhProperty } from "../services/wh/common.ts";
import { SubmissionState } from "../utils/submission.ts";
import { copySource } from "../services/wh/source.ts";

function copyVariants<T extends WhProperty>(variants: Variants<T>): Variants<T> {
  const copies: Variants<T> = {};
  for (const edition of EDITIONS) {
    const variant = variants[edition];
    if (variant !== undefined) {
      copies[edition] = variant.copy();
    }
  }
  return copies;
}

// useWhEdit edits a content document: one model per edition variant, shown one edition at a time.
// `wh` is the model of the selected edition, so forms bind to it as before.
export function useWhEdit<T extends WhProperty>(whInstance: T, elementApi: ContentApi<T>) {
  const auth = useAuth();
  const { edition: globalEdition } = useEdition();

  if (auth.isAdmin.value && whInstance.id === "create") {
    whInstance.visibility = Visibility.Public;
  }

  const edition = ref<Edition>(globalEdition.value);
  const start = whInstance.copy();
  const variants = shallowRef<Variants<T>>({ [edition.value]: start });
  const variantsOriginal = shallowRef<Variants<T>>(copyVariants(variants.value));
  const wh = ref(start);
  const initSources = ref(copySource(wh.value.source));

  const apiError = ref("");
  const showApiError = ref(true);

  const submissionState = ref(new SubmissionState());
  const showSubmissionStatus = ref(false);

  const hasVariant = computed(() => variants.value[edition.value] !== undefined);

  function show(variant: T) {
    wh.value = variant;
    initSources.value = copySource(variant.source);
  }

  // Switching edition shows that variant; a missing one keeps the previous model (for the header) until added.
  watch(edition, (newEdition) => {
    const variant = variants.value[newEdition];
    if (variant !== undefined) {
      show(variant);
    }
  });

  // addVariant starts the selected edition's variant from another variant, adjusted to the edition's rules.
  function addVariant() {
    const from = EDITIONS.map((e) => variants.value[e]).find((v) => v !== undefined);
    if (from === undefined) {
      return;
    }
    const variant = from.forEdition(edition.value);
    variants.value = { ...variants.value, [edition.value]: variant };
    show(variant);
  }

  async function loadWh(id: string): Promise<void> {
    if (id === "create") {
      return;
    }

    showApiError.value = true;
    try {
      variants.value = await elementApi.getDocument(id);
      variantsOriginal.value = copyVariants(variants.value);
      const shown = variants.value[edition.value] ?? EDITIONS.map((e) => variants.value[e]).find((v) => v);
      if (shown !== undefined) {
        show(shown);
      }
    } catch {
      apiError.value = "Error. Could not pull data from server.";
    }
  }

  const hasChanged = computed(() => {
    // Reading wh tracks edits of the shown variant; hidden variants don't change while hidden.
    const shown = wh.value;
    for (const e of EDITIONS) {
      const current = e === edition.value && hasVariant.value ? shown : variants.value[e];
      const original = variantsOriginal.value[e];
      if ((current === undefined) !== (original === undefined)) {
        return true;
      }
      if (current !== undefined && !current.isEqualTo(original)) {
        return true;
      }
    }
    return false;
  });

  const canEdit = computed(() => wh.value.id === "create" || auth.canEdit(wh.value.ownerId));

  async function submitForm(): Promise<boolean> {
    submissionState.value.setInProgress();

    const all = EDITIONS.map((e) => variants.value[e]).filter((v) => v !== undefined);
    if (!EDITIONS.every((e) => variants.value[e]?.isValid(e) ?? true)) {
      submissionState.value.setValidationError();
      return false;
    }

    // Visibility belongs to the document; the shown variant's value applies to all.
    for (const variant of all) {
      variant.visibility = wh.value.visibility;
    }

    showSubmissionStatus.value = true;

    try {
      if (wh.value.id === "create") {
        await elementApi.createDocument(wh.value.visibility, variants.value);
        submissionState.value.setSuccess(`${wh.value.name} created successfully.`);
      } else {
        await elementApi.updateDocument(wh.value.id, wh.value.visibility, variants.value);
        submissionState.value.setSuccess(`${wh.value.name} updated successfully.`);
      }
      variantsOriginal.value = copyVariants(variants.value);
      return true;
    } catch (error) {
      submissionState.value.setFailureFromError(error);
      return false;
    }
  }

  // deleteItem deletes the whole document, all variants.
  async function deleteItem(): Promise<boolean> {
    if (wh.value.id === "create") {
      return false;
    }

    submissionState.value.setInProgress();
    try {
      await elementApi.deleteElement(wh.value.id);
      variantsOriginal.value = copyVariants(variants.value);
      return true;
    } catch (error) {
      submissionState.value.setFailureFromError(error);
      showSubmissionStatus.value = true;
      return false;
    }
  }

  function resetForm() {
    const fresh = whInstance.copy();
    variants.value = { [edition.value]: fresh };
    variantsOriginal.value = copyVariants(variants.value);
    show(fresh);
  }

  // watchWh watches the shown variant, ignoring changes caused by switching to another variant.
  function watchWh<V>(source: (variant: T) => V, callback: (newValue: V) => void, options?: WatchOptions) {
    watch(
      () => [wh.value, source(wh.value)] as const,
      (newPair, oldPair) => {
        if (oldPair !== undefined && (oldPair[0] !== newPair[0] || Object.is(oldPair[1], newPair[1]))) {
          return;
        }
        callback(newPair[1]);
      },
      options,
    );
  }

  return {
    wh,
    edition,
    hasVariant,
    addVariant,
    canEdit,
    initSources,
    apiError,
    showApiError,
    loadWh,
    submitForm,
    deleteItem,
    hasChanged,
    submissionState,
    resetForm,
    showSubmissionStatus,
    watchWh,
  };
}
