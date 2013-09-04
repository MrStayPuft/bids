window.onload = function() {
	ieCheck();
};

function as(n) {
	var themeUrl = "../ext-3.4.0/resources/css/xtheme-wireframe.css";
	Ext.util.CSS.swapStyleSheet("theme", themeUrl);
};

Ext.onReady(function() {
	var store, check;

	var banks = [['African Development Bank'], ['Asian Development Bank'], ['Interamerican Development Bank'], ['Post Identified Project'], ['Washington Identified Project'], ['World Bank']]
	var regions = [['Africa'], ['East Asia and the Pacific'], ['Europe'], ['Middle East and North Africa'], ['South and Central Asia'], ['Western Hemisphere']]
	var arch = [['Archived'], ['In Procurement'], ['Pipeline']]
	var sizes = [['0-25M'], ['25-50M'], ['50-100M'], ['>100M'], ['Unpublished']]
	var sec = [['Ag and Environment'], ['Energy'], ['ICT'], ['Infrastructure'], ['Governance and Services'], ['Natural Resources']]

	var btn_sideNav1, btn_sideNav2, btn_sideNav3, btn_sideNav4, btn_sideNav5, sideNavText;
	
	var leadsSumValue, leadsWeekSumValue, leadsCount, leadsWeekCount, infCount, ictCount, ageCount, gosCount, narCount, eneCount;
	
	store = new GeoExt.data.FeatureStore({
		autoSave : true,
		fields : [{
			name : "int_allLeadsCount",
			type : "string"
		}, {
			name : "int_allLeadsValueSum",
			type : "string"
		}, {
			name : "int_weekLeadsCount",
			type : "string"
		}, {
			name : "int_weekSumValueLeads",
			type : "string"
		}, {
			name : "int_allSecCountInt",
			type : "string"
		}, {
			name : "int_allSecCountIct",
			type : "string"
		}, {
			name : "int_allSecCountAge",
			type : "string"
		}, {
			name : "int_allSecCountGos",
			type : "string"
		}, {
			name : "int_allSecCountNar",
			type : "string"
		}, {
			name : "int_allSecCountEne",
			type : "string"
		}],
		proxy : new GeoExt.data.ProtocolProxy({
			protocol : new OpenLayers.Protocol.HTTP({
				url : "http://" + domain + "/geoserver/opengeo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opengeo%3Atbl_dailyMetrics&maxfeatures=230&outputformat=json",
				format : new OpenLayers.Format.GeoJSON()
			})
		})//,
		//autoLoad : true
	});

	store.load();
	
	leadsSumValue = store.sum('int_allLeadsValueSum');
	leadsWeekSumValue = store.sum('int_weekSumValueLeads');
	leadsCount = store.sum('int_allLeadsCount');
	leadsWeekCount = store.sum('int_weekLeadsCount');
	infCount = store.sum('int_allSecCountInt');
	ictCount = store.sum('int_allSecCountIct');
	ageCount = store.sum('int_allSecCountAge');
	gosCount = store.sum('int_allSecCountGos');
	narCount = store.sum('int_allSecCountNar');
	eneCount = store.sum('int_allSecCountEne');
	
	noSideNavText(); 
	
	var enteringHttpProxy = new Ext.data.HttpProxy({
		url : 'servlet/Combo2',
		method : 'GET'
	});

	var regionHttpProxy = new Ext.data.HttpProxy({
		url : 'servlet/Combo2',
		method : 'GET'
	});

	var sectorHttpProxy = new Ext.data.HttpProxy({
		url : 'servlet/Combo2',
		method : 'GET'
	});

	var fundingHttpProxy = new Ext.data.HttpProxy({
		url : 'servlet/Combo2',
		method : 'GET'
	});

	var sourceHttpProxy = new Ext.data.HttpProxy({
		url : 'servlet/Combo2',
		method : 'GET'
	});

	var enteringStore = new Ext.data.Store({
		proxy : enteringHttpProxy,
		baseParams : {
			col : 'Submitting_Officer',
			label : 'EnteringOfficer'
		},

		reader : new Ext.data.XmlReader({
			record : 'Row',
			id : 'ID'
		}, ['EnteringOfficer'])
	});

	var regionStore = new Ext.data.Store({
		proxy : regionHttpProxy,
		baseParams : {
			col : 'DOS_Region',
			label : 'Region'
		},

		reader : new Ext.data.XmlReader({
			record : 'Row',
			id : 'ID'
		}, ['Region'])
	});

	var sectorStore = new Ext.data.Store({
		proxy : sectorHttpProxy,
		baseParams : {
			col : 'Sector',
			label : 'Sector'
		},

		reader : new Ext.data.XmlReader({
			record : 'Row',
			id : 'ID'
		}, ['Sector'])
	});

	var fundingStore = new Ext.data.Store({
		proxy : fundingHttpProxy,
		baseParams : {
			col : 'Project_Funding_Source',
			label : 'FundingSource'
		},

		reader : new Ext.data.XmlReader({
			record : 'Row',
			id : 'ID'
		}, ['FundingSource'])
	});

	var sourceStore = new Ext.data.Store({
		proxy : enteringHttpProxy,
		baseParams : {
			col : 'Source',
			label : 'Source'
		},

		reader : new Ext.data.XmlReader({
			record : 'Row',
			id : 'ID'
		}, ['Source'])
	});

	enteringStore.load();
	sectorStore.load();
	regionStore.load();
	fundingStore.load();

	var categorySelectedId;

	// MAIN PANEL
	var mainPanel = new Ext.FormPanel({
		region : "center",
		height : 500,
		autoWidth : true,
		html : '<div class="content"><div class="mainContent"><div style="text-align:center; padding-top: 20px"><div id="sideNavTextDiv"></div></div></div></div>'
	});
	
	// FOOTER PANEL
	var footerPanel = new Ext.FormPanel({
		region : "south",
		height : 70,
		html : '<div id="footer" style="margin-top: 0px !important;">Sponsored by: The U.S. Department of State<br>State Department has compiled this information in order to help identify opportunities for U.S. businesses.  It is not intended to be complete and interested parties should not solely rely on the information provided herein, and neither the U.S. Government not its employees/contractors assume any legal liability for the accuracy, completeness, or  usefulness of any information or process disclosed. It is the sole responsibility of the user of the information to verify its accuracy.</div>'
	});
	
	// SIDENAV PANEL
	var sideNavPanel = new Ext.FormPanel({
		frame : false,
		region : 'center',
		html : '<ul class="sideNav"><li id="sideNav1"><a href="javascript:displaySideNav1Text()">What is BIDS?</a></li><li id="sideNav2"><a href="javascript:displaySideNav2Text()">How does BIDS work?</a></li><li id="sideNav3"><a href="javascript:displaySideNav3Text()">Who is using BIDS?</a></li><li id="sideNav4"><a href="javascript:displaySideNav4Text()">Getting started with BIDS</a></li><li id="sideNav5"><a href="map.html">Map of leads</a></li><li id="sideNav6"><a href="javascript:displaySideNav6Text()">Disclaimer</a></li></ul></div>'
	});

	// Creates the Layout
	new Ext.Viewport({
		layout : "fit",
		hideBorders : true,
		autoHeight: true,
		autoScroll: false,
		minWidth: 1000,
		items : {
			layout : "border",
			items : [{
				region : 'north',
				html : '<div id="wrap"><div id="header"><div class="row" style="margin: 0px -12px 0px 7px;"><a class="logo" data-bind="click: showHome" href="#"/><img id="bidsLogo" alt="BIDS Logo" src="img/bidsLogo.png"></a><ul class="nav"><li><a href="mailto:BIDS-Mailbox@state.gov">Contact Us</a></li><li><a href="help.html">Help</a></li><li><a href="faqs.html">FAQs</a></li><li><a href="data.html">Data</a></li><li><a href="map.html">Leads Map</a></li><li><a href="index.html">Home</a></li></ul></div></div>',
				height : 121,
				maxWidth: 1200,
				border : true
			}, mainPanel, {
				layout : 'border',
				region : 'west',
				width : 195,
				items : [sideNavPanel]
			}, footerPanel]
		}
	});
});