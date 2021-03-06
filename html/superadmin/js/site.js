Parse.initialize("nN7dcS3c3LNXlkOgMhmVxcu2L4b1zeUDuaSXIfzr", "thCEUZ2AV4ShhzGlQpxYucpLI0uwj7JNBizIrThe");

/*var roleACL = new Parse.ACL();
roleACL.setPublicReadAccess(true);
var role = new Parse.Role("Administrator", roleACL);
role.save();
  
var Role = Parse.Object.extend("_Role"); 
var query = new Parse.Query(Role); 
query.equalTo("objectId", "3E47PmEjy4"); 
query.first({ success: function(role) {
    var queryU = new Parse.Query(Parse.User);

    queryU.equalTo("email", "nits.bikash@gmail.com");  // find all the users
    queryU.first({
        success: function(usersToAddToRole) {

              role.getUsers().add(usersToAddToRole);

               role.save();
           }
      });
  }
  });

Parse.User.logIn("bikash", "123456", {
  success: function(user) {
    console.log(user.get("email"));
  },
  error: function(user, error) {
    console.log("you shall not pass!");
  }
});*/


 
/*
 *  Get all universities
 */
function get_universities()
{
    var University = Parse.Object.extend("university");
    //var User = Parse.Object.extend("user");
   // var innerQuery = new Parse.Query(User);
    //innerQuery.exists("users");
    var q = new Parse.Query(University);
    //q.matchesQuery("objectId", innerQuery);
    //q.equalTo("objectId", u_id);
    var c=1;
    q.notEqualTo("is_deleted", true);
    q.equalTo("isActive", 1);
    q.include('users');
    q.find({
      success: function(results){
         for(i in results){
            var university = results[i];
            var user = results[i].get('users');
            if(user)
            {
                var row='<tr>';
                row += '<td>' + (c++) + '</td>';
                row += '<td>' + user.get('firstname') + '</td>';
                row += '<td>' + user.get('lastname') + '</td>';
                row += '<td>'+university.get('name')+'</td>';
                row += '<td>' + user.get('email') + '</td>';
                row += '<td>';
                //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
                //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
                row +=      '<a class="btn btn-primary" href="editUniversity?uid='+ university.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
                row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="deleteUniversity(\''+university.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                row += '</td>';
                row += '</tr>';
                $('table.universities tbody').append(row);
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          $('#datatable_tabletools').dataTable();
      }
    });
}


/*
 *  Get University Details By Id(Superadmin -> Edit University)
 */
function get_universityById(u_id)
{
    var University = Parse.Object.extend("university");
    var q = new Parse.Query(University);
    q.equalTo("objectId", u_id);
    q.include('users');
    q.first({
         success: function(results){
             var university = results;
             var user = results.get('users');
             $('#university').val(university.get('name'));
             $('#totalGym').val(university.get('totalGym'));
             $('#firstname').val(user.get('firstname'));
             $('#lastname').val(user.get('lastname'));
             $('#user_id').val(user.id);
         }
    });
}

function deleteUniversity(univ_id)
{
    if(confirm('Are you sure, you want to delete?'))
    {
        var University = Parse.Object("university");
        University.id = univ_id;
        University.set('is_deleted',true); 
        if(University.save())
        {
            window.location.reload();
        }
    }
}

/*
 *  Update University (Superadmin -> Update University)
 */

function updateUniversity(data)
{
    var values = {};

    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var user_id=getValue('user_id');
    var univ_id = getValue("univ_id");
    var name = getValue("university");
    var firstname = getValue("firstname");
    var lastname = getValue("lastname");
    var totalGym = getValue("totalGym");
    
    var University = Parse.Object("university");
    University.id = univ_id;
    University.set('name',name);  
    University.set('totalGym',parseInt(totalGym));  
    
    
    var user = Parse.Object("user");
    user.id=user_id;
    user.set('firstname',firstname);
    user.set('lastname',lastname);
    
    if(University.save())
    {
        
        window.location.href='universities';
         //user.save();  
    }
    
    /*var q = new Parse.Query(University);
    q.equalTo("objectId", univ_id);
    q.include('users');
    q.first({
         success: function(results){
             results.set('name',name);
             results.save();   
             
                     
         }
    });*/
}
    
/*
 *  Add New room
 */
function add_room(data)
{
    var values = {};
    
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var gymId = getValue("gym");
    var roomname = getValue("roomname");
    var totalOccupancy = parseInt(getValue("totalOccupancy"));
    //var allowOccupancy = getValue("allowOccupancy");
    if(getValue("allowOccupancy")=='true')
    {
    		var allowOccupancy = true;
    }
    else
    {
    		var allowOccupancy = false;
    }
    //alert(allowOccupancy);
    
    //var gymId = 'eexv0lmEQO'; //---------------- Comment this and set this dynamic
    
    var UG = Parse.Object.extend("university_gym");
    var q = new Parse.Query(UG);
    q.equalTo("objectId", gymId);
    q.include("university");
    q.first({
      success: function(results){
      	var university = results.get("university");
      	console.log(university);
      	var universityId = university.id;
      	
            var Room = Parse.Object.extend("room");
            var r1 = new Room({"name":roomname,"male":parseInt(0),"female":parseInt(0),"reservedOccupancy":parseInt(0),"allowOccupancy":allowOccupancy,"totalOccupancy":totalOccupancy,"gymId":results,"universityId":universityId,"university":university,"universityGymId":results.id});
            r1.save(null,{
                success:function(){
                     showSuccess('Room added successfully.');
                     window.location.href='viewRooms';
                },
                error:function(r1,error){
                       showError(error.message);
                }
            })
        }
    });
    
}

/*
 *  Fetch rooms for listing
 */
function get_rooms()
{
    //var universityId = currentUser.get('universityId');
    var Room = Parse.Object.extend("room");
    var q = new Parse.Query(Room);
    var c=1;
    //q.equalTo("universityId", universityId);
    q.include('gymId');
    q.include('university');
    q.find({
      success: function(results){
         for(i in results){
            var gym = results[i].get("gymId");
            var room = results[i];
            var university = results[i].get('university');
            //var user = results[i].get('users');
            if(room)
            {
                var row='<tr>';
                row += '<td>' + (c++) + '</td>';
                row += '<td>'+room.get('name')+'</td>';
                row += '<td>'+university.get('name')+'</td>';
                row += '<td>'+gym.get('name')+'</td>';
                row += '<td>';
			row +=      '<span class="onoffswitch">';
			row +=          '<input id="st'+c+'" class="onoffswitch-checkbox" type="checkbox" onclick="change_roomAllowOccupancy(\''+ room.id +'\')"';
			row +=          room.get('allowOccupancy')?'checked="checked"':'';
			row +=          'name="start_interval">';
			row +=          '<label class="onoffswitch-label" for="st'+(c)+'">';
			row +=              '<span class="onoffswitch-inner" data-swchoff-text="No" data-swchon-text="Yes"></span>'
			row +=              '<span class="onoffswitch-switch"></span>';
			row +=          '</label>';
			row +=      '</span>';
			row += '</td>';
                row += '<td>';
                //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
                //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
                row +=      '<a class="btn btn-primary" href="editRoom?rid='+ room.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
                row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_room(\''+room.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                row += '</td>';
                row += '</tr>';
                $('table.rooms tbody').append(row);
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          $('#datatable_tabletools').dataTable();
      }
    });
}



function change_roomAllowOccupancy(eq_id)
{
    var GE = Parse.Object.extend("room");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", eq_id);
    q.first({
            success: function(results){
                console.log(results);
                    var r1 = Parse.Object("room");
                    r1.id=results.id;
                    if(results.get('allowOccupancy'))
                    {
                        r1.set("allowOccupancy",false);
                    }
                    else
                    {
                        r1.set("allowOccupancy",true);
                    }
                    r1.save(null,{
                        success:function(){
                             showSuccess('Allow Occupancy saved successfully.');
                             //window.location.href='viewEquipments';
                        },
                        error:function(r1,error){
                               showError('Allow Occupancy details could not be saved. Please try again later.');
                        }                            
                    });
                
        },
        error:function(r1,error){
                showError(error.message);
         } 
    })
    
}
/*
 *  Get room Details By Id
 */
function roomDetails(roomId)
{
    var Room = Parse.Object.extend("room");
    var q = new Parse.Query(Room);
    q.equalTo("objectId", roomId);
    //q.include('users');
    q.first({
         success: function(results){
              var gId = results.get('universityGymId');
              
              var Gym = Parse.Object.extend("university_gym");
		    var q = new Parse.Query(Gym);  
		     
		    q.equalTo('universityId',results.get('universityId'));
		    q.equalTo('isActive',1);
		    q.equalTo('isDelete',0);
		    q.find({
			   success: function(results){
				  $("#gym").empty();
				  $("#gym").append(new Option("Select Gym", ""));
				  var len = results.length;
				  for(i in results){
				      var university = results[i];
				      //option = '<option value="'++'">'++'</option>';
				      $("#gym").append(new Option(university.get('name'), university.id));
				     // console.log(university.get('name'));
				     
				     if(i==len-1)
				     {
				     	$('#gym').val(gId);
				     }
				 }
			   }
			   
		    });
             $('#roomname').val(results.get('name'));
             $('#totalOccupancy').val(results.get('totalOccupancy'));
             $('#roomId').val(results.id);
            // $('#allowOccupancy').val(results.get('allowOccupancy'));
             $('#allowOccupancy').attr('checked', results.get('allowOccupancy'));
             //alert(results.get('allowOccupancy'));
             
             
         }
    });
    
}


/*
 *  Update room details
 */
function update_room(data)
{
    var values = {};

    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
   
    var roomId = getValue("roomId");
    var name = getValue("roomname");
    var totalOccupancy = parseInt(getValue("totalOccupancy"));
    var gymId = getValue("gym");
    if(getValue("allowOccupancy")=='true')
    {
    		var allowOccupancy = true;
    }
    else
    {
    		var allowOccupancy = false;
    }
    
    var UG = Parse.Object.extend("university_gym");
    var q = new Parse.Query(UG);
    q.equalTo("objectId", gymId);
    q.include("university");
    q.first({
    		success: function(results){
    		    var Room = Parse.Object("room");
		    Room.id = roomId;
		    Room.set('name',name); 
		    Room.set('totalOccupancy',totalOccupancy); 
		    Room.set('allowOccupancy',allowOccupancy); 
		    Room.set('gymId',results); 
		    Room.set('universityGymId',results.id); 
		    if(Room.save())
		    {
			   showSuccess('Room updated successfully.');
			   window.location.href='viewRooms';
		    }
		    else
		    {
			   showError('Room could not be saved. Please try again.');
		    }
    		}
    });
    
     
}

/*
 *  Delete Room
 */
function delete_room(roomId)
{
    if(confirm('Are you sure, you want to delete?'))
    {
        var Room = Parse.Object.extend("room");
        var q = new Parse.Query(Room);
        q.get(roomId, {
           success: function(q) { 
            if(q.destroy({}))
            { 
                showSuccess('Room deleted successfully.');
                window.location.reload();
            }
            else
            {
                showError('Room could not be saved. Please try again.');
            }
           },
           error: function(q, error) {
              showError(error.message);
           }
         });
    }
}

/*
 * Add new equipment
 */
 function add_equipment(data)
{
    console.log(data);
    var values = {};
    
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });
    
    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var gymId = getValue("gym");
    var name = getValue("name");
    var quantity = getValue("quantity");
    var room = getValue("room");
    var adv_signup_lt = getValue("adv_signup_lt");
    var mac_time_lt = getValue("mac_time_lt");
    var signup_lt = getValue("signup_lt");
    var description = getValue("description");
    var current = Parse.User.current();
    var tot_row = $(".time_fields .row").length * quantity;
    var no = 1;
    var type = getValue("type");
    var start_number = parseInt(getValue("start_number"));
    var openTime = getValue("start_time");
    var closeTime = getValue("end_time");
    var lmt = mac_time_lt.split(' ');
    var time_lt;
    if(lmt[1]=='hour')
    {
    		time_lt = 60;
    }else{
    		time_lt = lmt[0];
    }
//alert(openTime+'|'+closeTime);
    
   var eqType = Parse.Object.extend("gym_equipment_type");
   var qrr = new Parse.Query(eqType);
   qrr.equalTo("objectId", type);
   qrr.first({
   	success: function(pp){
   		   var Room = Parse.Object.extend("room");
		   var q = new Parse.Query(Room);
		   var c=1;
		   
		   q.equalTo("objectId", room);
		   //q.include('gymId');
		   q.first({
		     success: function(results){
		           var UG =  Parse.Object.extend("university_gym");
		           var ug = new Parse.Query(UG);
		           ug.equalTo("objectId", gymId);
		           ug.include("university");
		           ug.first({
		               success: function(gym)
		               {
		                for(var j=0;j<quantity;j++)
	   				 {
		                   
		                   var Name = name + parseInt(start_number+j);
		                   console.log(Name);
		                  // alert(j+Name);
		                  //s alert
		                   var university = gym.get("university");
		                   var universityId = university.id; 
		                   var universityGymId = gym.id;
		                   var r1 = Parse.Object("gym_equipment");
		                   r1.set("name",Name);
		                   r1.set("notes",description);
		                   r1.set("gym",gym);
		                   r1.set("roomId",results);
		                   r1.set("room",results.id);
		                   r1.set("adv_signup_lt",adv_signup_lt);
		                   r1.set("mac_time_lt",mac_time_lt);
		                   r1.set("signup_lt", signup_lt);
		                   r1.set("status", true);
		                   r1.set("university", university);
		                   r1.set("universityId", universityId);
		                   r1.set("universityGymId", universityGymId);
		                   r1.set("equpType", pp);
		                   r1.set("typeId", type);
		                   r1.save(null,{
		                       success:function(equip){
		                              console.log(openTime+'|'+closeTime);
		                              var hours = Number(openTime.match(/^(\d+)/)[1]);
								var minutes = Number(openTime.match(/:(\d+)/)[1]);
								var AMPM = openTime.match(/\s(.*)$/)[1];
								if(AMPM == "PM" && hours<12) hours = hours+12;
								if(AMPM == "AM" && hours==12) hours = hours-12;
								var sHours = hours.toString();
								var sMinutes = minutes.toString();
								if(hours<10) sHours = "0" + sHours;
								if(minutes<10) sMinutes = "0" + sMinutes;
								oTm = sHours + ":" + sMinutes;
								console.log(oTm);
							
								var hours = Number(closeTime.match(/^(\d+)/)[1]);
								var minutes = Number(closeTime.match(/:(\d+)/)[1]);
								var AMPM = closeTime.match(/\s(.*)$/)[1];
								if(AMPM == "PM" && hours<12) hours = hours+12;
								if(AMPM == "AM" && hours==12) hours = hours-12;
								var sHours = hours.toString();
								var sMinutes = minutes.toString();
								if(hours<10) sHours = "0" + sHours;
								if(minutes<10) sMinutes = "0" + sMinutes;
								cTm = sHours + ":" + sMinutes;
								console.log(cTm);
							
		                             var start = oTm.split(':');
							    var end = cTm.split(':');
							    var inc = parseInt(time_lt,10);

							    var pad = function (n) { return (n < 10) ? '0' + n.toString() : n; },
								    startHr = parseInt(start[0], 10),
								    startMin = parseInt(start[1], 10),
								    endHr = parseInt(end[0], 10),
								    endMin = parseInt(end[1], 10),
								    currentHr = startHr,
								    currentMin = startMin,
								    previous = currentHr + ':' + pad(currentMin),
								    current = '',
								   r = [];
								   if(currentHr>=12)
								   {
								   	var dd=' PM';
								   	if(currentHr!=12)
								   	{var h=currentHr-12;}
								   	else{var h=currentHr;}
								   }else{
								   	var dd=' AM';
								   	var h=currentHr;
								   }
								   prevtime=pad(h) + ":" + pad(currentMin) + dd;

							    do {
								   currentMin += inc;
								   if ((currentMin % 60) === 0 || currentMin > 60) {
									  currentMin = (currentMin === 60) ? 0 : currentMin - 60;
									  currentHr += 1;
								   }
								   current = pad(currentHr) + ':' + pad(currentMin);
								   if(currentHr>=12)
								   {
								   	var dd=' PM';
								   	if(currentHr!=12)
								   	{var h=currentHr-12;}
								   	else{var h=currentHr;}
								   }else{
								   	var dd=' AM';
								   	var h=currentHr;
								   }
								   curntTime=pad(h) + ":" + pad(currentMin) + dd;
								   
								   	 var s1 = Parse.Object("slots");
				                          var start_time = prevtime;
				                          var end_time = curntTime;
				                          s1.set("gymId", gym);
				                          s1.set("roomId",results);
				                          s1.set("equipId",equip);
				                          s1.set("start_time",start_time);
				                          s1.set("end_time",end_time);
				                          s1.set("university", university);
				              			 s1.set("universityId", universityId);
				             			 s1.set("universityGymId", universityGymId);
				                          s1.save({
				                              success:function(){
				                                  //stot_row--;
				                                  if(currentHr == endHr)
				                                  {
				                                      $('#smart-form-register')[0].reset();
				                                      showSuccess('Gym equipment added successfully.');
				                                      //window.location.href='viewEquipments';
				                                  }
				                              }
				                          })
								   previous = current;
								   prevtime=curntTime;
							  } while (currentHr !== endHr);
		                         	
		                          /* $('.time_fields .row').each(function(){
		                               var s1 = Parse.Object("slots");
		                               var start_time = $(this).find('.start_time').val();
		                               var end_time = $(this).find('.end_time').val();
		                               s1.set("gymId", gym);
		                               s1.set("roomId",results);
		                               s1.set("equipId",equip);
		                               s1.set("start_time",start_time);
		                               s1.set("end_time",end_time);
		                               s1.set("university", university);
		                   			 s1.set("universityId", universityId);
		                  			 s1.set("universityGymId", universityGymId);
		                               s1.save({
		                                   success:function(){
		                                       tot_row--;
		                                       if(tot_row == 0)
		                                       {
		                                           $('#smart-form-register')[0].reset();
		                                           showSuccess('Gym equipment added successfully.');
		                                           window.location.href='viewEquipments';
		                                       }
		                                   }
		                               })
		                           })*/
		                          
		                       },
		                       error:function(r1,error){
		                              showError(error.message);
		                       }                            
		                   })
		                   
		                 }
		               },
		               error:function(ug,error){
		                              showError(error.message);
		               }        
		           })
		       },
		       error: function(r1,error){
		                      showError('Sorry room is not available.');
		               }
		   });
   	}
   });
        
        
    
}
/*function add_equipment(data)
{
    var values = {};
    
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });
    
    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var name = getValue("name");
    var quantity = getValue("quantity");
    var room = getValue("room");
    var adv_signup_lt = getValue("adv_signup_lt");
    var mac_time_lt = getValue("mac_time_lt");
    var signup_lt = getValue("signup_lt");
    var gymId = getValue("gym");
    var current = Parse.User.current();
    var tot_row = $(".time_fields .row").length * quantity;
    for(j=0;j<quantity;j++)
    {
        var Room = Parse.Object.extend("room");
        var q = new Parse.Query(Room);
        var c=1;
        q.equalTo("objectId", room);
        //q.include('gymId');
        q.first({
          success: function(results){
                var UG =  Parse.Object.extend("university_gym");
                var ug = new Parse.Query(UG);
                ug.equalTo("objectId", gymId);
                ug.include("university");
                ug.first({
                    success: function(gym)
                    {
                        var university = gym.get("university");
                        var universityId = university.id; 
                        var universityGymId = gym.id;
                        var r1 = Parse.Object("gym_equipment");
                        r1.set("name", name);
                        r1.set("gym",gym);
                        r1.set("roomId",results);
                        r1.set("adv_signup_lt",adv_signup_lt);
                        r1.set("mac_time_lt",mac_time_lt);
                        r1.set("signup_lt", signup_lt);
                        r1.set("status", true);
                        r1.set("university", university);
                        r1.set("universityId", universityId);
                        r1.set("universityGymId", universityGymId);
                        r1.save(null,{
                            success:function(equip){
                               
                                $('.time_fields .row').each(function(){
                                    var s1 = Parse.Object("slots");
                                    var start_time = $(this).find('.start_time').val();
                                    var end_time = $(this).find('.end_time').val();
                                    s1.set("gymId", gym);
                                    s1.set("roomId",results);
                                    s1.set("equipId",equip);
                                    s1.set("start_time",start_time);
                                    s1.set("end_time",end_time);
                                    s1.set("university", university);
                        			 s1.set("universityId", universityId);
                       			 s1.set("universityGymId", universityGymId);
                                    s1.save({
                                        success:function(){
                                            tot_row--;
                                            if(tot_row == 0)
                                            {
                                                $('#smart-form-register')[0].reset();
                                                showSuccess('Gym equipment added successfully.');
                                                window.location.href='viewEquipments';
                                            }
                                        }
                                    })
                                })
                               
                            },
                            error:function(r1,error){
                                   showError(error.message);
                            }                            
                        })
                    },
                    error:function(ug,error){
                                   showError(error.message);
                    }        
                })
            },
            error: function(r1,error){
                           showError('Sorry room is not available.');
                    }
        });
    }
}*/

/*
 * Room list for select 
 */
function get_rooms_list(gymId)
{
    var Room = Parse.Object.extend("room");
    var q = new Parse.Query(Room);
    var c=1;
    q.equalTo("universityGymId", gymId);
    //q.include('gymId');
    q.find({
      success: function(results){
         $("#room").empty();
         $("#room").append(new Option('Select Room', ''));
         for(i in results){
            var room = results[i];
            //var user = results[i].get('users');
            if(room)
            {
                $("#room").append(new Option(room.get('name'), room.id));
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          
      }
    });
}

/*
 *  Get Equipments for listing
 */
function get_equipments()
{
    //var current = Parse.User.current();
    var UG =  Parse.Object.extend("university");
    var ug = new Parse.Query(UG);
    //ug.equalTo("objectId", current.get('universityId'));
    ug.find({
        success: function(gyms)
        {  c=1;
            for(j in gyms)
            {   
                var gym=gyms[j];
                var equipments = Parse.Object.extend('gym_equipment');
                var eqpmnts = new Parse.Query(equipments);
                eqpmnts.equalTo('university',gym);
                eqpmnts.include('roomId');
                eqpmnts.include('gym');
                eqpmnts.include('university');
                eqpmnts.descending('createdAt');
                eqpmnts.find({
                    success: function(results){
                       
                        for(i in results){
                            var room = results[i].get('roomId');
                            var Gym = results[i].get('gym');
                            var Univ = results[i].get('university');
                            var equip = results[i];
                            var row='<tr>';
                            row += '<td>' + c + '</td>';
                            row += '<td>'+Univ.get('name')+'</td>';
                            row += '<td>'+Gym.get('name')+'</td>';
                            row += '<td>'+equip.get('name')+'</td>';
                            row += '<td>'+room.get('name')+'</td>';
                            row += '<td>'+equip.get('adv_signup_lt')+'</td>';
                            row += '<td>'+equip.get('mac_time_lt')+'</td>';
                            row += '<td>'+equip.get('signup_lt')+'</td>';
                            row += '<td>';
                            row +=      '<span class="onoffswitch">';
                            row +=          '<input id="st'+c+'" class="onoffswitch-checkbox" type="checkbox" onclick="change_eqStatus(\''+ equip.id +'\')"';
                            row +=          equip.get('status')?'checked="checked"':'';
                            row +=          'name="start_interval">';
                            row +=          '<label class="onoffswitch-label" for="st'+(c)+'">';
                            row +=              '<span class="onoffswitch-inner" data-swchoff-text="OFF" data-swchon-text="ON"></span>'
                            row +=              '<span class="onoffswitch-switch"></span>';
                            row +=          '</label>';
                            row +=      '</span>';
                            row += '</td>';
                            row += '<td>';
                            row +=      '<a class="btn btn-primary" href="viewSlot?rid='+ equip.id +'"><i class="fa fa-eye"></i>View Slots</a>';
                            //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
                            row +=      '<a class="btn btn-primary" href="editEquipments?rid='+ equip.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
                            row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_equipment(\''+equip.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                            row += '</td>';
                            row += '</tr>';
                            $('table.equipments tbody').append(row); 
                            //$('.projects-table').dataTable().fnAddData(row);
                            /*if(c==1)
                            {
                                $('.projects-table').dataTable();
                            }
                            else
                            {
                                $('.projects-table').dataTable().fnDestroy();
                                $('.projects-table').dataTable();
                            }*/
                            /*
                            row = '<tr>';
                            row +=  '<td>';
                            row +=  '</td>';
                            row +=  '<td colspan="6" id="in_tab' + c + '">';
                            row +=  '</td>';
                            row +=  '<td>';
                            row +=  '</td>';
                            row += '</tr>';
                            $('table.equipments tbody').append(row);

                            var Slots = Parse.Object.extend('slots');
                            var slots = new Parse.Query(Slots);
                            slots.equalTo('equipId',equip);
                            slots.find({
                                success: function(slot){
                                    var table = '<table>';
                                    table += '<tr>';
                                    table +=  '<th> Start Time </th>';
                                    table +=  '<th> End Time </th>';
                                    table += '</tr>';
                                    for(s in slot){

                                       var s1 = slot[s];
                                       table += '<tr>';
                                       table +=  '<td>';
                                       table +=  s1.get('start_time');
                                       table +=  '</td>';
                                       table +=  '<td>';
                                       table +=  s1.get('end_time');
                                       table +=  '</td>';
                                       table += '</tr>';

                                    }
                                     table += '</table>';
                                     console.log(table);
                                    $('#in_tab'+c).html(table);
                                }
                            }) */

                            c++;

                        }
                       
                    },
                    error:function(eqpmnts,error){
                                        showError(error.message);
                                 }  
                });
            }
            //$('.projects-table').dataTable();
        }
    });
 }
 
 /*
  * Delete equipment
  */
 function delete_equipment(equi_id)
 {
     
    if(confirm('Are you sure, you want to delete?'))
    {
        var GE = Parse.Object.extend("gym_equipment");
        var q = new Parse.Query(GE);
        q.get(equi_id, {
           success: function(q) { 
            if(q.destroy({}))
            { 
                 $('table.equipments tbody').empty();
                showSuccess('Equipment deleted successfully.');
                get_equipments();
               
                //window.location.reload();
            }
            else
            {
                showError('Equipment could not be saved. Please try again.');
            }
           },
           error: function(q, error) {
              showError(error.message);
           }
         });
    }
 }
 
 /*
 * 
 *  Get equipment Details By Id
 */
function equipmentDetails(equipId)
{
    //get_rooms_list();
    var GE = Parse.Object.extend("gym_equipment");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", equipId);
    //q.include('users');
    q.first({
         success: function(results){
             //console.log()
             get_rooms_list(results.get('universityGymId'));
             $('#name').val(results.get('name'));
             
             $('#adv_signup_lt').val(results.get('adv_signup_lt'));
             $('#mac_time_lt').val(results.get('mac_time_lt'));
             $('#signup_lt').val(results.get('signup_lt'));
             $('#quantity').val(results.get('quantity'));
             setTimeout($('#room').val(results.get('room')),3000);
         }
    });
    
}

/*
 *  Update equipment details
 */
function update_equipment(data)
{
    var values = {};

    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var name = getValue("name");
    var room = getValue("room");
    var adv_signup_lt = getValue("adv_signup_lt");
    var mac_time_lt = getValue("mac_time_lt");
    var signup_lt = getValue("signup_lt");
    var equip_id = getValue("equipment_id");
    
     var Room = Parse.Object.extend("room");
        var q = new Parse.Query(Room);
        var c=1;
        q.equalTo("objectId", room);
        //q.include('gymId');
        q.first({
          success: function(results){
            var r1 = Parse.Object("gym_equipment");
            r1.id=equip_id;
            r1.set("name", name);
            r1.set("roomId",results);
            r1.set("adv_signup_lt",adv_signup_lt);
            r1.set("mac_time_lt",mac_time_lt);
            r1.set("signup_lt", signup_lt);
            r1.save(null,{
                success:function(){
                     showSuccess('Gym equipment saved successfully.');
                     window.location.href='viewEquipments';
                },
                error:function(r1,error){
                       showError(error.message);
                }                            
            });
        },
        error:function(q,error){
               showError(error.message);
        }   
    })  
}

function change_eqStatus(eq_id)
{
    var GE = Parse.Object.extend("gym_equipment");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", eq_id);
    q.first({
            success: function(results){
                
                    var r1 = Parse.Object("gym_equipment");
                    r1.id=eq_id;
                    if(results.get('status'))
                    {
                        r1.set("status",false);
                    }
                    else
                    {
                        r1.set("status",true);
                    }
                    r1.save(null,{
                        success:function(){
                             showSuccess('Gym equipment status changed successfully.');
                             //window.location.href='viewEquipments';
                        },
                        error:function(r1,error){
                               showError('Gym equipment could not be changed. Please try again later.');
                        }                            
                    });
                
        },
        error:function(r1,error){
                showError(error.message);
         } 
    })
    
}

function change_occupStatus(occupId)
{
    //alert(occupId);
   var GE = Parse.Object.extend("slots");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", occupId);
    q.first({
            success: function(results){
                   //alert(results.id);
                    var r1 = Parse.Object("slots");
                    r1.id=results.id;
                    if(results.get('isActive'))
                    {
                        r1.set("isActive",false);
                    }
                    else
                    {
                        r1.set("isActive",true);
                    }
                    r1.save(null,{
                        success:function(){
                             showSuccess('Gym equipment status changed successfully.');
                             //window.location.href='viewEquipments';
                        },
                        error:function(r1,error){
                               showError('Gym equipment could not be changed. Please try again later.');
                        }                            
                    });
                
        },
        error:function(r1,error){
                showError(error.message);
         } 
    })
}
  
 /*
 * Equipment list for select 
 */
function get_equipments_list(gymId)
{
    var GE = Parse.Object.extend("gym_equipment");
    var q = new Parse.Query(GE);
    var c=1;
    q.equalTo("status", true);
    q.equalTo('universityGymId',gymId);
    q.find({
      success: function(results){
         for(i in results){
            var room = results[i];
            //var user = results[i].get('users');
            if(room)
            {
                $("#equipment").append(new Option(room.get('name'), room.id));
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          
      }
    });
}

/*
 * Add New Occupancy
 */
function add_occupancy(data)
{
    var values = {};
    
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });
    
    var getValue = function (valueName) {
        return values[valueName];
    };
    var user = getValue("user");
    var slotId = getValue("slot");
    var equipment = getValue("equipment");
    var universityGymId = getValue("gym");
    //console.log('Room Id ' + room);
    //console.log('Equipment Id ' + equipment);
    var User = Parse.Object.extend("User");
        var u = new Parse.Query(User);
        var c=1;
        u.equalTo("objectId", user);
        //q.include('gymId');
        u.first({
          success: function(ud){
                var UG =  Parse.Object.extend("gym_equipment");
                var ug = new Parse.Query(UG);
                ug.equalTo("objectId", equipment);
                ug.first({
                    success : function(result){
                        var current = Parse.User.current();
                        var Gym =  Parse.Object.extend("university_gym");
                        var gm = new Parse.Query(Gym);
                        gm.equalTo("objectId", universityGymId);
                        gm.include("university");
                        gm.first({
                            success: function(gym)
                            {
                                var university = gym.get("university");
                    		  var universityId = university.id;
                    		  var universityGymId = gym.id;
                                var Slot =  Parse.Object.extend("slots");
                                var slot = new Parse.Query(Slot);
                                slot.equalTo("objectId", slotId);
                                slot.first({
                                    success: function(slt)
                                    {
                                        var r1 = Parse.Object("equipment_occupancy");
                                        r1.set("gymId", gym);
                                        r1.set("userId", ud);
                                        r1.set("slotId", slt);
                                        r1.set("equipmentId",result);
                                        r1.set("university", university);
                        				r1.set("universityId", universityId);
                        				r1.set("universityGymId", universityGymId);
                                        r1.save(null,{
                                            success:function(){
                                                 showSuccess('Gym equipment added successfully.');
                                                 window.location.href='viewOccupancy';
                                            },
                                            error:function(r1,error){
                                                   showError(error.message);
                                            }                             
                                        })
                                    }
                            })
                        }
                        })
                    }
                
                })
            }
        })
}

/*
 * View all ocuupancy
 */
function get_occupancies()
{
    //var current = Parse.User.current();
    var UG =  Parse.Object.extend("university");
    var ug = new Parse.Query(UG);
    //ug.equalTo("objectId", current.get('universityId'));
    ug.include('university');
    ug.first({
        success: function(gym)
        {   
            var equip_occup = Parse.Object.extend('equipment_occupancy');
            var eqpmnts = new Parse.Query(equip_occup);
            eqpmnts.equalTo('university',gym);
            eqpmnts.include('gymId');
            eqpmnts.include('equipmentId');
            eqpmnts.include('slotId');
            eqpmnts.include('userId');
            eqpmnts.find({
                success: function(results){
                    c=1;
                    for(i in results){
                        var occup = results[i];
                        var Gym = results[i].get('gymId');
                        var user = results[i].get('userId');
                        var equipment = results[i].get('equipmentId');
                        var slot = results[i].get('slotId');
                        var row='<tr>';
                        row += '<td>' + (c++) + '</td>';
                        row += '<td>'+Gym.get('name')+'</td>';
                        row += '<td>'+user.get('firstname')+" "+user.get('lastname')+'</td>';
                        row += '<td>'+equipment.get('name')+'</td>';
                        row += '<td>'+slot.get('start_time')+'</td>';
                        row += '<td>'+slot.get('end_time')+'</td>';  
                        row += '<td>';
                        //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
                        //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
                        //row +=      '<a class="btn btn-primary" href="editOccupancy?rid='+ occup.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
                        row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_occupancy(\''+occup.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                        row += '</td>';
                        row += '</tr>';
                        $('table.equipments tbody').append(row);
                    }
                    
                    $('.projects-table').dataTable();
                }
            });
        }
    });
}

/*
  * Delete equipment occupancy
  */
 function delete_occupancy(equi_id)
 {
     
    if(confirm('Are you sure, you want to delete?'))
    {
        var GE = Parse.Object.extend("equipment_occupancy");
        var q = new Parse.Query(GE);
        q.get(equi_id, {
           success: function(q) { 
            if(q.destroy({}))
            { 
                $('table.equipments tbody').empty();
                showSuccess('Equipment deleted successfully.');
                get_occupancies();
               
                //window.location.reload();
            }
            else
            {
                showError('Equipment could not be saved. Please try again.');
            }
           },
           error: function(q, error) {
              showError(error.message);
           }
         });
    }
 }
 
 /*
  * Add New Time SLot
  */
 function add_slot(data,rid)
 {
    var values = {};
    
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });
    
    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var start_time = getValue("start_time");
    var end_time = getValue("end_time");
    var name = getValue("name");
    
    var current = Parse.User.current();
    
    var UG =  Parse.Object.extend("gym_equipment");
    var ug = new Parse.Query(UG);
    ug.equalTo("objectId", rid);
    ug.first({
        success: function(equip)
        {
            var r1 = Parse.Object("slots");
            r1.set("start_time", start_time);
            r1.set("end_time",  end_time);
            r1.set("equipId", equip);
            //r1.set("name", name);
            //r1.set("gymId",gym);
            r1.save(null,{
                success:function(){
                     showSuccess('Time Slot added successfully.');
                     window.location.href='viewSlot?rid='+rid;
                },
                error:function(error){
                       showError(error.message);
                }                            
            })
        },
        error:function(error){
            showError(error.message);
        }        
    })
 }
 
 
 /*
 * Get All Slots
 */
function get_slots(equipId)
{
    var current = Parse.User.current();
    var UG =  Parse.Object.extend("gym_equipment");
    var ug = new Parse.Query(UG);
    ug.equalTo("objectId", equipId);
    ug.first({
        success: function(equip)
        {   var Slots = Parse.Object.extend('slots');
            var eqpmnts = new Parse.Query(Slots);
            eqpmnts.equalTo('equipId',equip);
            //eqpmnts.include('roomId');
            //eqpmnts.include('equipmentId');
            eqpmnts.find({
                success: function(results){
                    c=1;
                    for(i in results){
                        var occup = results[i];
                       
                        var row='<tr>';
                        row += '<td>' + (c++) + '</td>';
                        //row += '<td>'+occup.get('name')+'</td>';
                        row += '<td>'+occup.get('start_time')+'</td>';
                        row += '<td>'+occup.get('end_time')+'</td>';
                        row += '<td>';
                        row +=      '<span class="onoffswitch">';
                        row +=          '<input id="st'+c+'" class="onoffswitch-checkbox" type="checkbox" onclick="change_occupStatus(\''+ occup.id +'\')"';
                        row +=          (occup.get('isActive')==false)?'':'checked="checked"';
                        row +=          'name="start_interval">';
                        row +=          '<label class="onoffswitch-label" for="st'+(c)+'">';
                        row +=              '<span class="onoffswitch-inner" data-swchoff-text="OFF" data-swchon-text="ON"></span>'
                        row +=              '<span class="onoffswitch-switch"></span>';
                        row +=          '</label>';
                        row +=      '</span>';
                        row += '</td>';
                        row += '<td>';
                        //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
                        //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
                        row +=      '<a class="btn btn-primary" href="editSlot?rid='+ occup.id +'&sid=' + equipId + '"><i class="fa fa-pencil-square"></i>Edit</a>';
                        row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_slot(\''+occup.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                        row += '</td>';
                        row += '</tr>';
                        $('table.equipments tbody').append(row);
                    }
                    $('.projects-table').dataTable();
                }
            });
        }
    });
}

/*
  * Delete equipment occupancy
  */
 function delete_slot(equi_id)
 {
     
    if(confirm('Are you sure, you want to delete?'))
    {
        var GE = Parse.Object.extend("slots");
        var q = new Parse.Query(GE);
        q.get(equi_id, {
           success: function(q) { 
            if(q.destroy({}))
            { 
                $('table.equipments tbody').empty();
                showSuccess('Slot deleted successfully.');
                //get_slots();
                //$('.projects-table').dataTable().fnDestroy();
               // $('.projects-table').dataTable();
                window.location.reload();
            }
            else
            {
                showError('Slot could not be saved. Please try again.');
            }
           },
           error: function(q, error) {
              showError(error.message);
           }
         });
    }
 }

/*
 * 
 *  Get slot Details By Id
 */
function slotDetails(slotId)
{
    //get_rooms_list();
    var GE = Parse.Object.extend("slots");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", slotId);
    //q.include('users');
    q.first({
         success: function(results){
             //console.log()
             //$('#name').val(results.get('name'));
             $('#start_time').val(results.get('start_time'));
             $('#end_time').val(results.get('end_time'));
             $('#slotId').val(results.id);
         }
    });
    
}


/*
 *  Update Slot details
 */
function update_slot(data,rid)
{
    var values = {};

    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var name = getValue("name");
    var start_time = getValue("start_time");
    var end_time = getValue("end_time");
    var slotId = getValue("slotId");
    
    var Slot = Parse.Object("slots");
    Slot.id = slotId;
    Slot.set('start_time',start_time);  
    Slot.set('end_time',end_time);
    //Slot.set('name',name);
    if(Slot.save())
    {
        showSuccess('Slot updated successfully.');
        window.location.href='viewSlot?rid='+rid;
    }
    else
    {
        showError('Slot could not be saved. Please try again.');
    }
     
}

/*
 * Get slot list for select box
 */
function get_slot_list(equipId)
{
    var current = Parse.User.current();
    var UG =  Parse.Object.extend("gym_equipment");
    var ug = new Parse.Query(UG);
    ug.equalTo("objectId", equipId);
    ug.first({
        success:function(equip){
            var Slot = Parse.Object.extend("slots");
            var q = new Parse.Query(Slot);
            var c=1;
            q.equalTo("equipId", equip);
            //q.include('gymId');
            q.find({
              success: function(results){
                 if(results)
                 {
                    $("#slot").empty();
                    $("#slot").append(new Option('Select Time Slot',''));
                    for(i in results){
                       var slot = results[i];
                       //var user = results[i].get('users');
                       if(slot)
                       {
                           $("#slot").append(new Option(slot.get('start_time') + " - " + slot.get('end_time'), slot.id));
                       }
                       //console.log(university);
                       //console.log(book.get("firstname")+ " " +book.get("name"));
                     }
                 }

              }
            });
        }
    })
}

/*
 *  Get User Listing for university
 */ 
function get_users()
{
    //alert('adsas');
    //var current = Parse.User.current();
   // console.log(current);
   // console.log("University " + current.get('universityId'));
    var users = Parse.Object.extend('User');
    var eqpmnts = new Parse.Query(users);
    eqpmnts.equalTo('userType','user');
    eqpmnts.descending('createdAt');
    //eqpmnts.include('roomId');
    //eqpmnts.include('equipmentId');
    eqpmnts.find({
        success: function(results){
            c=1;
            for(i in results){
                var user = results[i];
                getUserDetail(user,results,i);
                
                
            }
            
        }
    });
}

function getUserDetail(user,results,i)
{
	 var ln = results.length;
	 console.log(ln);
	 console.log(i);
	 var unive = Parse.Object.extend('university_gym');
      var eqU = new Parse.Query(unive);
      eqU.equalTo('objectId',user.get('universityGymId'));
      eqU.include('university');
      eqU.first({
      	success: function(gY){
      		 var uuniv = gY.get('university');
      		 var phone = user.get('phone')?user.get('phone'):'NA';
		      var row='<tr>';
		      row += '<td>' + (c++) + '</td>';
		      row += '<td>'+uuniv.get('name')+'</td>';
		      row += '<td>'+gY.get('name')+'</td>';
		      row += '<td>'+user.get('firstname')+'</td>';
		      row += '<td>'+user.get('lastname')+'</td>';
		      row += '<td>'+ phone +'</td>';
		      row += '<td>'+user.get('email')+'</td>';
		      row += '<td>'+user.get('userType')+'</td>';
		      //row += '<td>';
		      //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
		      //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
		      //row +=      '<a class="btn btn-primary" href="editSlot?rid='+ occup.id +'&sid=' + equipId + '"><i class="fa fa-pencil-square"></i>Edit</a>';
		      //row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_slot(\''+occup.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
		      //row += '</td>';
		      row += '</tr>';
		      $('table.users tbody').append(row);
		      if(parseInt(ln-1)==i)
			 {
			 	$('.users').dataTable();
			 }	
      	}
      });
      
}
/*
 * University users list for select box
 */
function get_university_user_list(gymId)
{
    //var current = Parse.User.current();
    //console.log(current);
    //console.log("University " + current.get('universityId'));
    var users = Parse.Object.extend('User');
    var eqpmnts = new Parse.Query(users);
    eqpmnts.equalTo('universityGymId',gymId);
    eqpmnts.equalTo('userType','user');
    //eqpmnts.notEqualTo('objectId',current.id);
    eqpmnts.descending('createdAt');
    //eqpmnts.include('roomId');
    //eqpmnts.include('equipmentId');
    eqpmnts.find({
        success: function(results){
            c=1;
            $('#user').empty();
            $('#user').append(new Option('Select User', ''));
            for(i in results){
                user=results[i];
                $('#user').append(new Option(user.get('firstname')+" "+user.get('lastname'), user.id));
            }
        }
    })
}

/*
 * Get details to edit occupancy
 */
function edit_occupancy(occupId)
{
    var current = Parse.User.current();
    var users = Parse.Object.extend('User');
    var eqpmnts = new Parse.Query(users);
    eqpmnts.equalTo('universityId',current.get('universityId'));
    eqpmnts.notEqualTo('objectId',current.id);
    eqpmnts.descending('createdAt');
    eqpmnts.find({
        success: function(results){
            for(i in results){
                user=results[i];
                $('#user').append(new Option(user.get('firstname')+" "+user.get('lastname'), user.id));
            }
            var GE = Parse.Object.extend("gym_equipment");
            var q = new Parse.Query(GE);
            q.equalTo("status", true);
            q.find({
              success: function(gym_equip){
                 for(i in gym_equip){
                    var room = gym_equip[i];
                    if(room)
                    {
                        $("#equipment").append(new Option(room.get('name'), room.id));
                    }
                  }
                var EO = Parse.Object.extend("equipment_occupancy");
                var q = new Parse.Query(EO);
                q.equalTo("objectId", occupId);
                q.first({
                    success: function(occup)
                    {
                        $('#user').val(occup.get('userId').id);
                        $("#equipment").val(occup.get('equipmentId').id);
                        get_slot_list(occup.get('equipmentId').id);
                        setTimeout(function(){$('#slot').val(occup.get('slotId').id);},3000);
                    }
                })

              }
            });
        }
    })
    
}

/*--All Gym Listing respect to university--*/
function getAllGym(){
    //var universityId = currentUser.get('universityId');
    var UG = Parse.Object.extend('university_gym');
    var qug = new Parse.Query(UG);
    //qug.equalTo('universityId',universityId);
    qug.notEqualTo('isDelete',1);
    qug.equalTo('isActive',1);
    qug.descending('createdAt');
    //eqpmnts.include('roomId');
    //eqpmnts.include('equipmentId');
    qug.find({
        success: function(results){
            c=1;
            for(i in results){
                gym=results[i];
                $('#gym').append(new Option(gym.get('name'), gym.id));
            }
        }
    })
}

/*
 *  Get Gyms By University
 */
function get_gyms(universityId)
{
    var Gym = Parse.Object.extend("university_gym");
    var q = new Parse.Query(Gym);   
    q.equalTo('universityId',universityId);
    q.equalTo('isActive',1);
    q.equalTo('isDelete',0);
    q.find({
        success: function(results){
            $("#gym").empty();
            $("#gym").append(new Option("Select Gym", ""));
            for(i in results){
                var university = results[i];
                //option = '<option value="'++'">'++'</option>';
                $("#gym").append(new Option(university.get('name'), university.id));
           }
        }
    });
}

/*-------All University--------*/
function getAllUniversity(){
    var UG = Parse.Object.extend('university');
    var qug = new Parse.Query(UG);
    qug.notEqualTo('is_delete',true);
    qug.equalTo('isActive',1);
    qug.descending('createdAt');
    //eqpmnts.include('roomId');
    //eqpmnts.include('equipmentId');
    qug.find({
        success: function(results){
            c=1;
            for(i in results){
                gym=results[i];
                $('#university').append(new Option(gym.get('name'), gym.id));
            }
        }
    })
}

/*
* Function releated to Gym closing date
*/

function get_gymClosingDate(id)
{ 
	var current = Parse.User.current();
	var gymId = id;//current.get('universityGymId');
	var GE = Parse.Object.extend("university_gym");
	var q = new Parse.Query(GE);
	q.equalTo("objectId", gymId);
	//q.include('users');
	q.first({
	    success: function(results){
		   //console.log()
				var clsDate = results.get('closeDate');
				var CloseDate = clsDate.split(',');
				var count = CloseDate.length;
				if(CloseDate!='')
				{
				$.each(CloseDate,function(index){
					var date = CloseDate[index];
					var row='<tr>';
					row += '<td>' + (index+1) + '</td>';
					row += '<td>'+date+'</td>';
					row += '<td>';
					//row +=      '<a class="btn btn-primary" href="editOccupancy?rid='+ occup.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
					row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_ClosingDate(\''+date+'\',\''+gymId+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
					row += '</td>';
					row += '</tr>';
					$('table.equipments tbody').append(row);
					if(parseInt(count-1)==index)
					{
						 $('.projects-table').dataTable();
					}
		   		});
		   		}
		   		
		   
	    }
	});
}

function delete_ClosingDate(dd,id)
{
	var removeItem = dd;
	var current = Parse.User.current();
	var gymId = id;//current.get('universityGymId');
	var GE = Parse.Object.extend("university_gym");
	var q = new Parse.Query(GE);
	q.equalTo("objectId", gymId);
	//q.include('users');
	q.first({
		success: function(results){
			var clsDate = results.get('closeDate');
			var CloseDate = clsDate.split(',');
			y = jQuery.grep(CloseDate, function(value) {
			  return value != removeItem;
			});
			console.log(y);
			closeDatelast = y.join(",");
			var UniversityGym = Parse.Object("university_gym");
	   		UniversityGym.id = gymId;
	   		UniversityGym.set('closeDate',closeDatelast);
	   		if(UniversityGym.save())
		     {
			   $('.result-msg').html('<div style="padding: 20px;border: 1px solid green;background: #eee;color:green">Deleted Successfully!</div>');
								    
			   window.location.href='gymClosingDate?gid='+id;
			    //user.save();  
		     }
		}
	});
}

/*
* Get Occupancy List
*/

function get_listOccupancy()
{
    //var gymId = currentUser.get('universityId');
    var Room = Parse.Object.extend("room");
    var q = new Parse.Query(Room);
    var c=1;
    //q.equalTo("universityId", gymId);
    q.include('gymId');
    q.include('university');
    q.find({
      success: function(results){
         for(i in results){
            var room = results[i];
            var gym = results[i].get('gymId');
            var university = results[i].get('university');
            if(room)
            {
              if(room.get('allowOccupancy')==true) 
              {
                var total = room.get('totalOccupancy');
                var male = room.get('male');
                var female = room.get('female');
               //var tot = parseInt(male+female);
                var tot = parseInt(room.get('reservedOccupancy'));
                var percentage = parseInt(tot*100/total);
                //alert(percentage);
                var row='<tr>';
                row += '<td>' + (c++) + '</td>';
                row += '<td>'+university.get('name')+'</td>';
                row += '<td>'+gym.get('name')+'</td>';
                row += '<td>'+room.get('name')+'</td>';
                row += '<td><input type="text" name="male'+room.id+'" id="male'+room.id+'"  class="male_val" value="'+room.get('male')+'" onkeypress="return checkNumber(event)" /></td>';
                row += '<td><input type="text" name="female'+room.id+'" id="female'+room.id+'"  class="female_val" value="'+room.get('female')+'" onkeypress="return checkNumber(event)" /></td>';
                row += '<td><input type="text" name="reservedOccupancy'+room.id+'" id="reservedOccupancy'+room.id+'" class="res_val" value="'+room.get('reservedOccupancy')+'" onkeypress="return checkNumber(event)" />/'+room.get('totalOccupancy')+'</td>';
                row += '<td class="per_rev" id="per'+ room.id +'">'+percentage+'%</td>';
                row += '<td>';
                //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
                //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
                row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="editOccupancy(\''+ room.id +'\',\''+total+'\',this)"><i class="fa fa-pencil-square"></i>Save</a>';
                //row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_room(\''+room.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                row += '</td>';
                row += '</tr>';
                $('table.rooms tbody').append(row);
              }
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          $('#datatable_tabletools').dataTable();
      }
    });
}
/*
*Edit Occupancy Listing
*/
function editOccupancy(id,total,elem)
{
	console.log(total);
	var roomId = id;
	var male = parseInt($(elem).closest('tr').find('.male_val').val());
	var female = parseInt($(elem).closest('tr').find('.female_val').val());
	var reservedOccupancy = $(elem).closest('tr').find('.res_val').val();
	//var oom = Parse.Object.extend("room");
	var Room = Parse.Object("room");
	//alert(reservedOccupancy+'|'+total+'|'+roomId);
	Room.id = id;
	Room.set('male',parseInt(male));  
	Room.set('female',parseInt(female));
	if(male!=0 || female!=0)
	{
		Room.set('reservedOccupancy',parseInt(male+female));
	}
	else if(reservedOccupancy!=0)
	{
		Room.set('reservedOccupancy',parseInt(reservedOccupancy));
	}
	else
	{
		Room.set('reservedOccupancy',parseInt(0));
	}
	if(Room.save())
	{
	    
	  if(male!=0 || female!=0)
	  {
		var tot = parseInt(male+female);
		console.log(tot);
		var percentage = parseInt(tot*100/total);
		console.log(percentage);
		$(elem).closest('tr').find('.res_val').val(tot);
		$(elem).closest('tr').find('.per_rev').html(percentage+'%');
	  }
	  else if(reservedOccupancy!=0)
	  {
	  	var tot = parseInt($(elem).closest('tr').find('.res_val').val());
	  	var percentage = parseInt(tot*100/total);
		console.log(percentage);
		$(elem).closest('tr').find('.res_val').val(tot);
		$(elem).closest('tr').find('.per_rev').html(percentage+'%');
	  } 
	  else 
	  {
	  	var tot = parseInt(0);
	  	var percentage = parseInt(0);
		console.log(percentage);
		$(elem).closest('tr').find('.res_val').val(0);
		$(elem).closest('tr').find('.per_rev').html('0%');
	  }
	   var UG = Parse.Object.extend("room");
	    var q = new Parse.Query(UG);
	    q.equalTo("objectId", id);
	    q.include("university");
	    q.include("gymId");
	    q.first({
		 success: function(results){
		 	var university = results.get("university");
		 	var gym = results.get("gymId");
		 	//console.log(university);
		 	var universityId = university.id;
		 	var gymId = gym.id;
		 	
		 	var RO = Parse.Object.extend("room_occupancy");
		 	var qRO = new Parse.Query(RO);
		 	
		 	qRO.equalTo("roomId", results.id);
		     qRO.descending("updatedAt");
		     qRO.find({
		 		
		 		success: function(qres){
		 		 console.log(qres);
		 		 
		 		 if(!jQuery.isEmptyObject(qres))
		 		 {
		 		 	
			 		 	Res = qres[0];
			 		 	if(moment(Res.updatedAt).format('YYYY/MM/DD')==moment().format('YYYY/MM/DD'))
			 		 	{
			 		 		var RoomOcc = Parse.Object("room_occupancy");
			 		 		RoomOcc.id=Res.id;
			 		 		RoomOcc.set('male',male);
			 		 		RoomOcc.set('female',female);
			 		 		RoomOcc.set('percentage',percentage);
			 		 		if(RoomOcc.save())
			 		 		{
			 		 			
								 showSuccess('Occupancy updated successfully.');
			 		 		}
			 		 	}
			 		 	else
			 		 	{
			 		 		var roomOccupancy = Parse.Object.extend("room_occupancy");
						  var r1 = new roomOccupancy({"male":male,"female":female,"percentage":percentage,"room":results,"universityId":universityId,"university":university,"roomId":results.id,"gym":gym,"gymId":gymId});
						  r1.save(null,{
							 success:function(){
								 showSuccess('Occupancy updated successfully.');
							 },
							 error:function(r1,error){
								   showError(error.message);
							 }
						  })
			 		 	}
		 		 	
		 		 }
		 		 else{
		 		 	  var roomOccupancy = Parse.Object.extend("room_occupancy");
					  var r1 = new roomOccupancy({"male":male,"female":female,"percentage":percentage,"room":results,"universityId":universityId,"university":university,"roomId":results.id,"gym":gym,"gymId":gymId});
					  r1.save(null,{
						 success:function(){
						      showSuccess('Occupancy updated successfully.');
						 },
						 error:function(r1,error){
						        showError(error.message);
						 }
					  })
		 		 }
		 		 
		 		}
		 	});
		   }
	    });
	   
	}
	else
	{
	   showError('Room could not be saved. Please try again.');
	}
	
}

/*
 * Instructor list for select 
 */
function get_instructor_list(id)
{
    //var current = Parse.User.current();
    
    var users = Parse.Object.extend('gym_staff');
    var eqpmnts = new Parse.Query(users);
    eqpmnts.equalTo("gymId",id);
    eqpmnts.equalTo('type','instructor');
    eqpmnts.find({
      success: function(results){
         for(i in results){
            var room = results[i];
            //var user = results[i].get('users');
            if(room)
            {
                $("#instructor").append(new Option(room.get('firstname') + " " + room.get('lastname'), room.id));
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          
      }
    });
}

/*
 * Room list for select 
 */
/*function get_rooms_list(gymId)
{
    var Room = Parse.Object.extend("room");
    var q = new Parse.Query(Room);
    var c=1;
    q.equalTo("universityGymId", gymId);
    //q.include('gymId');
    q.find({
      success: function(results){
         for(i in results){
            var room = results[i];
            //var user = results[i].get('users');
            if(room)
            {
                $("#room").append(new Option(room.get('name'), room.id));
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          
      }
    });
}*/
/*
 * Instructor list for select 
 */
function get_instructor_list(id)
{
    var current = Parse.User.current();
    
    var users = Parse.Object.extend('gym_staff');
    var eqpmnts = new Parse.Query(users);
    eqpmnts.equalTo("gymId",id);
    eqpmnts.equalTo('type','instructor');
    eqpmnts.find({
      success: function(results){
         for(i in results){
            var room = results[i];
            //var user = results[i].get('users');
            if(room)
            {
                $("#instructor").append(new Option(room.get('firstname') + " " + room.get('lastname'), room.id));
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          
      }
    });
}

/*
 *  Add New Class
 */
function add_class(data)
{
    var values = {};
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
    
    
    var gymId = getValue("gym");//currentUser.get('universityGymId');
    var roomname = getValue("roomname");
    var name = getValue("name");
    var room = getValue("room");
    var description = getValue("description");
    var start_date = getValue("start_date");
    var end_date = getValue("end_date");
    var start_time = getValue("start_time");
    var end_time = getValue("end_time");
    var instructor = getValue("instructor");
    var spots = getValue("spots");
    var walkin_spots = getValue("walkin_spots");
    var advance_time = getValue("advance_time");
    var students = getValue("students");
    var type = getValue("type");
    var date = getValue("date");
    var allDates = getValue("hid_recc_dates");
     
    var days = '';
    
    if(type=='R')
    {
    		if(allDates=='')
    		{
    			showError('Please check the Days on which class will be held .' + error);
    		}
    		else{
    			var data = allDates.split("#");
    			var quantity = data.length;
    			var tot_row = $(".time_fields .newtime").length * quantity;
    			var UG = Parse.Object.extend("university_gym");
			var q = new Parse.Query(UG);
			q.equalTo("objectId", gymId);
			q.include("university");
			q.first({
			   success: function(results){
				  var university = results.get("university");
				  //console.log(university);
				 var Room = Parse.Object.extend("room");
				 var rp = new Parse.Query(Room);
				 rp.equalTo("objectId",room);
				 rp.first({
					 success: function(robject)
					 {
						var inst = Parse.Object.extend('gym_staff');
						var insts = new Parse.Query(inst);
						insts.equalTo("objectId", instructor);
						insts.first({
						    success:function(inst_ob)
						    {
							   $.each(data, function (dIndex) {
								   var eachDate=data[dIndex];
								   var r1 = Parse.Object("classes");
								   r1.set("name", name);
								   r1.set("room",robject);
								   r1.set("roomId",room);
								   r1.set("description",description);
								   //r1.set("start_date",start_date);
								   //r1.set("end_date",end_date);
								   r1.set("date",eachDate);
								   r1.set("start_time",start_time);
								   r1.set("end_time",end_time);
								   r1.set("instructor",inst_ob);
								   r1.set("instructorId",instructor);
								   r1.set("spots",spots);
								   r1.set("type",type);
								   r1.set("walkin_spots",walkin_spots);
								   r1.set("advance_time",advance_time);
								   r1.set("students",students);
								   r1.set("gym",results);
								   r1.set("gymId",gymId);
								   //r1.set("days",days);
								   r1.set("university",university);
								   r1.set("universityId",university.id);
								   r1.save(null,{
								   success:function(cls){
										 $('.time_fields .newtime').each(function(){
						                     var s1 = Parse.Object("class_slot");
						                     var start_time = $(this).find('.start_time').val();
						                     var end_time = $(this).find('.end_time').val();
						                     s1.set("gymId", gymId);
						                     s1.set("gym",results);
						                     s1.set("university", university);
						         			 s1.set("universityId", university.id);
						         			 s1.set("class", cls);
						         			 s1.set("classId", cls.id);
						                     s1.set("start_time",start_time);
						                     s1.set("end_time",end_time);
						                     s1.set("isActive",true);
						                     s1.save({
						                         success:function(){
						                             tot_row--;
						                             if(tot_row == 0)
						                             {
						                                 $('#add-event-form')[0].reset();
						                                 showSuccess('Class added successfully.');
										  		   window.location.href='viewClass';
						                             }
						                         }
						                     })
						                 })
										  
										  
									  },
									  error:function(r1,error){
										    showError('Class could not be added. Please try again later.' + error);
									  }                            
								   });
							    });
							   
						    }
						});
					 }
				  })
				  
			   }
			})
    			 
    		}
    }
    else if(type=='N')
    {
    		
    			//var data = allDates.split("#");
    			//var quantity = data.length;
    			var tot_row = 1;//$(".time_fields .newtime").length * quantity;
    			var UG = Parse.Object.extend("university_gym");
			var q = new Parse.Query(UG);
			q.equalTo("objectId", gymId);
			q.include("university");
			q.first({
			   success: function(results){
				  var university = results.get("university");
				  //console.log(university);
				 var Room = Parse.Object.extend("room");
				 var rp = new Parse.Query(Room);
				 rp.equalTo("objectId",room);
				 rp.first({
					 success: function(robject)
					 {
						var inst = Parse.Object.extend('gym_staff');
						var insts = new Parse.Query(inst);
						insts.equalTo("objectId", instructor);
						insts.first({
						    success:function(inst_ob)
						    {
							   
								   //var eachDate=data[dIndex];
								   var r1 = Parse.Object("classes");
								   r1.set("name", name);
								   r1.set("room",robject);
								   r1.set("roomId",room);
								   r1.set("description",description);
								   //r1.set("start_date",start_date);
								   //r1.set("end_date",end_date);
								   r1.set("date",start_date);
								   r1.set("start_time",start_time);
								   r1.set("end_time",end_time);
								   r1.set("instructor",inst_ob);
								   r1.set("instructorId",instructor);
								   r1.set("spots",spots);
								   r1.set("type",type);
								   r1.set("walkin_spots",walkin_spots);
								   r1.set("advance_time",advance_time);
								   r1.set("students",students);
								   r1.set("gym",results);
								   r1.set("gymId",gymId);
								   //r1.set("days",days);
								   r1.set("university",university);
								   r1.set("universityId",university.id);
								   r1.save(null,{
								   success:function(cls){
										 $('.time_fields .newtime').each(function(){
						                     var s1 = Parse.Object("class_slot");
						                     //var start_time = $(this).find('.start_time').val();
						                     //var end_time = $(this).find('.end_time').val();
						                     s1.set("gymId", gymId);
						                     s1.set("gym",results);
						                     s1.set("university", university);
						         			 s1.set("universityId", university.id);
						         			 s1.set("class", cls);
						         			 s1.set("classId", cls.id);
						                     s1.set("start_time",start_time);
						                     s1.set("end_time",end_time);
						                     s1.save({
						                         success:function(){
						                             tot_row--;
						                             if(tot_row == 0)
						                             {
						                                 $('#add-event-form')[0].reset();
						                                 showSuccess('Class added successfully.');
										  		   window.location.href='viewClass';
						                             }
						                         }
						                     })
						                 })
										  
										  
									  },
									  error:function(r1,error){
										    showError('Class could not be added. Please try again later.' + error);
									  }                            
								   });
							    
							   
						    }
						});
					 }
				  })
				  
			   }
			})

    }
    /*for(d=1;d<=7;d++)
    {
        if(getValue("days" + d))
        {
            days += getValue("days" + d) + ",";
        }
    }*/
   
    //var gymId = 'eexv0lmEQO'; //---------------- Comment this and set this dynamic
    
    
    
}

/*
* Calender List Show respect to Gym
*/
function calenderClass(id)
{
    var gymId = id;//currentUser.get('universityGymId');
    var Class = Parse.Object.extend("classes");
    var q = new Parse.Query(Class);
    q.equalTo("gymId", gymId);
    q.include("room");
    q.include("instructor");
    q.descending("createdAt");
    q.find({
        success:function(results)
        {
            c=1;
            var row = '';
            length = results.length;
            for(i in results)
            {
		       var classes = results[i];
		       var room = classes.get('room');
		       var instructor = classes.get('instructor');
		       if(classes)
		       {
		           
			            
			            dt = classes.get('date');
			            dt = dt.split(".");
			            d = dt[0];
			            m = parseInt(dt[1]-1);
			            y = dt[2]; 
			            
		           row += '{';
		           row += '"title" : "' + classes.get('name') + '",';
		           row += '"start" : "'+new Date(y, m, d )+'",';
		           row += '"description" : "'+room.get('name')+'",';
		           row += '"className" : ["event", "bg-color-greenLight"]';
		           row += '}';
		           console.log(i);
			     if(parseInt(length-1)==i)
			     {
			       row += '';	
			     } else{
			       row += ',';
			     }
		           console.log(row);
		       }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          //row+=']';
         //alert(row);
         clShow(row);
        }
    })
}


function clShow(listClass)
{
	//JSONObject jsnobject = new JSONObject(listClass); 
	//alert(listClass);
	//var date = new Date();
			   // var d = date.getDate();
			   // var m = date.getMonth();
			    //var y = date.getFullYear();
			
			    var hdr = {
			        left: 'title',
			        center: 'month,agendaWeek,agendaDay',
			        right: 'prev,today,next'
			    };
			
			    var initDrag = function (e) {
			        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
			        // it doesn't need to have a start or end
			
			        var eventObject = {
			            title: $.trim(e.children().text()), // use the element's text as the event title
			            description: $.trim(e.children('span').attr('data-description')),
			            icon: $.trim(e.children('span').attr('data-icon')),
			            className: $.trim(e.children('span').attr('class')) // use the element's children as the event class
			        };
			        // store the Event Object in the DOM element so we can get to it later
			        e.data('eventObject', eventObject);
			
			        // make the event draggable using jQuery UI
			        e.draggable({
			            zIndex: 999,
			            revert: true, // will cause the event to go back to its
			            revertDuration: 0 //  original position after the drag
			        });
			    };
			
			    var addEvent = function (title, priority, description, icon) {
			        title = title.length === 0 ? "Untitled Event" : title;
			        description = description.length === 0 ? "No Description" : description;
			        icon = icon.length === 0 ? " " : icon;
			        priority = priority.length === 0 ? "label label-default" : priority;
			
			        var html = $('<li><span class="' + priority + '" data-description="' + description + '" data-icon="' +
			            icon + '">' + title + '</span></li>').prependTo('ul#external-events').hide().fadeIn();
			
			        $("#event-container").effect("highlight", 800);
			
			        initDrag(html);
			    };
			
			    /* initialize the external events
				 -----------------------------------------------------------------*/
			
			    $('#external-events > li').each(function () {
			        initDrag($(this));
			    });
			
			   /* $('#add-event').click(function () {
			        var title = $('#title').val(),
			            priority = $('input:radio[name=priority]:checked').val(),
			            description = $('#description').val(),
			            icon = $('input:radio[name=iconselect]:checked').val();
			
			        addEvent(title, priority, description, icon);
			    });*/
			
			    /* initialize the calendar
				 -----------------------------------------------------------------*/
			
			    $('#calendar').fullCalendar({
			
			        header: hdr,
			        buttonText: {
			            prev: '<i class="fa fa-chevron-left"></i>',
			            next: '<i class="fa fa-chevron-right"></i>'
			        },
			
			        editable: false,
			        droppable: true, // this allows things to be dropped onto the calendar !!!
			
			        drop: function (date, allDay) { // this function is called when something is dropped
			
			            // retrieve the dropped element's stored Event Object
			            var originalEventObject = $(this).data('eventObject');
			
			            // we need to copy it, so that multiple events don't have a reference to the same object
			            var copiedEventObject = $.extend({}, originalEventObject);
			
			            // assign it the date that was reported
			            copiedEventObject.start = date;
			            copiedEventObject.allDay = allDay;
			
			            // render the event on the calendar
			            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
			
			            // is the "remove after drop" checkbox checked?
			            if ($('#drop-remove').is(':checked')) {
			                // if so, remove the element from the "Draggable Events" list
			                $(this).remove();
			            }
			
			        },
			
			        select: function (start, end, allDay) {
			            var title = prompt('Event Title:');
			            if (title) {
			                calendar.fullCalendar('renderEvent', {
			                        title: title,
			                        start: start,
			                        end: end,
			                        allDay: allDay
			                    }, true // make the event "stick"
			                );
			            }
			            calendar.fullCalendar('unselect');
			        },
					events: $.parseJSON('[' + listClass + ']'),
			        /*events: [{
			            title: 'All Day Event',
			            start: new Date(y, m, 1),
			            description: 'long description',
			            className: ["event", "bg-color-greenLight"],
			            icon: 'fa-check'
			        }, {
			            title: 'Long Event',
			            start: new Date(y, m, d - 5),
			            end: new Date(y, m, d - 2),
			            className: ["event", "bg-color-red"],
			            icon: 'fa-lock'
			        }, {
			            id: 999,
			            title: 'Repeating Event',
			            start: new Date(y, m, d - 3, 16, 0),
			            allDay: false,
			            className: ["event", "bg-color-blue"],
			            icon: 'fa-clock-o'
			        }, {
			            id: 999,
			            title: 'Repeating Event',
			            start: new Date(y, m, d + 4, 16, 0),
			            allDay: false,
			            className: ["event", "bg-color-blue"],
			            icon: 'fa-clock-o'
			        }, {
			            title: 'Meeting',
			            start: new Date(y, m, d, 10, 30),
			            allDay: false,
			            className: ["event", "bg-color-darken"]
			        }, {
			            title: 'Lunch',
			            start: new Date(y, m, d, 12, 0),
			            end: new Date(y, m, d, 14, 0),
			            allDay: false,
			            className: ["event", "bg-color-darken"]
			        }],*/
			
			        eventRender: function (event, element, icon) {
			            if (!event.description == "") {
			                element.find('.fc-event-title').append("<br><span class='ultra-light'>" + event.description + "</span>");
			            }
			            if (!event.icon == "") {
			                element.find('.fc-event-title').append("<i class='air air-top-right fa " + event.icon +
			                    " '></i>");
			            }
			        },
			
			        windowResize: function (event, ui) {
			            $('#calendar').fullCalendar('render');
			        }
			    });
			    
			    /* hide default buttons */
			    $('.fc-header-right, .fc-header-center').hide();

			
				$('#calendar-buttons #btn-prev').click(function () {
				    $('.fc-button-prev').click();
				    return false;
				});
				
				$('#calendar-buttons #btn-next').click(function () {
				    $('.fc-button-next').click();
				    return false;
				});
				
				$('#calendar-buttons #btn-today').click(function () {
				    $('.fc-button-today').click();
				    return false;
				});
				
				$('#mt').click(function () {
				    $('#calendar').fullCalendar('changeView', 'month');
				});
				
				$('#ag').click(function () {
				    $('#calendar').fullCalendar('changeView', 'agendaWeek');
				});
				
				$('#td').click(function () {
				    $('#calendar').fullCalendar('changeView', 'agendaDay');
				});
}

/*
 *  Get Classes for listing
 */
function get_classes()
{
    //var gymId = currentUser.get('universityId');
    var Class = Parse.Object.extend("classes");
    var q = new Parse.Query(Class);
    //q.equalTo("universityId", gymId);
    q.include("room");
    q.include("instructor");
    q.include("gym");
    q.include("university");
    q.descending("createdAt");
    q.find({
        success:function(results){
            c=1;
            for(i in results){
            var classes = results[i];
            var room = classes.get('room');
            var gym = classes.get('gym');
            var university = classes.get('university');
            var instructor = classes.get('instructor');
            if(classes)
            {
                if(moment(classes.get('date'),'DD.MM.YYYY').isAfter(moment()))
                {
                var row='<tr>';
                row += '<td>' + (c++) + '</td>';
                row += '<td>'+university.get('name')+'</td>';
                row += '<td>'+gym.get('name')+'</td>';
                row += '<td>'+classes.get('name')+'</td>';
                row += '<td>'+room.get('name')+'</td>';
                row += '<td>'+instructor.get('firstname')+" "+instructor.get('lastname')+'</td>';
                row += '<td>'+moment(classes.get('date'),'DD.MM.YYYY').format('MM/DD/YYYY')+'</td>';
                row += '<td>'+classes.get('spots')+'</td>';
                row += '<td>'+classes.get('walkin_spots')+'</td>';
                row += '<td>';
                //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
                row +=      '<a class="btn btn-primary" href="viewClassSlot.php?rid='+ classes.id +'"><i class="fa fa-eye"></i>Time Slots</a>';
                row +=      '<a class="btn btn-primary" href="viewFeedback.php?lid='+ classes.id +'"><i class="fa fa-eye"></i>Feedback</a>';
                row +=      '<a class="btn btn-primary" href="editClass?rid='+ classes.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
                row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_class(\''+classes.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                row += '</td>';
                row += '</tr>';
                $('table.rooms tbody').append(row);
                }
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          $('.rooms').dataTable();
	            $.tablesorter.addParser({ 
            					id: 'time_left', 
            					is: function(s) {
            //return false;
            //use the above line if you don't want table sorter to auto detected this parser                        
            //21/04/2010 03:54 is the used date/time format 
            return /\d{1,2}\/\d{1,2}\/\d{1,4} \d{1,2}:\d{1,2}/.test(s);
        },
        format: function(s) {
            s = s.replace(/\-/g," ");
            s = s.replace(/:/g," ");
            s = s.replace(/\./g," ");
            s = s.replace(/\//g," ");
            s = s.split(" ");                       
            return $.tablesorter.formatFloat(new Date(s[2], s[1]-1, s[0], s[3], s[4]).getTime());                                         
        },
        type: "numeric" 
            					
            					});
            					
            					 $('.rooms').tablesorter({ usNumberFormat : false, 
            					 sortReset : true, 
            					 sortRestart : true, 
            					 headers: { 4: { sorter:'time_left' } } }); 
        }
    })
}


function get_PastClasses()
{
    //var gymId = currentUser.get('universityId');
    var Class = Parse.Object.extend("classes");
    var q = new Parse.Query(Class);
    //q.equalTo("universityId", gymId);
    q.include("room");
    q.include("instructor");
    q.include("gym");
    q.include("university");
    q.descending("createdAt");
    q.find({
        success:function(results){
            c=1;
            for(i in results){
            var classes = results[i];
            var room = classes.get('room');
            var gym = classes.get('gym');
            var university = classes.get('university');
            var instructor = classes.get('instructor');
            if(classes)
            {
                if(moment(classes.get('date'),'DD.MM.YYYY').isBefore(moment()))
                {
                var row='<tr>';
                row += '<td>' + (c++) + '</td>';
                row += '<td>'+university.get('name')+'</td>';
                row += '<td>'+gym.get('name')+'</td>';
                row += '<td>'+classes.get('name')+'</td>';
                row += '<td>'+room.get('name')+'</td>';
                row += '<td>'+instructor.get('firstname')+" "+instructor.get('lastname')+'</td>';
                row += '<td>'+moment(classes.get('date'),'DD.MM.YYYY').format('MM/DD/YYYY')+'</td>';
                row += '<td>'+classes.get('spots')+'</td>';
                row += '<td>'+classes.get('walkin_spots')+'</td>';
                row += '<td>';
                //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
                row +=      '<a class="btn btn-primary" href="viewClassSlot.php?rid='+ classes.id +'"><i class="fa fa-eye"></i>Time Slots</a>';
                row +=      '<a class="btn btn-primary" href="viewFeedback.php?lid='+ classes.id +'"><i class="fa fa-eye"></i>Feedback</a>';
                row +=      '<a class="btn btn-primary" href="editClass?rid='+ classes.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
                row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_class(\''+classes.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                row += '</td>';
                row += '</tr>';
                $('table.rooms tbody').append(row);
                }
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          $('.rooms').dataTable();
	            $.tablesorter.addParser({ 
            					id: 'time_left', 
            					is: function(s) {
            //return false;
            //use the above line if you don't want table sorter to auto detected this parser                        
            //21/04/2010 03:54 is the used date/time format 
            return /\d{1,2}\/\d{1,2}\/\d{1,4} \d{1,2}:\d{1,2}/.test(s);
        },
        format: function(s) {
            s = s.replace(/\-/g," ");
            s = s.replace(/:/g," ");
            s = s.replace(/\./g," ");
            s = s.replace(/\//g," ");
            s = s.split(" ");                       
            return $.tablesorter.formatFloat(new Date(s[2], s[1]-1, s[0], s[3], s[4]).getTime());                                         
        },
        type: "numeric" 
            					
            					});
            					
            					 $('.rooms').tablesorter({ usNumberFormat : false, 
            					 sortReset : true, 
            					 sortRestart : true, 
            					 headers: { 4: { sorter:'time_left' } } }); 
        }
    })
}
/*
 * Delete class
 */
function delete_class(classId)
{
    if(confirm('Are you sure, you want to delete?'))
    {
        var Classes = Parse.Object.extend("classes");
        var q = new Parse.Query(Classes);
        q.get(classId, {
           success: function(q) { 
            if(q.destroy({}))
            { 
                $('.rooms tbody').empty();
                get_classes();
                showSuccess('Class deleted successfully.');
                //window.location.reload();
            }
            else
            {
                showError('Class could not be deleted. Please try again.');
            }
           },
           error: function(q, error) {
              showError(error.message);
           }
         });
    }
}

/*
 *  Get Class Details By Id
 */
function classDetails(classId)
{
    var Classes = Parse.Object.extend("classes");
    var q = new Parse.Query(Classes);
    q.equalTo("objectId", classId);
    var d;
    //q.include('users');
    q.first({
         success: function(results){
             get_instructor_list(results.get('gymId'));
             get_rooms_list(results.get('gymId'));
             calenderClass(results.get('gymId'));
             $('#name').val(results.get('name'));
             $('#room').val(results.get('roomId'));
             $('#description').val(results.get('description'));
             $('#start_date').val(results.get('start_date'));
             $('#end_date').val(results.get('end_date'));
             $('#start_time').val(results.get('start_time'));
             $('#end_time').val(results.get('end_time'));
             $('#instructor').val(results.get('instructorId'));
             $('#spots').val(results.get('spots'));
             $('#walkin_spots').val(results.get('walkin_spots'));
             $('#advance_time').val(results.get('advance_time'));
             $('#students').val(results.get('students')); 
             $('#cid').val(results.id);
             // $('#type').val(results.get('type')); 
             
             
            var days = results.get('days');
           // alert(days);
            for(d=1;d<=7;d++)
            {
                if(days.indexOf(d)!=-1)
                {
                   $('#day' + d).attr('checked','checked');
                }
            }
             var type=results.get('type');
             if(type=='N')
             {
                 $('#nonrecurr').attr('checked','checked');
                 $('#id1').hide();
             }
             
         }
    });
}

/*
 *  Add New Class
 */
function update_class(data)
{
    var values = {};
    
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
    //var gymId = currentUser.get('universityGymId');
    //var roomname = getValue("roomname");
    var name = getValue("name");
    var room = getValue("room");
    var description = getValue("description");
    //var start_date = getValue("start_date");
    //var end_date = getValue("end_date");
    //var start_time = getValue("start_time");
    //var end_time = getValue("end_time");
    var instructor = getValue("instructor");
    var spots = getValue("spots");
    var walkin_spots = getValue("walkin_spots");
    var advance_time = getValue("advance_time");
    var students = getValue("students");
    //var type = getValue("type");
    var cid = getValue("cid");
    
     /*var days = '';
    for(d=1;d<=7;d++)
    {
        if(getValue("days" + d))
        {
            days += getValue("days" + d) + ",";
        }
    }*/
    //var gymId = 'eexv0lmEQO'; //---------------- Comment this and set this dynamic
    
  
            
            //console.log(university);
           var Room = Parse.Object.extend("room");
           var rp = new Parse.Query(Room);
           rp.equalTo("objectId",room);
           rp.first({
                success: function(robject)
                {
                    var inst = Parse.Object.extend('gym_staff');
                    var insts = new Parse.Query(inst);
                    insts.equalTo("objectId", instructor);
                    insts.first({
                        success:function(inst_ob)
                        {
                            var r1 = Parse.Object("classes");
                            r1.id = cid;
                            r1.set("name", name);
                            r1.set("room",robject);
                            r1.set("roomId",room);
                            r1.set("description",description);
                            //r1.set("start_date",start_date);
                            //r1.set("end_date",end_date);
                            //r1.set("start_time",start_time);
                            //r1.set("end_time",end_time);
                            r1.set("instructor",inst_ob);
                            r1.set("instructorId",instructor);
                            r1.set("spots",spots);
                            //r1.set("type",type);
                            //r1.set("days",days);
                            r1.set("walkin_spots",walkin_spots);
                            r1.set("advance_time",advance_time);
                            r1.set("students",students);
                            //r1.set("gym",results);
                            //r1.set("gymId",gymId);
                            //r1.set("university",university);
                            //r1.set("universityId",university.id);
                             r1.save(null,{
                                success:function(){
                                     showSuccess('Class updated successfully.');
                                     window.location.href='viewClass';
                                },
                                error:function(r1,error){
                                       showError('Class could not be updated. Please try again later.' + error);
                                }                            
                            });
                        }
                    });
                }
            })      
    
}


function get_class_slots(equipId)
{
    var current = Parse.User.current();
    var UG =  Parse.Object.extend("classes");
    var ug = new Parse.Query(UG);
    ug.equalTo("objectId", equipId);
    ug.first({
        success: function(equip)
        {   var Slots = Parse.Object.extend('class_slot');
            var eqpmnts = new Parse.Query(Slots);
            eqpmnts.equalTo('class',equip);
            //eqpmnts.include('roomId');
            //eqpmnts.include('equipmentId');
            eqpmnts.find({
                success: function(results){
                    c=1;
                    for(i in results){
                        var occup = results[i];
                        get_PercentReserved(occup,i,results.length,equipId,equip);
                        
                    }
                    //$('.projects-table').dataTable();
                }
            });
        }
    });
}



function get_PercentReserved(occup,c,len,equipId,equip)
{
    
    console.log(c);
	var rating=0;
	var feedback = Parse.Object.extend("class_reservation");
     var qr = new Parse.Query(feedback);
     qr.equalTo("slot", occup);
     return qr.count({
      success: function(results){
         
         			var percent = results*100/equip.get("spots");
            	    var row='<tr>';
			    row += '<td>' + (c++) + '</td>';
			    //row += '<td>'+occup.get('name')+'</td>';
			    row += '<td>'+occup.get('start_time')+'</td>';
			    row += '<td>'+occup.get('end_time')+'</td>';
			    row += '<td>'+results+'/'+equip.get("spots")+' - '+percent+'%'+'</td>';
			    row += '<td>';
			    row +=      '<span class="onoffswitch">';
			    row +=          '<input id="st'+c+'" class="onoffswitch-checkbox" type="checkbox" onclick="change_classSlot(\''+ occup.id +'\')"';
			    row +=          (occup.get('isActive')==false)?'':'checked="checked"';
			    row +=          'name="start_interval">';
			    row +=          '<label class="onoffswitch-label" for="st'+(c)+'">';
			    row +=              '<span class="onoffswitch-inner" data-swchoff-text="OFF" data-swchon-text="ON"></span>'
			    row +=              '<span class="onoffswitch-switch"></span>';
			    row +=          '</label>';
			    row +=      '</span>';
			    row += '</td>';
			    row += '<td>';
			    //row +=      '<a class="btn btn-primary" href="/calendar"><i class="fa fa-eye"></i>View Classes</a>';
			    //row +=      '<a class="btn btn-primary" href="/viewEquipments"><i class="fa fa-eye"></i>View Equipment History</a>'
			    row +=      '<a class="btn btn-primary" href="viewReservation?rid='+ occup.id +'&sid=' + equipId + '"><i class="fa fa-pencil-square"></i>View Reservation</a>';
			    row +=      '<a class="btn btn-primary" href="editClassSlot?rid='+ occup.id +'&sid=' + equipId + '"><i class="fa fa-pencil-square"></i>Edit</a>';
			    row +=      '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_classSlot(\''+occup.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
			    row += '</td>';
			    row += '</tr>';
     		$('table.equipments tbody').append(row);
          
          
          //alert(parseInt(len-1)+c);
		          if(parseInt(len-1)==c)
				{
					//alert(parseInt(len-1));
		       	 	jQuery('#datatable_tabletools').dataTable();
		       	 	return true;
				}
      }
    });
}

/*
  * Delete Class Slot
  */
 function delete_classSlot(equi_id)
 {
     
    if(confirm('Are you sure, you want to delete?'))
    {
        var GE = Parse.Object.extend("class_slot");
        var q = new Parse.Query(GE);
        q.get(equi_id, {
           success: function(q) { 
            if(q.destroy({}))
            { 
                $('table.equipments tbody').empty();
                showSuccess('Slot deleted successfully.');
                //get_slots();
                //$('.projects-table').dataTable().fnDestroy();
               // $('.projects-table').dataTable();
                window.location.reload();
            }
            else
            {
                showError('Slot could not be deleted. Please try again.');
            }
           },
           error: function(q, error) {
              showError(error.message);
           }
         });
    }
 }
 
 /*
 * Class Slot Status(Active / inactive)
 */
 function change_classSlot(occupId)
{
   var GE = Parse.Object.extend("class_slot");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", occupId);
    q.first({
            success: function(results)
            	{
                    var r1 = Parse.Object("class_slot");
                    r1.id=occupId;
                    if(results.get('isActive'))
                    {
                        r1.set("isActive",false);
                    }
                    else
                    {
                        r1.set("isActive",true);
                    }
                    r1.save(null,{
                        success:function(){
                             showSuccess('Class Slot status changed successfully.');
                             //window.location.href='viewEquipments';
                        },
                        error:function(r1,error){
                             showError('Class Slot could not be changed. Please try again later.');
                        }                            
                    });
                
			},
			error:function(r1,error){
				 showError(error.message);
			} 
    })
}
/*
 * 
 *  Get Class slot Details By Id
 */
function classSlotDetails(slotId)
{
    //get_rooms_list();
    var GE = Parse.Object.extend("class_slot");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", slotId);
    //q.include('users');
    q.first({
         success: function(results){
             //console.log()
             //$('#name').val(results.get('name'));
             $('#start_time').val(results.get('start_time'));
             $('#end_time').val(results.get('end_time'));
             $('#slotId').val(results.id);
         }
    });
    
}


/*
 *  Update Class Slot details
 */
function update_classSlot(data,rid)
{
    var values = {};

    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });

    var getValue = function (valueName) {
        return values[valueName];
    };
    
    var name = getValue("name");
    var start_time = getValue("start_time");
    var end_time = getValue("end_time");
    var slotId = getValue("slotId");
    
    var Slot = Parse.Object("class_slot");
    Slot.id = slotId;
    Slot.set('start_time',start_time);  
    Slot.set('end_time',end_time);
    //Slot.set('name',name);
    if(Slot.save())
    {
        showSuccess('Class Slot updated successfully.');
        window.location.href='viewClassSlot?rid='+rid;
    }
    else
    {
        showError('Slot could not be saved. Please try again.');
    }
     
}

/*
* Class Reservation Listing respect to Time Slot
*/
function get_class_reservation(equipId)
{
    var current = Parse.User.current();
    var UG =  Parse.Object.extend("class_reservation");
    var ug = new Parse.Query(UG);
    ug.equalTo("slotId", equipId);
    ug.include("class");
    ug.include("user");
    ug.find({
        success: function(res)
        {   
               c=1;
		     for(i in res){
		         var reserve = res[i];
		         var classes = reserve.get("class");
		         var user = reserve.get("user");
		         
		         var row='<tr>';
			    row += '<td>' + (c++) + '</td>';
			    row += '<td>' + user.get('firstname') + ' ' + user.get('firstname') + '</td>';
			    row += '<td>'+classes.get('name')+'</td>';
			    row += '<td>'+reserve.get('date')+'</td>';
			    row += '<td>'+reserve.get('start_time')+'</td>';
			    row += '<td>'+reserve.get('end_time')+'</td>';
			    row += '<td>';
			    row +=      '<span class="onoffswitch">';
				row +=          '<input id="st'+c+'" class="onoffswitch-checkbox" type="checkbox" onclick="change_reservStatus(\''+ reserve.id +'\')"';
				row +=          reserve.get('checkin')?'checked="checked"':'';
				row +=          'name="start_interval">';
				row +=          '<label class="onoffswitch-label" for="st'+(c)+'">';
				row +=              '<span class="onoffswitch-inner" data-swchoff-text="No" data-swchon-text="Yes"></span>'
				row +=              '<span class="onoffswitch-switch"></span>';
				row +=          '</label>';
				row +=      '</span>';
				row += '</td>';
			    row += '</tr>';
     		$('table.equipments tbody').append(row);
		     }
		     $('.projects-table').dataTable();
                
            
        }
    });
}


/*
 * Equipment list for select 
 */
function get_class_list(id)
{
    var current = Parse.User.current();
    var gymId = id;//current.get('universityGymId');
    var GE = Parse.Object.extend("classes");
    var q = new Parse.Query(GE);
    var c=1;
    q.equalTo("gymId", gymId);
    //q.include('gymId');
    q.find({
      success: function(results){
         for(i in results){
            var room = results[i];
            //var user = results[i].get('users');
            if(room)
            {
                $("#classes").append(new Option(room.get('name')+' '+room.get('date'), room.id));
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          
      }
    });
}

function get_class_slot_list(equipId)
{
    var current = Parse.User.current();
    var UG =  Parse.Object.extend("classes");
    var ug = new Parse.Query(UG);
    ug.equalTo("objectId", equipId);
    ug.first({
        success:function(equip){
            var Slot = Parse.Object.extend("class_slot");
            var q = new Parse.Query(Slot);
            var c=1;
            q.equalTo("class", equip);
            //q.include('gymId');
            q.find({
              success: function(results){
                 if(results)
                 {
                    $("#slot").empty();
                    $("#slot").append(new Option('Select Time Slot',''));
                    for(i in results){
                       var slot = results[i];
                       //var user = results[i].get('users');
                       if(slot)
                       {
                           $("#slot").append(new Option(slot.get('start_time') + " - " + slot.get('end_time'), slot.id));
                       }
                       //console.log(university);
                       //console.log(book.get("firstname")+ " " +book.get("name"));
                     }
                 }

              }
            });
        }
    })
}

/*
 * Add New Class Reservation
 */
function add_classReservation(data)
{
    var values = {};
    
    $.each(data, function (i, field) {
        values[field.name] = field.value;
    });
    
    var getValue = function (valueName) {
        return values[valueName];
    };
    var user = getValue("user");
    var gymId = getValue("gym");
    var slotId = getValue("slot");
    var classId = getValue("classes");
    //var reservationDate  = getValue("date");
    var occupId  =getValue("occupId");
    console.log('slotId ' + slotId + '|classId' + classId +'|user'+user);
    //console.log('Equipment Id ' + equipment);
    
    
    
    var chkEquipment  = Parse.Object.extend("class_reservation");
    var qEqup = new Parse.Query(chkEquipment);
    qEqup.equalTo("slotId", slotId);
    qEqup.equalTo("classId", classId);
    qEqup.equalTo("userId", user);
    qEqup.first({
    		success: function(found)
          {
          	if(found)
          	{
          		showError('User already reserved for the Slot.');
          	}
          	else{
          		   var User = Parse.Object.extend("User");
				   var u = new Parse.Query(User);
				   var c=1;
				   u.equalTo("objectId", user);
				   //q.include('gymId');
				   u.first({
					success: function(ud){
						 var UG =  Parse.Object.extend("classes");
						 var ug = new Parse.Query(UG);
						 ug.equalTo("objectId", classId);
						 ug.first({
							success : function(result){
							    var classes = result;
							    var current = Parse.User.current();
							    var Gym =  Parse.Object.extend("university_gym");
							    var gm = new Parse.Query(Gym);
							    gm.equalTo("objectId", gymId);
							    gm.include("university");
							    gm.first({
							        success: function(gym)
							        {
							            var university = gym.get("university");
									  var universityId = university.id;
									  var universityGymId = gym.id;
							            var Slot =  Parse.Object.extend("class_slot");
							            var slot = new Parse.Query(Slot);
							            slot.equalTo("objectId", slotId);
							            slot.first({
							                success: function(slt)
							                {
							                    var r1 = Parse.Object("class_reservation");
							                    if(occupId!='')
							                    {
							                    r1.id = occupId;
							                    }
							                    r1.set("gym", gym);
							                    r1.set("gymId", gym.id);
							                    r1.set("user", ud);
							                    r1.set("userId", ud.id);
							                    r1.set("slot", slt);
							                    r1.set("slotId", slt.id);
							                    r1.set("class",classes);
							                    r1.set("classId",result.id);
							                    r1.set("university", university);
							    				r1.set("universityId", university.id);
							    				
							    				r1.set("start_time", slt.get('start_time'));
							    				r1.set("end_time", slt.get('end_time'));
							    				r1.set("date", result.get('date'));
							    				r1.set("isActive", true);
							                    r1.save(null,{
							                        success:function(){
							                             showSuccess('Class added successfully.');
							                             window.location.href='viewClassReservation';
							                        },
							                        error:function(r1,error){
							                               showError(error.message);
							                        }                             
							                    })
							                }
							        })
							    }
							    })
							}
						 
						 })
					  }
				   })
          	}
          },
		error:function(r1,error){
			 showError(error.message);
		}
    });
}
function change_reservStatus(eq_id)
{
    var GE = Parse.Object.extend("class_reservation");
    var q = new Parse.Query(GE);
    q.equalTo("objectId", eq_id);
    q.first({
            success: function(results){
                console.log(results);
                    var r1 = Parse.Object("class_reservation");
                    r1.id=results.id;
                    if(results.get('checkin'))
                    {
                        r1.set("checkin",false);
                    }
                    else
                    {
                        r1.set("checkin",true);
                    }
                    r1.save(null,{
                        success:function(){
                             showSuccess('User Checkin saved successfully.');
                             //window.location.href='viewEquipments';
                        },
                        error:function(r1,error){
                               showError(error.message+'User Checkin could not be changed. Please try again later.');
                        }                            
                    });
                
        },
        error:function(r1,error){
                showError(error.message);
         } 
    })
    
}
/*
* Class Reservation Listing respect to Gym
*/
function get_class_reservation_list()
{
    //var current = Parse.User.current();
    var UG =  Parse.Object.extend("class_reservation");
    var ug = new Parse.Query(UG);
    //ug.equalTo("universityId", current.get('universityId'));
    ug.include("class");
    ug.include("user");
    ug.include("university");
    ug.include("gym");
    ug.find({
        success: function(res)
        {   
               c=1;
		     for(i in res){
		         var reserve = res[i];
		         var classes = reserve.get("class");
		         var user = reserve.get("user");
		         var gym = reserve.get("gym");
		         var university = reserve.get("university");
		         
		         var row='<tr>';
			    row += '<td>' + (c++) + '</td>';
			    row += '<td>'+university.get('name')+'</td>';
			    row += '<td>'+gym.get('name')+'</td>';
			    row += '<td>' + user.get('firstname') + ' ' + user.get('firstname') + '</td>';
			    row += '<td>'+classes.get('name')+'</td>';
			    row += '<td>'+reserve.get('date')+'</td>';
			    row += '<td>'+reserve.get('start_time')+'</td>';
			    row += '<td>'+reserve.get('end_time')+'</td>';
			    row += '<td>';
			    row +=      '<span class="onoffswitch">';
				row +=          '<input id="st'+c+'" class="onoffswitch-checkbox" type="checkbox" onclick="change_reservStatus(\''+ reserve.id +'\')"';
				row +=          reserve.get('checkin')?'checked="checked"':'';
				row +=          'name="start_interval">';
				row +=          '<label class="onoffswitch-label" for="st'+(c)+'">';
				row +=              '<span class="onoffswitch-inner" data-swchoff-text="No" data-swchon-text="Yes"></span>'
				row +=              '<span class="onoffswitch-switch"></span>';
				row +=          '</label>';
				row +=      '</span>';
				row += '</td>';
			    row += '<td>';
                   //row += '<a class="btn btn-primary" href="editClassReservation?rid='+ reserve.id +'"><i class="fa fa-pencil-square"></i>Edit</a>';
                   row += '<a class="btn btn-primary" href="javascript:void(0);" onclick="delete_reservation(\''+reserve.id+'\')"><i class="fa fa-crosshairs"></i>Delete</a>';
                   row += '</td>';
			    row += '</tr>';
     		$('table.equipments tbody').append(row);
		     }
		     $('.projects-table').dataTable();
                
            
        }
    });
}

function delete_reservation(equi_id)
{

	if(confirm('Are you sure, you want to delete?'))
	{
	   var GE = Parse.Object.extend("class_reservation");
	   var q = new Parse.Query(GE);
	   q.get(equi_id, {
		 success: function(q) { 
		  if(q.destroy({}))
		  { 
		      $('table.equipments tbody').empty();
		      showSuccess('Class Reservation deleted successfully.');
		      //get_occupancies();
		     
		      window.location.reload();
		  }
		  else
		  {
		      showError('Class Reservation could not be saved. Please try again.');
		  }
		 },
		 error: function(q, error) {
		    showError(error.message);
		 }
	    });
	}
}

/*
 * Get details to edit occupancy
 */
function edit_classReservation(occupId)
{
    var current = Parse.User.current();
    var users = Parse.Object.extend('User');
    var gymId = current.get('universityGymId');
    var eqpmnts = new Parse.Query(users);
    eqpmnts.equalTo('universityId',current.get('universityId'));
    eqpmnts.notEqualTo('objectId',current.id);
    eqpmnts.descending('createdAt');
    eqpmnts.find({
        success: function(results){
            for(i in results){
                user=results[i];
                $('#user').append(new Option(user.get('firstname')+" "+user.get('lastname'), user.id));
            }
            var GE = Parse.Object.extend("classes");
            var q = new Parse.Query(GE);
            q.equalTo("gymId", gymId);
            q.find({
              success: function(gym_equip){
                 for(i in gym_equip){
                    var room = gym_equip[i];
                    if(room)
                    {
                        $("#classes").append(new Option(room.get('name')+' '+room.get('date'), room.id));
                    }
                  }
                var EO = Parse.Object.extend("class_reservation");
                var q = new Parse.Query(EO);
                q.equalTo("objectId", occupId);
                q.first({
                    success: function(occup)
                    {
                        $('#user').val(occup.get('user').id);
                        $("#classes").val(occup.get('class').id);
                        //$("#date").val(occup.get('reservationDate'));
                        //get_slot_list(occup.get('equipmentId').id);
                        get_class_slot_list(occup.get('class').id);
                        setTimeout(function(){$('#slot').val(occup.get('slot').id);},3000);
                    }
                })

              }
            });
        }
    })
    
}

/*
* Get Gym time
*/ 
function get_gymTime(id)
{
	var current = Parse.User.current();
	var gymId=id;//current.get('universityGymId');
	var UG =  Parse.Object.extend("university_gym");
     var ug = new Parse.Query(UG);
     ug.equalTo("objectId", gymId);
     ug.first({
     	 success: function(gym)
     	 {
     	 	var openTime = gym.get('openTime');
     	 	var closeTime = gym.get('closeTime');
     	 	$('#start_time1').val(openTime);
     	 	$('#end_time1').val(closeTime);
     	 }
     });
}

/*
*Get Equipment type
*/
function get_equipmentType()
{
    var current = Parse.User.current();
    var Room = Parse.Object.extend("gym_equipment_type");
    var q = new Parse.Query(Room);
    var c=1;
    //q.equalTo("universityGymId", current.get('universityGymId'));
    //q.include('gymId');
    q.find({
      success: function(results){
         for(i in results){
            var room = results[i];
            //var user = results[i].get('users');
            if(room)
            {
                $("#type").append(new Option(room.get('type'), room.id));
            }
            //console.log(university);
            //console.log(book.get("firstname")+ " " +book.get("name"));
          }
          
      }
    });
}

function getGymPercentage()
{
    //var current = Parse.User.current();
    var univ = Parse.Object.extend("university_gym");
    var Univ = new Parse.Query(univ);
    //Univ.equalTo("universityId", current.get('universityId'));
    Univ.find({
    	success:function(resultUniv)
    	{
		for(j in resultUniv)
		{
			var gId = resultUniv[j];
			var Slot =  Parse.Object.extend("room");
			var slot = new Parse.Query(Slot);
			
			slot.equalTo("universityGymId", gId.id);
			slot.include('gymId');
			slot.find({
			   success:function(result)
			   {
					console.log(gId.id);  
					var slide='';
					var total=0;
					var reserved = 0;
					var gymname='';
				  if(!jQuery.isEmptyObject(result))
				  {
					  
					  for(i in result)
					  {
						 
						 room=result[i];
						 if(room.get('allowOccupancy')==true)
						 {
						 gymname=room.get('gymId').get('name');
						 
						 total += room.get('totalOccupancy');
						 //reserved += (parseInt(room.get('male'))+parseInt(room.get('female'))); 
						 reserved += parseInt(room.get('reservedOccupancy'));
						 var percentage = ((parseInt(room.get('male'))+parseInt(room.get('female')))*100)/room.get('totalOccupancy');
						 percentage = parseInt(percentage);
						 }
					  }
					  
					  
					  total_perc = (parseInt((reserved*100)/total));
					  $('.gymsList').append('<li><h2>'+gymname+' : '+total_perc+'%</h2></li>');
				  }
			   }
			});
		}
    	}
    });
    
}

