import { JoinCreatedEvent } from '@gdsocialevents/common';

export default (data: JoinCreatedEvent['data']) => {
  //return `<div>Welcome to !${JoinCreatedEventData.id}</div>`;
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Thank you for signing up for the event ${data.post.id}!</h3>
          <p> Please confirm that you would like to attend this event:</p>
          <div>
            <a href=\`https://social-events.dev/joins/confirmed/${data.id}\`>Confirm</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
