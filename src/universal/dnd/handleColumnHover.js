import {cashay} from 'cashay';
import {DND_THROTTLE, MEETING, MIN_SORT_RESOLUTION, TEAM_DASH, USER_DASH} from 'universal/utils/constants';
import checkDragForUpdate from 'universal/dnd/checkDragForUpdate';
import dndNoise from 'universal/utils/dndNoise';

/**
 * Assuming the whole column is a single drop target, we need to figure out where the drag source should go.
 * To do that, the monitor provides an array of components which are all the cards
 * From there, we can calculate the center Y for each card.
 * Based on the center Y and the sourceOffsetY, we can determine where the drag source currently is
 * A card has a do-nothing zone of the drag source height + 1/2 of the card above + 1/2 of the card below
 * if it exceeds that zone, we update
 *
 */

const areaOpLookup = {
  [MEETING]: 'meetingUpdatesContainer',
  [USER_DASH]: 'userColumnsContainer',
  [TEAM_DASH]: 'teamColumnsContainer'
};

let lastSentAt = 0;
export default function handleProjectHover(targetProps, monitor) {
  const now = new Date();
  if (lastSentAt > (now - DND_THROTTLE)) return;
  const {area, dragState, projects, queryKey, status: targetStatus} = targetProps;
  const sourceProps = monitor.getItem();
  const {status: sourceStatus} = sourceProps;
  if (targetStatus !== sourceStatus) {
    // we don't want the minY and minX to apply if we're hovering over another column
    dragState.handleEndDrag();
  }
  const updatedVariables = checkDragForUpdate(monitor, dragState, projects, 'sortOrder', true);
  if (!updatedVariables) return;

  const {prevItem, updatedDoc: updatedProject} = updatedVariables;
  // make it unique
  updatedProject.sortOrder += dndNoise();
  const variables = {updatedProject};

  if (sourceStatus !== targetStatus) {
    updatedProject.status = targetStatus;
    sourceProps.status = targetStatus;
  }
  if (prevItem && Math.abs(prevItem.sortOrder - updatedProject.sortOrder) < MIN_SORT_RESOLUTION) {
    variables.rebalance = targetStatus;
  }
  const op = areaOpLookup[area];
  const options = {
    ops: {
      [op]: queryKey
    },
    variables
  };
  lastSentAt = now;
  cashay.mutate('updateProject', options);
}
