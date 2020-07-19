import { JoinCancelledEvent } from '@gdsocialevents/common';

export default (data: JoinCancelledEvent['data']) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Your signup for event ${data.post.id} has been cancelled!</h3>
          <p> Please click here if you would like to re-join this event:</p>
          <div>
            <a href=\`https://social-events.dev/posts/${data.post.id}\`>Confirm</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
