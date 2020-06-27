import * as sendgrid from 'sendgrid';
const helper = sendgrid.mail;

export class SendGridMail extends helper.Mail {}
export class SendGridEmail extends helper.Email {}
export class SendGridContent extends helper.Content {}

export class Mailer extends SendGridMail {
  private sendGrid: any;
  private mail: SendGridMail;

  constructor(metadata: { subject: string; receiver: string }, body: string) {
    super();
    const from = new SendGridEmail('gokcedilek99@gmail.com'); //need to change
    const subject = metadata.subject;
    const recipient = new SendGridEmail(metadata.receiver);
    const content = new helper.Content('text/html', body);
    //super(from, subject, recipient, content);
    this.mail = new SendGridMail(from, subject, recipient, content);

    this.sendGrid = require('sendgrid')(process.env.SENDGRID_KEY);

    this.addContent(content);
    this.addClickTracking();
    this.addRecipient(recipient);
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true); //might need openTracking instead since i may not have links in my emails

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipient(recipient: SendGridEmail) {
    const personalize = new helper.Personalization();
    personalize.addTo(recipient);
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sendGrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.mail.toJSON(),
    });

    const response = await this.sendGrid.API(request);
    return response;
  }
}

// const sendgrid = require('sendgrid');
// const helper = sendgrid.mail;

// // export class SendGridMail extends helper.Mail {}
// export class SendGridEmail extends helper.Email {}
// // export class SendGridContent extends helper.Content {}

// export class JoinCreatedMailer extends helper.Mail {
//   private sendGrid: any;

//   constructor(metadata: { subject: string; receiver: string }, body: string) {
//     const from = new helper.Email('gokcedilek99@gmail.com', "skfnksn");
//     const subject = metadata.subject;
//     const recipient = new helper.Email(metadata.receiver);
//     const content = new helper.Content('text/html', body);
//     super(from, subject, recipient, content);

//     this.sendGrid = sendgrid(process.env.SENDGRID_KEY);

//     //do i need this.addContent(content)? i might not because i called super()!
//     this.addClickTracking();
//     this.addRecipient(recipient);
//   }

//   addClickTracking() {
//     const trackingSettings = new helper.TrackingSettings();
//     const clickTracking = new helper.ClickTracking(true, true); //might need openTracking instead since i may not have links in my emails

//     trackingSettings.setClickTracking(clickTracking);
//     this.addTrackingSettings(trackingSettings);
//   }

//   addRecipient(recipient: SendGridEmail) {
//     const personalize = new helper.Personalization();
//     personalize.addTo(recipient);
//     this.addPersonalization(personalize);
//   }
// }
