// TODO: reconcile the groupId name and handle array.
// contacts gContact$groupMembershipInfo == groups id.$t
//
// TODO: add phone numbers
// and option to select primary form of contact.
//
//googleContacts is *shared* between all our server side methods
// this meteor methods is server side only!
// See: https://github.com/percolatestudio/meteor-google-api/tree/master
//
// https://developers.google.com/google-apps/contacts/v3/
//
// http://callbackhell.com/
//
// Bug: the refresh token doesn't work right when restarting the server and user
// is still logged on.  The bug could be in percolate:google-api
// TODO: need methods for getGroups when clicking on dropdown

// TODO: Figure out how to use callbacks in a call to Meteor.methods()
Meteor.methods({
  'getGoogleApi': function(type) {
    console.log('***********************************************************');
    console.log('***********************************************************');
    console.log('getGoogleApi', type);

    check(type, String);

    var meteormethodresult = null;

    var clientId = ServiceConfiguration.configurations.findOne({
      service: 'google'
    }, {
      fields: {
        clientId: 1,
        _id: 0
      }
    });
    if (!clientId) throw new ServiceConfiguration.ConfigError();

    var secret = ServiceConfiguration.configurations.findOne({
      service: 'google'
    }, {
      fields: {
        secret: 1,
        _id: 0
      }
    });
    if (!secret) throw new ServiceConfiguration.ConfigError();

    // don't need email or refreshToken?  These values are undefined as options passed but seems to work.
    options = {
      email: Meteor.user().services.google.email,
      consumerKey: clientId.clientId,
      consumerSecret: secret.secret,
      token: Meteor.user().services.google.accessToken,
      refreshToken: Meteor.user().services.google.refreshToken
    };

    console.log('google options', options);

    var path = '/m8/feeds/';
    path += type;
    path += '/default/full?alt=json';
    GoogleApi.get(path, options, function(err, results) {
      if (err) {
        console.log('Error: ', err);
        // TODO: retry getting the refreshtoken
        return err;
      }
      if (results) {
        console.log('***********************************************************');
        console.log('GoogleApi.get success for path: ', path);
        //console.log("in json", JSON.stringify(results));

        if (type === 'groups') {
          Meteor.call('loadGroupsDB', results);
        } else
        if (type === 'contacts') {
          Meteor.call('loadContactsDB', results);
        }
        meteormethodresult = results;
      }
    });
    return meteormethodresult;

  },
  'loadGroupsDB': function(results) {

    console.log('============================================================');
    console.log("loadGroupsDB", JSON.stringify(results));

    // {"_id": "sample123", "createdAt": ISODate(), "createdBy": :user_id", "services": {"google": {"url":, "kind":"groups"}},
    // 	"title.$t",
    //		"link",
    //		"id.$t"}
    // groups["services"] = {};
    // In process of avoiding duplicates
    // docs.mongodb.org/manual/tutorial/create-a-unique-index/
    // On the server:
    // db.groups.ensureIndex( { ownerId: 1 , groupId: 1}, { unique: true, dropDups:true} )

    results.feed.entry.forEach(function(result) {
      console.log('-------------------------------------------------------------');

      var newGroup = {
        ownerId: this.userId,
        createdAt: new Date(),
        title: result.title.$t,
        link: result.link,
        groupId: result.id.$t
          //service:
      }
      console.log('title: ', result.title.$t);
      console.log('link: ', result.link);
      console.log('groupId: ', result.id.$t);

      // findAndModify isn't currently supported in the meteor 1.0 packages/mongo/collection.js
      //Groups.findAndModify({
      //    query: {title: newGroup.title, link: newGroup.link, groupId: newGroup.groupId},
      //    update: {ownerId: newGroup.ownerId, createdAt: newGroup.createdAt},
      //    upsert: true,
      //    new: true // if none exists then create new
      //});

      // Avoiding Duplicates using unique indexes. Note: findAndModify is not well supported on Meteor
      Groups.insert(newGroup);
    });

    // TODO: handle cases where there is no entry
    //groups[services].google;

  },
  'loadContactsDB': function(results) {
    console.log('============================================================');
    console.log("loadContactsDB", JSON.stringify(results));

    // TODO: In process of avoiding duplicates
    // docs.mongodb.org/manual/tutorial/create-a-unique-index/
    // On the server:
    // db.groups.ensureIndex( { ownerId: 1 , groupId: 1}, { unique: true, dropDups:true} )

    var contacts = {};

    results.feed.entry.forEach(function(result) {
      console.log('-------------------------------------------------------------');

      var newContact = {
        ownerId: this.userId,
        createdAt: new Date(),
        email: {
          primary: "",
          secondary: ""
        },
        website: [{
          href: "",
          rel: ""
        }],
        phone: {
          primary: "",
          secondary: ""
        },
        groupId: [], //groupMembershipInfo
        preferences: {
          primary: "email",
          secondary: "text",
          tertiary: "voice"
        }
      }

      if (result.title.$t) {
        console.log('title: ', result.title.$t);
        newContact.name = result.title.$t;
      }

      // Please note: the current result set does not contain the gd$name fields
      // although they exist in other result sets.  I am leaving them the code below for future use.
      if (result.gd$name) {
        if (result.gd$name.gd$givenName.$t) {
          newContact.firstName = result.gd$name.gd$givenName.$t;
          console.log('firstName: ', newContact.firstName);
        }
        if (result.gd$name.gd$familyName.$t) {
          newContact.lastName = result.gd$name.gd$familyName.$t;
          console.log('lastName: ', newContact.lastName);
        }
      }

      // TODO: get all the emails not just the first
      if (result.gd$email && result.gd$email[0]) {
        console.log('email: ', result.gd$email[0].address);
        newContact.email.primary = result.gd$email[0].address;
      }

      // TODO: get all websites?
      if (result.gContact$website && result.gContact$website[0]) {
        console.log('website: ', result.gContact$website);
        newContact.website = result.gContact$website;
      }


      // TODO: url parse for primary = mobile, secondary = home, tertiary = work phone numbers
      // Starting with just the first number
      if (result.gd$phoneNumber && result.gd$phoneNumber[0]) {
        console.log('phone: ', result.gd$phoneNumber[0].$t);
        newContact.phone.primary = result.gd$phoneNumber[0].$t;
      }

      if (result.gContact$groupMembershipInfo) {
        console.log('gContact$groupMembershipInfo: ', result.gContact$groupMembershipInfo);
        var index = 0;
        result.gContact$groupMembershipInfo.forEach(function(groupMembershipInfo) {
          if (groupMembershipInfo.deleted === "false") {
            newContact.groupId[index++] = groupMembershipInfo.href;
          }
        });
      }
      // TODO: need to include profile URL because it is unique

      // Avoiding Duplicates using unique indexes. Note: findAndModify is not well supported on Meteor
      // Handle errors in a callback.  If duplicate key error then do an update.  Try to do upsert.
      Contacts.insert(newContact);
    });

  },
  'importGoogleContacts': function() {
    // TODO: Load database with groups and contacts.
    Meteor.call('getGoogleApi', 'groups');

    Meteor.call('getGoogleApi', 'contacts');

  }
});
