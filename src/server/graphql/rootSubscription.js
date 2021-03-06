import {GraphQLObjectType} from 'graphql';
import action from './models/Action/actionSubscription';
import agenda from './models/AgendaItem/agendaItemSubscription';
import invitation from './models/Invitation/invitationSubscription';
import presence from './models/Presence/presenceSubscription';
import project from './models/Project/projectSubscription';
import team from './models/Team/teamSubscription';
import teamMember from './models/TeamMember/teamMemberSubscription';

const rootFields = Object.assign({},
  action,
  agenda,
  invitation,
  presence,
  project,
  team,
  teamMember
);

export default new GraphQLObjectType({
  name: 'RootSubscription',
  fields: () => rootFields
});
