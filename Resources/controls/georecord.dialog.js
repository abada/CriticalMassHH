exports.create = function() {
	if (!Ti.App.Properties.hasProperty('RECORD')) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Jawoll!'],
			message : 'Möchtest Du anonym Deine Position veröffentlichen? \n\nDann könnte jeder sehen, wo die CriticalMass gerade unterwegs ist',
			title : 'Position'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index >= 0) {
				Ti.App.fireEvent('startrecording');
				Ti.App.Properties.setString('RECORD', 'active');
			}
		});
		dialog.show();
	}
};
