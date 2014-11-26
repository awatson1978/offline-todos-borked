// In your server code: define a method that the client can call
// TODO: need to get phone #, change port to 587, 
// and get the different carriers.
// TODO: dynamically update MAIL_URL
// 
//
// Note: sendText looks very similar to sendEmail because this is a boilerplate
// for sending text.
//
Meteor.methods({
  sendText: function(to, from, subject, message) {
    check([to, from, subject, message], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

      // TODO: Find the appropriate phone carrier
      // Verizon, At&T, T-Mobile, Sprint
    var toAtPhoneCarrier = to + "@vtext.com";

    Email.send({
      to: toAtPhoneCarrier,
      from: from,
      subject: subject,
      text: message
    });
    //EmailLogs.insert({time: new Date(), userId: Meteor.userId()});
  }
});
