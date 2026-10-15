import { computed, MaybeRefOrGetter, Ref, ref, toValue, watch } from "vue";
import { useAuth } from "./auth.ts";
import { LoadState, useWhList } from "./whList.ts";
import { ApiHeaders, ContentApi, WhApi } from "../services/wh/core/api.ts";
import { Edition } from "../services/wh/core/edition.ts";
import { Visibility, WhProperty } from "../services/wh/core/entity.ts";
import { SubmissionState } from "../utils/submission.ts";
import { copySource } from "../services/wh/core/source.ts";
import { authRequest } from "../services/auth.ts";
import { Character } from "../services/wh/character/character.ts";
import { Career, careerApi } from "../services/wh/content/career.ts";
import { itemApi } from "../services/wh/content/item.ts";
import { mutationApi } from "../services/wh/content/mutation.ts";
import { prayerApi } from "../services/wh/content/prayer.ts";
import { skillApi } from "../services/wh/content/skill.ts";
import { spellApi } from "../services/wh/content/spell.ts";
import { talentApi } from "../services/wh/content/talent.ts";
import { traitApi } from "../services/wh/content/trait.ts";
import { SpeciesWithRegion } from "../services/wh/core/species.ts";

// useCharacterEdit edits a single-edition entity (a character of the given edition): the loaded one, or a new one
// started from whInstance when nothing is loaded.
export function useCharacterEdit<T extends WhProperty, TResponse extends ApiHeaders>(
  whInstance: T,
  loaded: T | undefined,
  elementApi: WhApi<T, TResponse>,
  edition: Edition,
) {
  const auth = useAuth();

  if (auth.isAdmin.value && whInstance.id === "create") {
    whInstance.visibility = Visibility.Public;
  }

  const wh = ref((loaded ?? whInstance).copy());
  const whOriginal = ref(wh.value.copy());
  const initSources = ref(copySource(wh.value.source));

  const submissionState = ref(new SubmissionState());
  const showSubmissionStatus = ref(false);

  const hasChanged = computed(() => !wh.value.isEqualTo(whOriginal.value));

  const canEdit = computed(() => wh.value.id === "create" || auth.canEdit(wh.value.ownerId));

  async function submitForm(): Promise<boolean> {
    submissionState.value.setInProgress();

    if (!wh.value.isValid(edition)) {
      submissionState.value.setValidationError();
      return false;
    }

    showSubmissionStatus.value = true;

    try {
      if (wh.value.id === "create") {
        await elementApi.createElement(wh.value);
        submissionState.value.setSuccess(`${wh.value.name} created successfully.`);
        return true;
      } else {
        await elementApi.updateElement(wh.value);
        submissionState.value.setSuccess(`${wh.value.name} updated successfully.`);
        return true;
      }
    } catch (error) {
      submissionState.value.setFailureFromError(error);
      return false;
    }
  }

  async function deleteItem(): Promise<boolean> {
    if (wh.value.id === "create") {
      return false;
    }

    submissionState.value.setInProgress();
    try {
      await elementApi.deleteElement(wh.value.id, edition);
      whOriginal.value = wh.value.copy() as T;
      return true;
    } catch (error) {
      submissionState.value.setFailureFromError(error);
      showSubmissionStatus.value = true;
      return false;
    }
  }

  function resetForm() {
    wh.value = whInstance.copy() as T;
    whOriginal.value = whInstance.copy() as T;
    initSources.value = copySource(wh.value.source);
  }

  return {
    wh,
    canEdit,
    whOriginal,
    initSources,
    submitForm,
    deleteItem,
    hasChanged,
    submissionState,
    resetForm,
    showSubmissionStatus,
  };
}

// useCharacterContentList loads a content type in the character's edition (own) and, while allow4e is on (5e
// characters only), also its 4e list. withAllowed is own plus the 4e content that has no 5e version; fourEIds are the
// ids of that 4e content. own alone is used where 4e content must not count (talent, trait and mutation modifiers,
// the generator).
function useCharacterContentList<T extends WhProperty>(
  elementApi: ContentApi<T>,
  edition: Edition,
  allow4e: MaybeRefOrGetter<boolean>,
) {
  const own = useWhList(elementApi, edition);
  const list4e = useWhList(elementApi, "4e");

  own.loadWhList();
  watch(
    () => toValue(allow4e),
    (newVal) => {
      if (newVal && list4e.whList.value.length === 0) {
        list4e.loadWhList();
      }
    },
    { immediate: true },
  );

  const fourEOnly = computed(() => {
    if (!toValue(allow4e)) {
      return [];
    }
    const ownIds = new Set(own.whList.value.map((x) => x.id));
    return list4e.whList.value.filter((x) => !ownIds.has(x.id));
  });

  const withAllowed = computed(() => [...own.whList.value, ...fourEOnly.value]);
  const fourEIds = computed(() => (toValue(allow4e) ? new Set(fourEOnly.value.map((x) => x.id)) : undefined));
  const loading = computed(() => own.loading.value || list4e.loading.value);

  async function reload(): Promise<void> {
    await Promise.all([own.loadWhList(), toValue(allow4e) ? list4e.loadWhList() : Promise.resolve()]);
  }

  return { own, list4e, withAllowed, fourEIds, fourEOnly, loading, reload };
}

// useCharacterContent loads the content a character editor offers, in the character's edition plus 4e content when a
// 5e character allows it, and keeps the character's talent, trait and mutation modifiers in step with the loaded
// content of its own edition. loading: some list is loading. loadStates: every list, for showing load errors.
export function useCharacterContent(wh: Ref<Character>, edition: Edition) {
  const allow4e = () => edition === "5e" && wh.value.allow4e;

  const content = {
    careers: useCharacterContentList(careerApi(authRequest), edition, allow4e),
    spells: useCharacterContentList(spellApi(authRequest), edition, allow4e),
    prayers: useCharacterContentList(prayerApi(authRequest), edition, allow4e),
    traits: useCharacterContentList(traitApi(authRequest), edition, allow4e),
    mutations: useCharacterContentList(mutationApi(authRequest), edition, allow4e),
    skills: useCharacterContentList(skillApi(authRequest), edition, allow4e),
    talents: useCharacterContentList(talentApi(authRequest), edition, allow4e),
    items: useCharacterContentList(itemApi(authRequest), edition, allow4e),
  };

  watch(
    () => content.talents.own.whList.value,
    (talents) => wh.value.hydrateTalentModifiers(talents),
    {
      immediate: true,
    },
  );
  watch(
    () => content.mutations.own.whList.value,
    (mutations) => wh.value.hydrateMutationModifiers(mutations),
    {
      immediate: true,
    },
  );
  watch(
    () => content.traits.own.whList.value,
    (traits) => wh.value.hydrateTraitModifiers(traits),
    {
      immediate: true,
    },
  );

  const lists = Object.values(content);
  const loading = computed(() => lists.some((x) => x.loading.value));
  const loadStates: LoadState[] = lists.flatMap((x) => [x.own, x.list4e]);

  return { ...content, loading, loadStates };
}

export type CharacterContent = ReturnType<typeof useCharacterContent>;

// useGenerationCareers is the generator's career choice: the careers open to the chosen species that have all four
// levels, by name; the chosen one moves to the first option when it is no longer offered.
export function useGenerationCareers(species: Ref<SpeciesWithRegion>, careers: Ref<Career[]>) {
  const careerOpts = computed(() =>
    careers.value
      .filter((x) => x.allowedForSpeciesWithRegion(species.value))
      .filter((x) => x.level1.exists && x.level2.exists && x.level3.exists && x.level4.exists)
      .map((x) => ({ text: x.name, value: x.id }))
      .sort((a, b) => a.text.localeCompare(b.text)),
  );
  const selectedCareer = ref("");

  watch(
    careerOpts,
    (newVal) => {
      if (!newVal.some((x) => x.value === selectedCareer.value)) {
        selectedCareer.value = newVal.length > 0 ? newVal[0].value : "";
      }
    },
    { immediate: true },
  );

  return { careerOpts, selectedCareer };
}
