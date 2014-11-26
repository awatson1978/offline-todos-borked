Meteor.startup(function() {
  // code to run on server at startup
  // MVP features: 1. send/respond emails/text 2. google-contacts 3. edit groups/contacts. 4. Drag/drop Order contacts on queue

  // TODO: this isn't secure and needs to be changed.
  // The password is not stored in db.  How to set this securely?
  // This environment variable should be setup in login
  // Will Jugglenut send email on behalf of user and set the "from"?
  // Make sure to remove real password when pushing onto github
  process.env.MAIL_URL = 'smtp://email@gmail.com:password@smtp.gmail.com:465';

  // Loading test data temporarily
  if (Groups.find().count() === 0) {
    var testGroups = [{
      title: "Babysitters",
      groupId: 123,
      createdBy: "",
      groupSource: "google"
    }, {
      title: "Emergency Contacts",
      groupId: 911,
      createdBy: "",
      groupSource: "twitter"
    }];
    for (var i = 0; i < testGroups.length; i++)
      Groups.insert(testGroups[i]);
  }

  if (Contacts.find().count() === 0) {
    var testContacts = [{
      firstName: "Kitty",
      lastName: "Cat",
      email: {
        primary: "christietest13@gmail.com",
        secondary: ""
      },
      phone: {
        primary: "19177633746",
        secondary: ""
      },
      groupId: [123],
      preferences: {
        primary: "email",
        secondary: "text",
        tertiary: "voice"
      },
      createdBy: this._id
    }];

    for (var i = 0; i < testContacts.length; i++) {
      Contacts.insert(testContacts[i]);
    }
  };

  if (UserSettings.find().count() === 0) {
    // preferences.
    var testUserSettings = [{
      groupId: [123],
      preferences: {
        primary: "email",
        secondary: "text",
        tertiary: "voice"
      },
      createdBy: this._id,
      groupSource: "google"
    }];

    for (var i = 0; i < testUserSettings.length; i++)
      UserSettings.insert(testUserSettings[i]);
  }
  if (Messages.find().count() === 0) {
    var testMessage = [{
      groupId: [123],
      reqMessage: "Hello, may I make a request?",
      resMessage: "My response is the following ...",
      createdBy: this._id
    }];

    for (var i = 0; i < testMessage.length; i++)
      Messages.insert(testMessage[i]);
  }
  if (UserLogs.find().count() === 0) {
    var testUserLogs = [{
      createdBy: this._id,
      activityTime: new Date()
    }];

    for (var i = 0; i < testUserLogs.length; i++)
      UserLogs.insert(testUserLogs[i]);
  }

    // Avoid duplicates.  TODO: Need one more unique field for contacts
    // Make sure that the indexes are dropped before recreating index with different options otherwise they
    // won't get rebuilt
    Groups._ensureIndex( { groupId: 1, createdBy: 1 }, { unique: true, dropDups: true } );
    Contacts._ensureIndex( { ownerId: 1,  title: 1, email: 1, phone: 1}, { unique: true, dropDups: true } );
    Messages._ensureIndex( { groupId: 1,  createdBy: 1}, { unique: true, dropDups: true } );

});

