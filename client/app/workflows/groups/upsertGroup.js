Session.setDefault('isModal', false);

//==============================================================================
// TEMPLATE OUTPUTS

Template.upsertGroup.helpers({
  contacts: function () {
    if(Session.get('selectedGroupId')){
      var group = Groups.findOne(Session.get('selectedGroupId'));
      if(group.contacts){
        return group.contacts;
      }else{
        return [];
      }
    }else{
      return [];
    }
  },
  group: function () {
    if(Session.get('selectedGroupId')){
      return Groups.findOne(Session.get('selectedGroupId'));
    }else{
      return {};
    }
  },
  getUpsertGroupTitle: function(){
    if(Session.get('selectedGroupId')){
      return "Edit Group " + Session.get('selectedGroupId');
    }else{
      return "New Group";
    }
  }
});

//==============================================================================
// TEMPLATE INPUTS
// TODO: remove description or change it
// TODO: change _id from contacts to groupId?
Template.upsertGroup.events({
  'click .danger': function () {
    //alert('delete! ' + this.name + " " + this._id);
    // Groups.update({_id: Session.get('selectedGroupId')},{$pull:{
      Groups.update({groupId: Session.get('selectedGroupId')},{$pull:{
      contacts: {_id: this._id, name: this.name}
    }});
  },
  'click .list-group-item': function (event, template) {
    $('#' + this._id).toggleClass('open');
  },
  'click #addContactToGroupButton': function () {
    Session.toggle('isModal');
  },
  "click #upsertGroupButton": function(event, template){
    var upsertGroup = {
      title: $('#groupTitleInput').val(),
      description: $('#groupDescriptionInput').val(),
      createdAt: new Date(),
      active: true
    }
    Groups.insert(upsertGroup);
  },
  "click #deleteGroupButton":function(){
    // Groups.remove({_id: Session.get('selectedGroupId')});
       Groups.remove({groupId: Session.get('selectedGroupId')});
  }
});
