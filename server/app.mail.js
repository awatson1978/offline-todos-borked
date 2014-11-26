// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function(to, from, subject, message) {
    check([to, from, subject, message], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: message
    });
    //EmailLogs.insert({time: new Date(), userId: Meteor.userId()});
  }
});
