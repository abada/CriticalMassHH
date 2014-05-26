const ALERT = 'alert';
const CHAT = 'chat';

exports.init = function() {
	if (!Ti.Android || Ti.Platform.Android.API_LEVEL < 13 || Ti.Network.online == false) {
		Ti.UI.createNotification({
			message : 'Dieses Gerät kann zur Zeit keine Kurzbenachrichtigungen empfangen'
		}).show();
		return;
	}
	var Cloud = require('ti.cloud');
	Cloud.debug = false;
	var CloudPush = require('ti.cloudpush');
	//CloudPush.enabled = true;
	CloudPush.showTrayNotificationsWhenFocused = true;
	CloudPush.focusAppOnPush = false;
	CloudPush.retrieveDeviceToken({
		success : function(e) {
			Ti.App.Properties.setString('deviceToken', e.deviceToken);
			deviceToken = e.deviceToken;
			Cloud.Users.login({
				login : 'dummy',
				password : 'dummy'
			}, function(e) {
				if (e.success) {
					Cloud.PushNotifications.subscribe({
						channel : ALERT,
						device_token : deviceToken,
						type : 'android'
					}, function(e) {
						if (e.success) {
							Ti.UI.createNotification({
								message : 'Benachichtigungsdienst ist aktiviert.\nDu bekommst jetzt immer rechtzeitig den Treffpunkt zum CriticalMass mitgeteilt.'
							}).show();
							Cloud.PushNotifications.notify({
								channel : ALERT,
								friends : true,
								"to_ids" : "everyone",
								payload : {
									alert : 'Ein Radler mit einem ' + Ti.Platform.getModel() + ' hat sich zu cmHH angemeldet',
									title : 'cmHH hat einen neuen Mitmacher.',
									badget : '+1',
									sound : 'klingel',
									icon : 'ic_pn_newuser',
									vibrate : true
								}
							}, function(e) {
								if (e.success) {
									console.log('Info: push notification succed.');
									Ti.UI.createNotification({
										message : 'Andere Radler sind informiert.'
									}).show();
								} else {
									console.log('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
								}
							});

						} else {
							console.log('Error: subsribing of channel failed');
						}
					});

				}
			});

		},
		error : function(e) {
			Ti.UI.createNotification({
				message : 'Problem bei der Anmeldung zum Benachichtigungsdienst'
			}).show();
		}
	});

	CloudPush.addEventListener('callback', function(evt) {
		//	alert(evt.payload);
	});
	CloudPush.addEventListener('trayClickLaunchedApp', function(evt) {
		//Ti.API.info('Tray Click Launched App (app was not running)');
	});
	CloudPush.addEventListener('trayClickFocusedApp', function(evt) {
		//Ti.API.info('Tray Click Focused App (app was already running)');
	});
};

var fromdevice = {
	"version" : "v1",
	"friends" : "1",
	"channel" : "chat",
	"payload" : "{\"chattext\":\"test\",\"sound\":\"default\",\"title\":\"test\",\"userid\":\"19fd7b3b0e56e4df91c17ebb9eb8fc0b\",\"icon\":\"ic_pn_newuser\",\"android\":{\"vibrate\":true},\"device\":\"Nexus5\"}",
	"key" : "0gik53G7gLLbjll5uAVbkaFodx5HWYaL",
	"action" : "notify",
	"controller" : "push_notification",
	"format" : "json",
	"suppress_response_codes" : "true",
	"_session_id" : "rzJ-HSU6U0aa25RcK0rWlWE6BfA"
}; 

