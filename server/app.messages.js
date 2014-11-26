// In your server code: define a method that the client can call
//
// If contact's preference is email then sendEmail otherwise send text
//
//
// SendMessages call sendText, sendEmail, sendVoice
Meteor.methods({
  saveMessage: function(groupId, subject, message) {
    check(groupId, String);
    check([subject, message], [String]);
    this.unblock();

    var user = Meteor.user();

    //TODO: handle response
    var defaultResponse = "Thanks for your reply!"

    // unique index on 'groupId' and 'createdBy'
    Messages.update({
      'groupId': groupId,
      'createdBy': user._id
    }, {
      'groupId': groupId,
      'createdBy': user._id,
      'subject': subject,
      'message': message,
      'autoResponse': defaultResponse
    }, {
      'upsert': true
    });
  },

  // TODO: Get subject/message from database to display when group is selected

  sendMessages: function(groupId, subject, message) {
    check(groupId, String);
    check([subject, message], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();


    Meteor.call('saveMessage', groupId, subject, message);

    // console.log(Meteor.user()); // to peek the user document
    var user = Meteor.user();

    // TODO: should be from any email
    var from = user && user.services.google.email;

    // TODO get priority queue of contacts based on groupId
    // See javascript example of priority queue on http://jsfiddle.net/GRIFFnDOOR/r7tvg/
    var toList = Contacts.find({
      'groupId': groupId
    }, {
      field: {
        'email': 1,
        '_id': 0
      }
    }); // TODO: sort by priority

    console.log("toList: ", toList);

    var interval = 900000; // 15 minutes intervals
    toList.forEach(function(to) {
      if (to.preferences.primary == "email") {
        console.log("Sending email to: ", to.email.primary);
        Meteor.call('sendEmail', to.email.primary, from, subject, message);
      } else {
        console.log("Sending text to: ", to.phone.primary);
        Meteor.call('sendText', to.phone.primary, from, subject, message);
      }

    });
    // sendText(to, from, subject, message);

    // loop through every contact in groupId
    // TODO: see implementation of displayContacts
    // check their preferences of contact method email or text or voice
    // wait 20 minutes between send
  }
});
