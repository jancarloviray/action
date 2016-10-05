import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import withHotkey from 'react-hotkey-hoc';

import IconLink from 'universal/components/IconLink/IconLink';
import ProgressBar from 'universal/modules/meeting/components/ProgressBar/ProgressBar';
import CheckInCards from 'universal/modules/meeting/components/CheckInCards/CheckInCards';
import MeetingMain from 'universal/modules/meeting/components/MeetingMain/MeetingMain';
import MeetingSection from 'universal/modules/meeting/components/MeetingSection/MeetingSection';
import {
  CHECKIN,
//  UPDATES,
  phaseOrder
} from 'universal/utils/constants';
import makePhaseItemFactory from 'universal/modules/meeting/helpers/makePhaseItemFactory';
import makePushURL from 'universal/modules/meeting/helpers/makePushURL';
import LoadingView from 'universal/components/LoadingView/LoadingView';
import Type from 'universal/components/Type/Type';

const MeetingCheckin = (props) => {
  const {
    bindHotkey,
    isFacilitating,
    localPhaseItem,
    members,
    router,
    team
  } = props;

  const {
    checkInGreeting,
    checkInQuestion,
    id: teamId,
    facilitatorPhase,
    facilitatorPhaseItem,
    meetingPhase,
    meetingPhaseItem
  } = team;
  if (localPhaseItem < 1) {
    const pushURL = makePushURL(team.id, facilitatorPhase, facilitatorPhaseItem);
    router.replace(pushURL);
  }
  if (localPhaseItem > members.length) {
    if (localPhaseItem <= facilitatorPhaseItem) {
      return <LoadingView/>;
    } else if (localPhaseItem > facilitatorPhaseItem) {
      return (
        <LoadingView>
          <div>(Are you sure you have there are that many team members?)</div>
        </LoadingView>
      );
    }
  }

  const phaseItemFactory = makePhaseItemFactory(isFacilitating, members.length, router, teamId, CHECKIN);
  // 1-indexed
  const isLastMember = localPhaseItem === members.length;
  const currentName = members[localPhaseItem - 1] && members[localPhaseItem - 1].preferredName;
  const isComplete = phaseOrder(meetingPhase) > phaseOrder(CHECKIN);
  const gotoNextItem = phaseItemFactory(localPhaseItem + 1);
  const gotoPrevItem = phaseItemFactory(localPhaseItem - 1);
  bindHotkey(['enter', 'right'], gotoNextItem);
  bindHotkey('left', gotoPrevItem);
  return (
    <MeetingMain>
      {/* */}
      <MeetingSection paddingBottom="2rem" paddingTop=".75rem">
        <ProgressBar
          clickFactory={phaseItemFactory}
          isComplete={isComplete}
          facilitatorPhaseItem={facilitatorPhaseItem}
          meetingPhaseItem={meetingPhaseItem}
          localPhaseItem={localPhaseItem}
          membersCount={members.length}
        />
      </MeetingSection>
      <MeetingSection flexToFill paddingBottom="2rem">
        <MeetingSection paddingBottom="2rem">
          <Type align="center" bold family="serif" scale="s6" colorPalette="warm">
            {checkInGreeting}, {currentName}—{checkInQuestion}?
          </Type>
        </MeetingSection>
        {/* */}
        <CheckInCards
          isFacilitating={isFacilitating}
          localPhaseItem={localPhaseItem}
          members={members}
          teamId={teamId}
        />
        <MeetingSection paddingBottom="2rem">
          <IconLink
            colorPalette="cool"
            icon="arrow-circle-right"
            iconPlacement="right"
            label={isLastMember ? 'Move on to Updates' : 'Next teammate (press enter)'}
            scale="large"
            onClick={gotoNextItem}
          />
        </MeetingSection>
        {/* */}
        {/* */}
      </MeetingSection>
      {/* */}
    </MeetingMain>
  );
};

MeetingCheckin.propTypes = {
  bindHotkey: PropTypes.func.isRequired,
  localPhaseItem: PropTypes.number,
  isFacilitating: PropTypes.bool,
  members: PropTypes.array,
  router: PropTypes.object.isRequired,
  team: PropTypes.object
};

export default withHotkey(
  withRouter(MeetingCheckin)
);
