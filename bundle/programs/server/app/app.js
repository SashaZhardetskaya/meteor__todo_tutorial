var require = meteorInstall({"imports":{"api":{"tasks.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// imports/api/tasks.js                                                                              //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
module.export({
    Tasks: () => Tasks
});
let Meteor;
module.watch(require("meteor/meteor"), {
    Meteor(v) {
        Meteor = v;
    }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
    Mongo(v) {
        Mongo = v;
    }

}, 1);
let check;
module.watch(require("meteor/check"), {
    check(v) {
        check = v;
    }

}, 2);
const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('tasks', function tasksPublication() {
        // return Tasks.find();
        return Tasks.find({
            $or: [{
                private: {
                    $ne: true
                }
            }, {
                owner: this.userId
            }]
        });
    });
}

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String); // Make sure the user is logged in before inserting a task

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username
        });
    },

    'tasks.remove'(taskId) {
        check(taskId, String);
        const task = Tasks.findOne(taskId);

        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);
    },

    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);
        const task = Tasks.findOne(taskId);

        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, {
            $set: {
                checked: setChecked
            }
        });
    },

    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
        const task = Tasks.findOne(taskId); // Make sure only the task owner can make a task private

        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, {
            $set: {
                private: setToPrivate
            }
        });
    }

});
///////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// server/main.js                                                                                    //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
module.watch(require("../imports/api/tasks.js"));
///////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdGFza3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIlRhc2tzIiwiTWV0ZW9yIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsIk1vbmdvIiwiY2hlY2siLCJDb2xsZWN0aW9uIiwiaXNTZXJ2ZXIiLCJwdWJsaXNoIiwidGFza3NQdWJsaWNhdGlvbiIsImZpbmQiLCIkb3IiLCJwcml2YXRlIiwiJG5lIiwib3duZXIiLCJ1c2VySWQiLCJtZXRob2RzIiwidGV4dCIsIlN0cmluZyIsIkVycm9yIiwiaW5zZXJ0IiwiY3JlYXRlZEF0IiwiRGF0ZSIsInVzZXJuYW1lIiwidXNlcnMiLCJmaW5kT25lIiwidGFza0lkIiwidGFzayIsInJlbW92ZSIsInNldENoZWNrZWQiLCJCb29sZWFuIiwidXBkYXRlIiwiJHNldCIsImNoZWNrZWQiLCJzZXRUb1ByaXZhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE9BQU9DLE1BQVAsQ0FBYztBQUFDQyxXQUFNLE1BQUlBO0FBQVgsQ0FBZDtBQUFpQyxJQUFJQyxNQUFKO0FBQVdILE9BQU9JLEtBQVAsQ0FBYUMsUUFBUSxlQUFSLENBQWIsRUFBc0M7QUFBQ0YsV0FBT0csQ0FBUCxFQUFTO0FBQUNILGlCQUFPRyxDQUFQO0FBQVM7O0FBQXBCLENBQXRDLEVBQTRELENBQTVEO0FBQStELElBQUlDLEtBQUo7QUFBVVAsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDRSxVQUFNRCxDQUFOLEVBQVE7QUFBQ0MsZ0JBQU1ELENBQU47QUFBUTs7QUFBbEIsQ0FBckMsRUFBeUQsQ0FBekQ7QUFBNEQsSUFBSUUsS0FBSjtBQUFVUixPQUFPSSxLQUFQLENBQWFDLFFBQVEsY0FBUixDQUFiLEVBQXFDO0FBQUNHLFVBQU1GLENBQU4sRUFBUTtBQUFDRSxnQkFBTUYsQ0FBTjtBQUFROztBQUFsQixDQUFyQyxFQUF5RCxDQUF6RDtBQUtwTCxNQUFNSixRQUFRLElBQUlLLE1BQU1FLFVBQVYsQ0FBcUIsT0FBckIsQ0FBZDs7QUFFUCxJQUFJTixPQUFPTyxRQUFYLEVBQXFCO0FBQ2pCO0FBQ0E7QUFFQVAsV0FBT1EsT0FBUCxDQUFlLE9BQWYsRUFBd0IsU0FBU0MsZ0JBQVQsR0FBNEI7QUFDaEQ7QUFDQSxlQUFPVixNQUFNVyxJQUFOLENBQVc7QUFDZEMsaUJBQUssQ0FDRDtBQUFFQyx5QkFBUztBQUFFQyx5QkFBSztBQUFQO0FBQVgsYUFEQyxFQUVEO0FBQUVDLHVCQUFPLEtBQUtDO0FBQWQsYUFGQztBQURTLFNBQVgsQ0FBUDtBQU1ILEtBUkQ7QUFTSDs7QUFFRGYsT0FBT2dCLE9BQVAsQ0FBZTtBQUNYLG1CQUFlQyxJQUFmLEVBQXFCO0FBQ2pCWixjQUFNWSxJQUFOLEVBQVlDLE1BQVosRUFEaUIsQ0FHakI7O0FBQ0EsWUFBSSxDQUFFLEtBQUtILE1BQVgsRUFBbUI7QUFDZixrQkFBTSxJQUFJZixPQUFPbUIsS0FBWCxDQUFpQixnQkFBakIsQ0FBTjtBQUNIOztBQUVEcEIsY0FBTXFCLE1BQU4sQ0FBYTtBQUNUSCxnQkFEUztBQUVUSSx1QkFBVyxJQUFJQyxJQUFKLEVBRkY7QUFHVFIsbUJBQU8sS0FBS0MsTUFISDtBQUlUUSxzQkFBVXZCLE9BQU93QixLQUFQLENBQWFDLE9BQWIsQ0FBcUIsS0FBS1YsTUFBMUIsRUFBa0NRO0FBSm5DLFNBQWI7QUFNSCxLQWZVOztBQWdCWCxtQkFBZUcsTUFBZixFQUF1QjtBQUNuQnJCLGNBQU1xQixNQUFOLEVBQWNSLE1BQWQ7QUFDQSxjQUFNUyxPQUFPNUIsTUFBTTBCLE9BQU4sQ0FBY0MsTUFBZCxDQUFiOztBQUNBLFlBQUlDLEtBQUtmLE9BQUwsSUFBZ0JlLEtBQUtiLEtBQUwsS0FBZSxLQUFLQyxNQUF4QyxFQUFnRDtBQUM1QztBQUNBLGtCQUFNLElBQUlmLE9BQU9tQixLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FBQ0g7O0FBQ0RwQixjQUFNNkIsTUFBTixDQUFhRixNQUFiO0FBQ0gsS0F4QlU7O0FBMkJYLHVCQUFtQkEsTUFBbkIsRUFBMkJHLFVBQTNCLEVBQXVDO0FBQ25DeEIsY0FBTXFCLE1BQU4sRUFBY1IsTUFBZDtBQUNBYixjQUFNd0IsVUFBTixFQUFrQkMsT0FBbEI7QUFDQSxjQUFNSCxPQUFPNUIsTUFBTTBCLE9BQU4sQ0FBY0MsTUFBZCxDQUFiOztBQUNBLFlBQUlDLEtBQUtmLE9BQUwsSUFBZ0JlLEtBQUtiLEtBQUwsS0FBZSxLQUFLQyxNQUF4QyxFQUFnRDtBQUM1QztBQUNBLGtCQUFNLElBQUlmLE9BQU9tQixLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FBQ0g7O0FBQ0RwQixjQUFNZ0MsTUFBTixDQUFhTCxNQUFiLEVBQXFCO0FBQUVNLGtCQUFNO0FBQUVDLHlCQUFTSjtBQUFYO0FBQVIsU0FBckI7QUFDSCxLQXBDVTs7QUFxQ1gsdUJBQW1CSCxNQUFuQixFQUEyQlEsWUFBM0IsRUFBeUM7QUFDckM3QixjQUFNcUIsTUFBTixFQUFjUixNQUFkO0FBQ0FiLGNBQU02QixZQUFOLEVBQW9CSixPQUFwQjtBQUVBLGNBQU1ILE9BQU81QixNQUFNMEIsT0FBTixDQUFjQyxNQUFkLENBQWIsQ0FKcUMsQ0FNckM7O0FBQ0EsWUFBSUMsS0FBS2IsS0FBTCxLQUFlLEtBQUtDLE1BQXhCLEVBQWdDO0FBQzVCLGtCQUFNLElBQUlmLE9BQU9tQixLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FBQ0g7O0FBRURwQixjQUFNZ0MsTUFBTixDQUFhTCxNQUFiLEVBQXFCO0FBQUVNLGtCQUFNO0FBQUVwQix5QkFBU3NCO0FBQVg7QUFBUixTQUFyQjtBQUNIOztBQWpEVSxDQUFmLEU7Ozs7Ozs7Ozs7O0FDdEJBckMsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLHlCQUFSLENBQWIsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cblxuZXhwb3J0IGNvbnN0IFRhc2tzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3Rhc2tzJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAvLyBUaGlzIGNvZGUgb25seSBydW5zIG9uIHRoZSBzZXJ2ZXJcbiAgICAvLyBPbmx5IHB1Ymxpc2ggdGFza3MgdGhhdCBhcmUgcHVibGljIG9yIGJlbG9uZyB0byB0aGUgY3VycmVudCB1c2VyXG5cbiAgICBNZXRlb3IucHVibGlzaCgndGFza3MnLCBmdW5jdGlvbiB0YXNrc1B1YmxpY2F0aW9uKCkge1xuICAgICAgICAvLyByZXR1cm4gVGFza3MuZmluZCgpO1xuICAgICAgICByZXR1cm4gVGFza3MuZmluZCh7XG4gICAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgICAgICB7IHByaXZhdGU6IHsgJG5lOiB0cnVlIH0gfSxcbiAgICAgICAgICAgICAgICB7IG93bmVyOiB0aGlzLnVzZXJJZCB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgICAndGFza3MuaW5zZXJ0Jyh0ZXh0KSB7XG4gICAgICAgIGNoZWNrKHRleHQsIFN0cmluZyk7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBiZWZvcmUgaW5zZXJ0aW5nIGEgdGFza1xuICAgICAgICBpZiAoISB0aGlzLnVzZXJJZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFRhc2tzLmluc2VydCh7XG4gICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgb3duZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgdXNlcm5hbWU6IE1ldGVvci51c2Vycy5maW5kT25lKHRoaXMudXNlcklkKS51c2VybmFtZSxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICAndGFza3MucmVtb3ZlJyh0YXNrSWQpIHtcbiAgICAgICAgY2hlY2sodGFza0lkLCBTdHJpbmcpO1xuICAgICAgICBjb25zdCB0YXNrID0gVGFza3MuZmluZE9uZSh0YXNrSWQpO1xuICAgICAgICBpZiAodGFzay5wcml2YXRlICYmIHRhc2sub3duZXIgIT09IHRoaXMudXNlcklkKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgdGFzayBpcyBwcml2YXRlLCBtYWtlIHN1cmUgb25seSB0aGUgb3duZXIgY2FuIGRlbGV0ZSBpdFxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBUYXNrcy5yZW1vdmUodGFza0lkKTtcbiAgICB9LFxuXG5cbiAgICAndGFza3Muc2V0Q2hlY2tlZCcodGFza0lkLCBzZXRDaGVja2VkKSB7XG4gICAgICAgIGNoZWNrKHRhc2tJZCwgU3RyaW5nKTtcbiAgICAgICAgY2hlY2soc2V0Q2hlY2tlZCwgQm9vbGVhbik7XG4gICAgICAgIGNvbnN0IHRhc2sgPSBUYXNrcy5maW5kT25lKHRhc2tJZCk7XG4gICAgICAgIGlmICh0YXNrLnByaXZhdGUgJiYgdGFzay5vd25lciAhPT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSB0YXNrIGlzIHByaXZhdGUsIG1ha2Ugc3VyZSBvbmx5IHRoZSBvd25lciBjYW4gY2hlY2sgaXQgb2ZmXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgICAgICB9XG4gICAgICAgIFRhc2tzLnVwZGF0ZSh0YXNrSWQsIHsgJHNldDogeyBjaGVja2VkOiBzZXRDaGVja2VkIH0gfSk7XG4gICAgfSxcbiAgICAndGFza3Muc2V0UHJpdmF0ZScodGFza0lkLCBzZXRUb1ByaXZhdGUpIHtcbiAgICAgICAgY2hlY2sodGFza0lkLCBTdHJpbmcpO1xuICAgICAgICBjaGVjayhzZXRUb1ByaXZhdGUsIEJvb2xlYW4pO1xuXG4gICAgICAgIGNvbnN0IHRhc2sgPSBUYXNrcy5maW5kT25lKHRhc2tJZCk7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIG9ubHkgdGhlIHRhc2sgb3duZXIgY2FuIG1ha2UgYSB0YXNrIHByaXZhdGVcbiAgICAgICAgaWYgKHRhc2sub3duZXIgIT09IHRoaXMudXNlcklkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgVGFza3MudXBkYXRlKHRhc2tJZCwgeyAkc2V0OiB7IHByaXZhdGU6IHNldFRvUHJpdmF0ZSB9IH0pO1xuICAgIH0sXG59KTsiLCJpbXBvcnQgJy4uL2ltcG9ydHMvYXBpL3Rhc2tzLmpzJztcbiJdfQ==
