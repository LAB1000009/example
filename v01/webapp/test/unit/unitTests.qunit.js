/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"jetCloud/PartnersEditor/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});