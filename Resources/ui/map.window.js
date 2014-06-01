Ti.Map = require('ti.map');
exports.create = function() {
	var options = arguments[0] || {};
	var meetingpoint = null;
	var ready = false;
	var annotations = [];
	var self = require('vendor/window').create({
	});
	var radlertext = Ti.UI.createLabel({
		color : 'white',
		height : 20,
		textAlign : 'left',
		left : 10,
		bottom : 0,
		text : '',
		font : {
			fontSize : 10
		}
	});
	self.backgroundColor = 'black';
	self.add(radlertext);
	var mapoptions = {
		mapType : Ti.Map.NORMAL_TYPE,
		bottom : 20,
		enableZoomControls : false,
		region : {
			latitude : 53.553270540,
			longitude : 10.00963632,
			latitudeDelta : 0.1,
			longitudeDelta : 0.1
		},
		animate : true,
		regionFit : true,
		traffic:true,
		userLocation : true
	};
	self.mapview = Ti.App.SmartMap.getView(mapoptions);
	self.updatemeetingpointannotation = function(_payload) {
		if (meetingpoint != null) {
			self.mapview.removeAnnotation(meetingpoint);
			meetingpoint = null;
		}
		console.log('info: creation of annotation');
		meetingpoint = Ti.Map.createAnnotation({
			latitude : _payload.latlng.split(',')[0],
			longitude : _payload.latlng.split(',')[1],
			title : _payload.android.alert,
			image : '/assets/' + Ti.Platform.displayCaps.density + 'pin.png',
			subtitle : _payload.message
		});
		if (self.mapview) {
			self.mapview.addAnnotation(meetingpoint);
			self.mapview.selectAnnotation(meetingpoint);
			self.mapview.setRegion({
				latitude : _payload.latlng.split(',')[0],
				longitude : _payload.latlng.split(',')[1],
				latitudeDelta : 0.1,
				longitudeDelta : 0.1
			});
		} else {
			console.log('Error: no mapview');
		}
	};
	var maptype = Ti.UI.createButton({
		right : 5,
		bottom : 5,
		opacity : 0.8,
		zIndex : 9999,
		backgroundImage : '/assets/maptype.png',
		width : 40,
		height : 30
	});
	self.mapview.add(maptype);
	self.mapview.addEventListener('changed', function(_e) {
		radlertext.setText(_e.text);
	});
	self.addEventListener('focus', function() {
		if (!ready) {
			self.add(self.mapview);
			self.mapview.add(maptype);
			ready = true;
		}
	});
	if (Ti.App.Properties.hasProperty('USER') && Ti.App.Properties.hasProperty('POSITION')) {
		var payload = Ti.App.Properties.getObject('POSITION');
		self.updatemeetingpointannotation(payload);
	}
	var eventlistener = false;
	Ti.App.addEventListener('newposition', function(_e) {
		if (eventlistener == true) {
			return;
		}
		eventlistener = true;
		var dialog = Ti.UI.createAlertDialog({
			buttonNames : ['OK'],
			message : 'Treffpunkt:\n' + _e.android.alert + '\n\nInfo:\n' + _e.message + '\n\n' + _e.latlng,
			title : 'Neuer CM-Treff'
		});
		dialog.show();
		self.updatemeetingpointannotation(_e);
	});
	var micro = Ti.UI.createImageView({
		width : Ti.UI.FILL,
		height : 'auto',
		image : '/assets/micro.png',
		bottom : -1000,
		touchEnabled : false,
		zIndex : 9999,
	});
	self.add(micro);
	self.setRoute = function() {
		var routes = Ti.App.Sternfahrt.getAllRoutes();
		for (var i = 0; i < routes.length; i++) {
			self.mapview.addRoute(Ti.Map.createRoute(routes[i]));
		};
		self.remove(micro);
	};

	self.showMicro = function() {
		micro.animate({
			bottom : 0,
			duration : 700
		});
	};
	self.hideMicro = function() {
		micro.animate({
			bottom : -1000,
			duration : 700
		});
	};
	Ti.App.SmartMap.startCron();
	maptype.addEventListener('click', function() {
		var type = self.mapview.getMapType();
		console.log('A=' + type);
		type++;
		if (type == 5)
			type = 1;
		console.log('B=' + type);
		self.mapview.setMapType(type);
	});
	return self;
};

