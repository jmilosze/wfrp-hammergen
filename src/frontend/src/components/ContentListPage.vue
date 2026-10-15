<script setup lang="ts" generic="T extends BrowseRow">
import { computed } from "vue";
import { useRouteQuery } from "@vueuse/router";
import LoadErrors from "./LoadErrors.vue";
import PageHeader from "./PageHeader.vue";
import FilterSidebar from "./FilterSidebar.vue";
import BrowseList from "./BrowseList.vue";
import SectionLink from "./SectionLink.vue";
import ToolTip from "./ToolTip.vue";
import IconButton from "./IconButton.vue";
import { BrowseRow } from "./browseRow.ts";
import { FilterSection } from "./filterSection.ts";
import { useAuth } from "../composables/auth.ts";
import { LoadState } from "../composables/whList.ts";

// A list page of a content type (or characters): the load error, the title, the filters with Create new, and the
// searchable list, by name, whose rows show the visibility icon and, at their end, the actions slot (Copy by default). The search
// is kept in the query string. routeName: the entry's page, also used to create one.
const props = defineProps<{
  title: string;
  routeName: string;
  items: T[];
  sections: FilterSection[];
  list: LoadState & { copyWh: (id: string) => Promise<void> };
}>();

const filters = defineModel<Record<string, string[]>>("filters", { required: true });

// A page's list never changes, so its Copy is taken once.
const { copyWh } = props.list;

const searchTerm = useRouteQuery("search", "");
const sortedItems = computed(() => [...props.items].sort((a, b) => a.name.localeCompare(b.name)));
const auth = useAuth();
</script>

<template>
  <LoadErrors :states="[list]" />
  <PageHeader :title="title" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" variant="dark" :routeName="routeName" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="sortedItems" :routeName="routeName" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" variant="dark" :routeName="routeName" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </span>

      <template #badge="{ ownerId, visibility }">
        <ToolTip :ownerId="ownerId" :visibility="visibility" iconOnly />
      </template>
      <template #end="{ id }">
        <slot :id="id" name="actions">
          <IconButton
            v-if="auth.loggedIn.value"
            icon="lucide:copy"
            label="Copy"
            variant="light"
            size="sm"
            class="my-1"
            @click="copyWh(id)"
          />
        </slot>
      </template>
    </BrowseList>
  </div>
</template>
