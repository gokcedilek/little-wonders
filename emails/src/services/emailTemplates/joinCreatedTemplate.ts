import { JoinCreatedEvent } from '@gdsocialevents/common';

export default (JoinCreatedEventData: JoinCreatedEvent['data']) => {
  return `<div>Welcome to !${JoinCreatedEventData.id}</div>`;
};
