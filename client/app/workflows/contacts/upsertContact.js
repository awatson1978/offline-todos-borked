//==============================================================================
// TEMPLATE OUTPUTS

Template.upsertContactPage.helpers({
  contact: function() {
    if (Session.get('selectedContactId')) {
      return Contacts.findOne(Session.get('selectedContactId'));
    } else {
      return {};
    }
  },
  getUpsertContactTitle: function() {
    if (Session.get('selectedContactId')) {
      return "Edit Contact " + Session.get('selectedContactId');
    } else {
      return "New Contact";
    }
  }
});


//==============================================================================
// TEMPLATE INPUTS
//
// selectedGroupId is the group assigned to a new contact that is being created.
// When creating a new contact, the form text should be a search drop down then if
// no contact exists then create a new contact.
//
// Template.upsertContactPage.events({
//   "click #upsertContactButton": function(event, template) {
//
//     event.preventDefault();
//     // grab values from our form and put them into a record
//     var newContact = {
//       name: $('#contactNameInput').val(),
//       email: {
//         primary: $('#contactEmailInput').val(),
//       },
//       groupId: [],
//       active: true,
//       createdAt: new Date()
//     }
//
//     newContact.groupId[0] = Session.get('selectedGroupId');
//     // TODO: validate record
//
//     // put record into collection
//     Contacts.insert(newContact);
//
//     // TODO: need to add contactPhoneInput
//     // clear our form
//     $('#contactNameInput').val("");
//     $('#contactEmailInput').val("");
//   },
//   "click #deleteContactButton": function() {
//     Contacts.remove({
//       _id: Session.get('selectedContactId')
//     });
//   }
// });
