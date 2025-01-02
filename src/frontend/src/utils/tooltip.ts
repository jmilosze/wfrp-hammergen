import { User } from "../services/user.ts";
import { WhProperty } from "../services/wh/common.ts";


export interface Tooltip {
	tile: string,
	content: string
}

type SharedItemTooltipParams = {
	shared: boolean;
	canEdit: boolean;
	ownerId: string;
};

export function getSharedItemTooltip({ shared, canEdit, ownerId }: SharedItemTooltipParams): Tooltip {
	let sharedTile = "";
	let sharedTooltip = "";



	if (shared) {
		if (canEdit) {
			sharedTile = "📤"
			sharedTooltip = "This item is shared with linked accounts"
		} else {
			sharedTile = "📥"
			sharedTooltip = "This item is being shared from a linked account"
		}
	}
	else {
	}

	if (ownerId == "admin") {
		sharedTile = ""
		sharedTooltip = ""
	}
	return { tile: sharedTile, content: sharedTooltip }
}
