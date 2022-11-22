jQuery.sap.registerModulePath("libs.jbBack", "/jetCloud/apps/jbcommon/zjblibs/js/jbBack");
jQuery.sap.registerModulePath("libs.formatter", "/jetCloud/apps/jbcommon/zjblibs/xsjs/jbFormatter");

sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	'sap/ui/core/Fragment',
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox", "libs/formatter", "libs/jbBack", "sap/m/MessageToast"

], function (BaseController, JSONModel, Filter, Fragment, FilterOperator, MessageBox, formatter, jbBack, MessageToast) {
	"use strict";

	return BaseController.extend("jetCloud.PartnersEditor.controller.Worklist", {

        _jbBack: new jbBack(),
		formatter: formatter,
		

		onInit: function () {
			var oViewModel;
			var oList = this.byId("list");
			this._aTableSearchState = [];

			oViewModel = new JSONModel({
				ItemsPassed: 0,
				EditMode: false,
				EditHistoryMode: false,
				busy: false,
				DetailBusy: false,
				delay: 0,
				CreateNew: false,
				PartnerName: '',
				ParentName: '',
				CreateEditMode: false,
				CreateNewItem: false,
				PartnerEditMode: false,
				DeactivateModeMaster: false,
				Instance: 1,
				Version: 'A',
				SelectedPartnerRoles: '',
				MultiToggle: false,
				ChangeOrderMode: false,
				Roles: "",
				PartnerID: 10001,
				CreateNewPartner: false,
				DeactivateMode: false,
				SelectedItems: 0,
				TabSelectedKey: 0,
				tableBusyDelay: 0,
				LogViewerNavButton: true,
				table: {
				selectionMode: "SingleSelectMaster",
				selectedItemsCount: 0,
				selectedLanguage: "RU"
			},
				LogViewer: {
					target: {
						semanticObject: "LogViewer",
						action: "Display"
					},
					params: {
						"Variant": "DocLogDetail",
						"Application": "jetCloud.PartnersEditor",
						"HideFilter": "false",
						"Module": "jbpartners",
						"WorkProcess": ""
					}
				}

			});
			this._oList = oList;
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
			this.setModel(oViewModel, "worklistView");
			this._oViewModel = oViewModel;
			
	//		this._jbBack = new BCBack(this);
			var that = this;
			this.RolesTable = [];
			that._jbBack.Init(this);
			this.getOwnerComponent().getModel().read("/vRoles", {
			  
				success: function (oData) {
					that.RolesTable = oData.results;
					that.onBeforeRendering();
				}
			});
		},
		onExit: function() {
			this._jbBack.HideFioriToolItems();
			this._jbBack.destroy();
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		// #################################  Header Begin ######################################	
		

		onNavigateToLogs: function (oEvent) {
			var aNavParams = this._oViewModel.getProperty("/LogViewer");
			this._jbBack.onNavigateToLogs(aNavParams);
		},

		onPressAdd: function (oEvent) {
			this.getRouter().navTo("object", {
				Instance: glbInstance,
				HdrID: "0",
				Version: glbVersion,
				CreateNew: true,
				DeactivateModeMaster: false
			});
		},
		onPressBack: function () {
			this._jbBack.onPressBack(History);
		},
		onPressEdit: function (oEvent) {
			this.byId("DetailPage").setHeaderExpanded(true);
			this._oViewModel.setProperty("/EditMode", true);
		},
		onPressCancel: function (oEvent) {
				this._jbBack.resetChanges();
				if (this._oViewModel.getProperty("/CreateNew")) {
					this.onPressBack();
				}
			}
			// #################################  Header End ######################################	

		// #################################  Detail Begin ######################################	
		,

		factoryPartnerList: function (sid, ocontext) {
			if (ocontext.getProperty("Roles") !== null) {
				var RolesArray = ocontext.getProperty("Roles").split(',');
			} else RolesArray = 0;

			var CustomListItem = new sap.m.CustomListItem();
			var HBox1 = new sap.m.HBox({
				height: "auto"
			});

			var VBox1_1 = new sap.m.VBox({
				width: "700px"
			});
			VBox1_1.addStyleClass("sapUiSmallMarginBegin");
			VBox1_1.addStyleClass("sapUiTinyMarginTop");
			VBox1_1.addStyleClass("sapUiTinyMarginBottom");

			var Label1_1 = new sap.m.Label({
				text: "{PartnerCode}-{PartnerName}"
			});
			Label1_1.addStyleClass("PartnerRowLabel");

			var Text1_1 = new sap.m.Text({
				text: "{PartnerDescription}"
			});
			Text1_1.addStyleClass("sapUiTinyMarginTop");
			Text1_1.addStyleClass("TextMaster");

			var HBox1New = new sap.m.HBox();
			var HBox1NewForIcons = new sap.m.HBox();

			HBox1New.addItem(Label1_1);

			HBox1NewForIcons.addStyleClass("sapUiTinyMarginEnd");
			HBox1NewForIcons.addStyleClass("sapUiTinyMarginTop");
			HBox1New.addItem(HBox1NewForIcons);
			VBox1_1.addItem(HBox1New);
			VBox1_1.addItem(Text1_1);

			var VBox1_2 = new sap.m.VBox({
				height: "100%"
			});
			VBox1_2.addStyleClass("divWithIconsAndEdit");

			var HBoxNew1 = new sap.m.HBox({

			});

			for (var i = 0; i < this.FilterRolesTable.length; i++) {

				if (RolesArray !== 0 && RolesArray.indexOf(this.FilterRolesTable[i].RoleID.toString()) !== -1) {
					var IconRole = new sap.ui.core.Icon({
						src: this.FilterRolesTable[i].RoleIcon,
						tooltip: this.FilterRolesTable[i].RoleName,
						size: "1rem",
						color: "Neutral"
					});
					IconRole.addStyleClass("sapUiTinyMarginEnd");
					IconRole.addStyleClass("MainRoleIcons");
					HBox1NewForIcons.addItem(IconRole);

				}

			}
			HBoxNew1.addItem(HBox1NewForIcons);
			var HBox1_2_1 = new sap.m.HBox({
				width: "100%",
				alignItems: "Start",
				justifyContent: "End",
				height: "auto"
			});

			var Icon1_2_1 = new sap.ui.core.Icon({
				src: "sap-icon://edit",
				size: "1.2rem",
				press: this.onPressPartnerEdit.bind(this),
				color: "Default",
				tooltip: "{i18n>ttEditPartner}"
			});

			Icon1_2_1.addStyleClass("sapUiTinyMarginEnd");
			Icon1_2_1.addStyleClass("sapUiTinyMarginBegin");

			HBox1_2_1.addItem(Icon1_2_1);
			HBox1_2_1.addStyleClass("HBox1_2_1");
			HBox1_2_1.addStyleClass("sapUiTinyMarginTop");
			HBoxNew1.addItem(HBox1_2_1);
			VBox1_2.addItem(HBoxNew1);
			HBox1.addItem(VBox1_1);
			HBox1.addItem(VBox1_2);

			CustomListItem.addContent(HBox1);
			return CustomListItem;

		},

		onSelectIconTabBar: function (oEvent) {
			this._oViewModel.setProperty("/TabSelectedKey", this.byId("itemsFilterIconTabBar").getSelectedKey());
			var RoleID = parseInt(this.byId("itemsFilterIconTabBar").getSelectedKey(), 10);
		//	sap.ui.getCore().byId("stf" + RoleID).removeAllContent();
			this.readGeneralData(this.byId("itemsFilterIconTabBar").getSelectedKey());
		},

		_applyFilterSearch: function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");

		},

		setIconTabFilterVisibility: function (Roles) {
			var oIconTabBar = this.byId("itemsFilterIconTabBar"),
				Roles = Roles.split(',');
			for (var i = 0; i < this.FilterRolesTable.length; i++) {
				sap.ui.getCore().byId("tf" + this.FilterRolesTable[i].RoleID).setVisible(false);
			}
			for (var i = 0; i < this.FilterRolesTable.length; i++) {
				if (Roles.indexOf(this.FilterRolesTable[i].RoleID.toString()) !== -1) {
					sap.ui.getCore().byId("tf" + this.FilterRolesTable[i].RoleID).setVisible(true);
				}

			}

		},

		onSelectionPartnerChange: function (oEvent) {
			this._oViewModel.setProperty("/SelectedItems", this.byId("list").getSelectedItems().length);
			this.Event = oEvent;
			this._oViewModel.setProperty("/Role0", 0);
			this._oViewModel.setProperty("/Role1", 0);
			this._oViewModel.setProperty("/Role2", 0);
			this._oViewModel.setProperty("/Role3", 0);
			this._oViewModel.setProperty("/Roles", oEvent.getParameter("listItem").getBindingContext().getProperty("Roles"));
			this.setIconTabFilterVisibility(oEvent.getParameter("listItem").getBindingContext().getProperty("Roles"));
			var PartnerID = oEvent.getParameter("listItem").getBindingContext().getProperty("PartnerID");
			var Instance = oEvent.getParameter("listItem").getBindingContext().getProperty("Instance");
			var Version = oEvent.getParameter("listItem").getBindingContext().getProperty("Version");

			this._oViewModel.setProperty("/PartnerID", PartnerID);
			this._oViewModel.setProperty("/PartnerName", oEvent.getParameter("listItem").getBindingContext().getProperty("PartnerName"));
			this._oViewModel.setProperty("/Instance", Instance);
			this._oViewModel.setProperty("/Version", Version);
			var PartnerRoleID;
			var that = this;

			this.getOwnerComponent().getModel().read("/vMasterRoles", {
				filters: [
					new Filter({
						path: "PartnerID",
						operator: FilterOperator.EQ,
						value1: PartnerID
					}),
				],
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						var RoleID = oData.results[i].RoleID;
						RoleID = parseInt(RoleID, 10);
						PartnerRoleID = oData.results[0].PartnerRoleID;

						sap.ui.getCore().byId("stf" + RoleID).removeAllContent();

						that._oViewModel.setProperty("/Role" + i, RoleID);
						if (!sap.ui.getCore().byId("l" + that._oViewModel.getProperty("/PartnerID") + that._oViewModel.getProperty("/Role" + i)) &&
							PartnerRoleID && oData.results.length - 1 === i) {
							that._oViewModel.setProperty("/TabSelectedKey", oData.results[0].RoleID.toString());
							that.byId("itemsFilterIconTabBar").setSelectedKey(oData.results[0].RoleID);

							
							that.readGeneralData(oData.results[0].RoleID);
						}
					}
				}
			});
            
            if (sap.ui.getCore().byId("tfFeedback") === undefined) {
			var IconTabFilter = new sap.m.IconTabFilter({
								id: "tfFeedback" ,
								icon: "",
								key: "Feedback",
								text: "Feedback",
								visible: true

							});
            }
            else {
            	var IconTabFilter = sap.ui.getCore().byId("tfFeedback");
            	IconTabFilter.destroyContent();
            }
                
		        
			
	
				
				sap.ui.require(["jbfeedback/JBFeedbackRTE"],
					function (JBFeedbackRTE) {
						var oFeedback = new JBFeedbackRTE({
							path: "/SectionsFeedbacks",
							likesPath: "/SectionsFeedbacksLikes",
							referenceId: PartnerID
						});
						IconTabFilter.addContent(oFeedback);
					}
				);
			
		
							that.byId("itemsFilterIconTabBar").addItem(IconTabFilter);

		},
		onSelectLanguageChange: function (oEvent) {
			
			this.onBeforeRendering();

		},
	
		factoryIconTabBar: function (sId, oContext) {
			var Visible;
			if (this._oViewModel.getProperty("/Roles") !== "") {
				if (this._oViewModel.getProperty("/Roles").split(',').indexOf(oContext.getProperty("RoleID").toString()) !== -1 && oContext.getProperty("Language")===this._oViewModel.getProperty("/table/selectedLanguage")) {
					Visible = true;
				} else Visible = false;
			}

			var IconTabFilter = new sap.m.IconTabFilter({
				id: "tf" + oContext.getProperty("RoleID"),
				icon: "{RoleIcon}",
				key: "{RoleID}",
				text: "{RoleName}",
				visible: Visible,
				iconColor: "{RoleColor}",
				tooltip: "{RoleName}"
			});

			var ScrollContainer = new sap.m.ScrollContainer({
				id: "stf" + oContext.getProperty("RoleID"),
				height: "100%",
				width: "100%",
				horizontal: false,
				vertical: true,
				busy: "{worklistView&gt;/DetailBusy}"
			});
			IconTabFilter.addContent(ScrollContainer);
			return IconTabFilter;

		},
		// #################################  Dialogs Begin ######################################	
		readGeneralData: function (Role) {
			this._oViewModel.setProperty("/DetailBusy", true);
			//sap.ui.getCore().byId("stf"+Role).removeAllContent();
			var that = this;
            if (Role !== "Feedback") {
			this.getOwnerComponent().getModel().read("/vMasterAttrTotal01", {
				filters: [
					new Filter({
						path: "PartnerID",
						operator: FilterOperator.EQ,
						value1: this._oViewModel.getProperty("/PartnerID")
					}),

					new Filter({
						path: "RoleID",
						operator: FilterOperator.EQ,
						value1: parseInt(Role, 10)
					}),
					 new Filter({
						path: "Language",
						operator: FilterOperator.EQ,
						value1:  this._oViewModel.getProperty("/table/selectedLanguage")
					})
				],
				success: function (oData) {
					var TotalArr = oData.results;
					that.generateRoleTabData(TotalArr, Role);
				}
			});}
			else this._oViewModel.setProperty("/DetailBusy", false);
			
		},

		generateRoleTabData: function (TotalArr, Role) {
			this.getView().getModel().setUseBatch(false);
			sap.ui.getCore().byId("stf" + Role).removeAllContent();
			var that = this;
			TotalArr = TotalArr.sort(function (a, b) {
				var nameA = a.GroupOrder,
					nameB = b.GroupOrder;
				var sortOrderA = a.SortOrder,
					sortOrderB = b.SortOrder;
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				if (nameA === nameB) {
					if (sortOrderA < sortOrderB) {
						return -1;
					}
					if (sortOrderA > sortOrderB) {
						return 1;
					} else return 0;
				} else return 0; // Никакой сортировки
			});

			for (var i = 0; i < TotalArr.length; i++) {

				this.InputListItem = new sap.m.InputListItem({ //создание отдельной строки

					label: '{AttributeName}',
					type: "Active",
					press: that.onSelectionAttribute.bind(that),
					highlight: "{= (${AttributeID} === '001') ? 'Indication05' : 'None'}"
				});

				var TextDate = new sap.m.Text({

					text: {
						path: "ValueDate",
						type: 'sap.ui.model.type.Date',
						formatOptions: {
							pattern: 'dd.MM.yyyy'
						}
					},
					visible: "{=${worklistView>/EditMode} !== true}"
				});
				this.InputListItem.addContent(TextDate);
				
				var TextDateTime = new sap.m.Text({

					text: {
						path: "ValueDateTime",
						type: 'sap.ui.model.type.DateTime',
						formatOptions: {
							pattern: 'dd.MM.yyyy HH:mm:ss'
						}
					},
					visible: "{=${worklistView>/EditMode} !== true}"
				});
				this.InputListItem.addContent(TextDateTime);
				
				var TextTime = new sap.m.Text({

					text: {
						path: "ValueTime",
						type: 'sap.ui.model.type.Time',
						formatOptions: {
							pattern: 'HH:mm:ss'
						}
					},
					visible: "{=${worklistView>/EditMode} !== true}"
				});
				this.InputListItem.addContent(TextTime);

				var Text = new sap.m.Text({

					text: "{ValueString}{ValueLargeString}{ValueDecimal}{ValueDecimal}",
					visible: "{=${worklistView>/EditMode} === false && (${ControlType} === 1 || ${ControlType} === 10 || ${ValueInteger} === 14 || ${ControlType} === 2 || ${ControlType} === 7 ) }",
					width: "auto",
					maxLines: "{= (${AttributeID} === 1401) ? 1 :  0}",
					textAlign: "End"
				});
				this.InputListItem.addContent(Text);
				
				
				var TextInt = new sap.m.Text({

					text: "{ValueInteger}",
					visible: "{=${worklistView>/EditMode} === false && ( ${ControlType} === 13 || ${ControlType} === 9) }",
					width: "auto",
					maxLines: "{= (${AttributeID} === 1401) ? 1 :  0}",
					textAlign: "End"
				});
				this.InputListItem.addContent(TextInt);
				// var TextInt = new sap.m.Text({

				// 	text: "{ValueInteger}",
				// 	visible: "{=${worklistView>/EditMode} !== true && ${ControlType} !== 'Website' && ${ControlType} !== 'Email' && ${TypeID} === 8}",
				// 	width: "auto",
				// 	maxLines: "{= (${AttributeID} === 1401) ? 1 :  0}",
				// 	textAlign: "End"
				// });
				// this.InputListItem.addContent(TextInt);

				var TextLink = new sap.m.Link({
					href: "http://{ValueLargeString}",
					text: "{ValueLargeString}",
					visible: "{=${worklistView>/EditMode} !== true && (${ControlType} === 6 || ${ControlType} === 8)}",
					target: "_blank"
				});
				TextLink.attachPress(function (oEvent) {
					sap.m.URLHelper.triggerEmail(that._getVal(oEvent), "Info Request");
				});
				this.InputListItem.addContent(TextLink);

				//------INPUT---------

				var Input = new sap.m.Input({ //создание конкретного типа ввода строки и заполнение значением
					maxLength: 128,
					value: "{ValueString}",
					width: "200px",
					visible: "{= (${ControlType} === 1) && ${worklistView>/EditMode} === true &&  ${LookUpType} === 0 }",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(Input); //добавление типа ввода в строку
				
				var InputURL = new sap.m.Input({ //создание конкретного типа ввода строки и заполнение значением
					maxLength: 2048,
					value: "{ValueLargeString}",
					width: "400px",
					visible: "{= (${ControlType} === 8) && ${worklistView>/EditMode} === true &&  ${LookUpType} === 0 }",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(InputURL);

				var ComboBox = new sap.m.ComboBox({ //создание конкретного типа ввода строки и заполнение значением

				//	selectedKey: "{ parts : [{path: 'TypeID'},{ path : 'ValueString'},{path: 'ValueLargeString'},{path: 'ValueBoolean'},{path: 'ValueDate'},{path: 'ValueDateTime'},{path: 'ValueTime'},{path: 'ValueDecimal'},{path: 'ValueInteger'}], formatter: '.formatComboBoxHistory'}", 
					width: "{= ${ControlType} === 2 ? '400px' : '200px'}",
					visible: "{= ${LookUpType} === 1  && ${worklistView>/EditMode} === true}",
					enabled: "{=${worklistView>/EditMode}}"
					});
				this.InputListItem.addContent(ComboBox); //добавление типа ввода в строку
				
				
				var ComboBoxFixed = new sap.m.ComboBox({ //создание конкретного типа ввода строки и заполнение значением

					selectedKey: "{ValueInteger}",
					
					width: "{= ${ControlType} === 2 ? '400px' : '200px'}",
					visible: "{= (${LookUpType} === 2 || ${LookUpType} === 3) && ${worklistView>/EditMode} === true}",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(ComboBoxFixed); //добавление типа ввода в строку
			
				//------EMAIL---------

				var InputEmail = new sap.m.Input({

					value: "{ValueLargeString}",
					placeholder: "Enter E-Mail ...",
					valueStateText: "E-Mail must be a valid email address.",
					type: "Email",
					width: "200px",
					visible: "{= ${ControlType} === 6  && ${worklistView>/EditMode} === true}",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(InputEmail);
				
				var InputStepInteger = new sap.m.StepInput({

					value: "{ValueInteger}",
					width: "200px",
					visible: "{= ${ControlType} === 9  && ${worklistView>/EditMode} === true}",
					enabled: "{=${worklistView>/EditMode}}",
					min: "{= Math.floor(${NumberMinValue})}",
					max: "{= Math.floor(${NumberMaxValue})}",
					step: "{= Math.floor(${NumberStep})}"
				});
				this.InputListItem.addContent(InputStepInteger);
				
				var InputStepDecimal = new sap.m.StepInput({

					value: "{ValueDecimal}",
					width: "200px",
					visible: "{= ${ControlType} === 10  && ${worklistView>/EditMode} === true}",
					enabled: "{=${worklistView>/EditMode}}",
					min: "{= Math.floor(${NumberMinValue})}",
					max: "{= Math.floor(${NumberMaxValue})}",
					step: "{= Math.floor(${NumberStep})}"
				});
				this.InputListItem.addContent(InputStepDecimal);

				//------SWITCH---------

				var InputSwitch = new sap.m.Switch({

					customTextOn: "Да",
					customTextOff: "Нет",
					state: "{=(${ValueBoolean} === 'X')}",
					visible: "{= (${ControlType} === 12)  && ${worklistView>/EditMode} === true}",
					enabled: "{=${worklistView>/EditMode}}",
					change: this.onSelectSwitch
				});
				this.InputListItem.addContent(InputSwitch);

				//------InputTextArea---------

				var InputTextArea = new sap.m.Input({
					maxLength: 5000,
					value: "{ValueLargeString}",
					width: "400px",
					visible: "{= ${ControlType} === 2 && ${worklistView>/EditMode} === true && ${LookUpType} === 0}",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(InputTextArea);

				//------DatePicker---------

				var InputDate = new sap.m.DatePicker({

					value: {
						path: "ValueDate",
						type: 'sap.ui.model.type.Date',
						formatOptions: {
							pattern: 'dd.MM.yyyy',
							UTC: true
						}
					},
					visible: "{= ${ControlType} === 3 && ${worklistView>/EditMode} === true}",
					width: "200px",
					valueFormat: "dd.MM.yyyy",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(InputDate);
				
				var InputDateTime = new sap.m.DateTimePicker({

					value: {
						path: "ValueDateTime",
						type: 'sap.ui.model.type.DateTime',
						formatOptions: {
							pattern: 'dd.MM.yyyy HH:mm:ss',
							UTC: true
						}
					},
					visible: "{= ${ControlType} === 4 && ${worklistView>/EditMode} === true}",
					width: "200px",
					valueFormat: "dd.MM.yyyy HH:mm:ss",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(InputDateTime);
				
				var InputTime = new sap.m.TimePicker({

					value: {
						path: "ValueTime"
					},
					visible: "{= ${ControlType} === 5 && ${worklistView>/EditMode} === true}",
					width: "200px",
                    valueFormat: "YYYY-MM-DD HH:MM:SS",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(InputTime);

				//------Phone---------		

				var MaskInput = new sap.m.Input({

					value: "{ValueString}",
					width: "200px",
					placeholder: "Enter phone number",
					visible: "{= ${ControlType} === 7 && ${worklistView>/EditMode} === true}",
					enabled: "{=${worklistView>/EditMode}}"
				});
				this.InputListItem.addContent(MaskInput);

				//------INPUTРHISTOR---------

				var InputDateHistory = new sap.m.DatePicker({

					value: {
						path: "PartnerAttributeDateFrom",
						type: 'sap.ui.model.type.Date',
						formatOptions: {
							pattern: 'dd.MM.yyyy',
							UTC: true
						}
					},
					visible: "{= ${worklistView>/EditMode} === true && ${SupportHistory} === 'X'}",
					width: "130px",
					valueFormat: "dd.MM.yyyy",
					enabled: "{=${worklistView>/EditMode}}"
				});
				InputDateHistory.addStyleClass("sapUiSmallMarginBegin");
				this.InputListItem.addContent(InputDateHistory);

				var HistoryButton = new sap.ui.core.Icon({

					src: "sap-icon://history",
					color: "{= ${HistorySign} === 'X' ? 'Default' : 'Neutral'}",
					visible: "{= ${worklistView>/EditMode} !== true && ${worklistView>/ChangeOrderMode} !== true && ${SupportHistory} === 'X'}",
					press: this.gettingHistoryData.bind(this),
					tooltip: "{i18n>ttHistory}"
				});
				this.InputListItem.addContent(HistoryButton);

				var IncreaseAttrButton = new sap.ui.core.Icon({

					src: "sap-icon://slim-arrow-up",
					color: 'Default',
					visible: "{= ${worklistView>/EditMode} !== true && ${worklistView>/ChangeOrderMode} === true}",
					press: that.onPressIncreaseOrder.bind(that),
					activeColor: "#FFFFFF",
					activeBackgroundColor: "Contrast",
					width: "25px",
					height: "20px",
					tooltip: "{i18n>ttMoveUpAttr}"
				});
				IncreaseAttrButton.addStyleClass("IncreaseAttrButton");

				var DecreaseAttrButton = new sap.ui.core.Icon({

					src: "sap-icon://slim-arrow-down",
					color: 'Default',
					visible: "{= ${worklistView>/EditMode} !== true && ${worklistView>/ChangeOrderMode} === true}",
					press: that.onPressDecreaseOrder.bind(that),
					activeColor: "#FFFFFF",
					activeBackgroundColor: "Contrast",
					width: "25px",
					height: "20px",
					tooltip: "{i18n>ttMoveDownAttr}"

				});

				var deleteAttrButton = new sap.ui.core.Icon({
					src: "sap-icon://sys-minus",
					visible: "{= ${worklistView>/EditMode} === true}",
					color: "Default",
					height: "30px",
					tooltip: "{i18n>ttDeleteAttr}"

				});
				deleteAttrButton.attachPress(function (oEvent) {
					var oRequest = oEvent.getSource().getBindingContext().sPath;
					MessageBox.confirm(
						that.getResourceBundle().getText("confRemoveItem"), {
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									var oBatch = true;
									that._oViewModel.setProperty("/busy", true);
									that.getView().getModel().setUseBatch(oBatch);
									that.getView().getModel().remove(oRequest, {
										success: that.DeleteHistorySuccess.bind(that),
										error: that.DeleteHistoryError.bind(that),
										async: true
									});
								}
							}
						});
				});

				var HistoryBox = new sap.m.HBox({
					width: "20px",
					displayInline: true,
					justifyContent: "Center",
					alignItems: "Center"
				});
				HistoryBox.addItem(HistoryButton);
				HistoryBox.addItem(deleteAttrButton);
				HistoryBox.addItem(IncreaseAttrButton);
				HistoryBox.addItem(DecreaseAttrButton);
				HistoryBox.addStyleClass("sapUiTinyMarginBegin");
				HistoryBox.addStyleClass("HistoryBox");
				this.InputListItem.addContent(HistoryBox);

				if (i === TotalArr.length - 1) {
					this.createGroupList(TotalArr[i], Role);
				} else if (TotalArr[i].ParentID !== TotalArr[i + 1].ParentID) {
					this.createGroupList(TotalArr[i], Role);
				}
			}
			this._oViewModel.setProperty("/DetailBusy", false);
		},

		createGroupList: function (TotalArr, Role) {

			var oSorter = new sap.ui.model.Sorter('SortOrder');
			var Title = new sap.m.Title({
				text: " "
			});
			var TextGroupDescription = new sap.m.Text({
				visible: "{=  ${worklistView>/EditMode} !== true}"
			});
			var InputDescription = new sap.m.Input({
				width: "200px",
				visible: "{= ${worklistView>/ChangeOrderMode} !== true && ${worklistView>/EditMode} === true}",
			});
			var ToolbarSpacer = new sap.m.ToolbarSpacer({});
			var OverflowToolbar = new sap.m.OverflowToolbar({});
			var buttonIncreaseOrder = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://navigation-up-arrow",
				visible: "{= ${worklistView>/ChangeOrderMode} === true}",
				press: this.onPressIncreaseOrderGroup.bind(this),
				enabled: true,
				tooltip: "{i18n>ttMoveUpGroup}"
			});
			var buttonDecreaseOrder = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://navigation-down-arrow",
				visible: "{= ${worklistView>/ChangeOrderMode} === true}",
				press: this.onPressDecreaseOrderGroup.bind(this),
				enabled: true,
				tooltip: "{i18n>ttMoveDownGroup}"
			});
			var buttonDeleteGroup = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://sys-minus",
				visible: "{= ${worklistView>/EditMode} === true}",
				press: this.onPressDeleteGroup.bind(this),
				tooltip: "{i18n>ttDeleteGroup}"
			});

			var buttonAddAttribute = new sap.m.OverflowToolbarButton({
				icon: "sap-icon://add-activity",
				visible: "{= ${worklistView>/EditMode} === true}",
				press: this.onPressAddAttribute.bind(this),
				tooltip: "{i18n>ttAddAttribute}"
			});
			OverflowToolbar.addContent(Title);
			OverflowToolbar.addContent(InputDescription);
			OverflowToolbar.addContent(TextGroupDescription);
			OverflowToolbar.addContent(ToolbarSpacer);
			buttonIncreaseOrder.addStyleClass("Sticky");
			OverflowToolbar.addContent(buttonIncreaseOrder);
			OverflowToolbar.addContent(buttonDecreaseOrder);
			OverflowToolbar.addContent(buttonAddAttribute);
			OverflowToolbar.addContent(buttonDeleteGroup);

			var List = new sap.m.List({ //создание списка
				headerText: TotalArr.ParentName,
				mode: "SingleSelectMaster",
				itemPress: this.onSelectionAttribute.bind(this),
				updateFinished: this.updateFinishedGroupList.bind(this),
				items: {
					path: '/vMasterAttrTotal01',
					sorter: oSorter,
					filters: [new Filter({
						path: "PartnerID",
						operator: FilterOperator.EQ,
						value1: this._oViewModel.getProperty("/PartnerID")
					}), new Filter({
						path: "RoleID",
						operator: FilterOperator.EQ,
						value1: Role
					}), new Filter({
						path: "ParentID",
						operator: FilterOperator.EQ,
						value1: TotalArr.ParentID
					}), new Filter({
						path: "Language",
						operator: FilterOperator.EQ,
						value1:  this._oViewModel.getProperty("/table/selectedLanguage")
					})],
					template: this.InputListItem
				}
			});
			List.setHeaderToolbar(OverflowToolbar);
			if (this.InputListItem && List) {
				sap.ui.getCore().byId("stf" + parseInt(Role, 10)).addContent(List);
			}
		},

		onSelectionAttribute: function (oEvent) {
			if (!this.AttrID) {
				this.AttrID = '';
			}
			if (!this.SelectedList) {
				this.SelectedList = '';
			}
			if (this.SelectedList !== oEvent.getSource().getId()) {
				for (var i = 0; i < oEvent.getSource().oParent.oParent.getParent().oSelectedItem.getContent()[0].getContent().length; i++) {
					if (oEvent.getSource().oParent.oParent.getParent().oSelectedItem.getContent()[0].getContent()[i].getId() !== oEvent.getSource().getId()) {
						oEvent.getSource().oParent.oParent.getParent().oSelectedItem.getContent()[0].getContent()[i].removeSelections();
					}
				}
				this.SelectedList = oEvent.getSource().getId();
			}
			if (oEvent.getParameters().listItem.getId() === this.AttrID) {
				oEvent.getParameters().listItem.setSelected(false);
				this.AttrID = '';
			} else {
				this.AttrID = oEvent.getParameters().listItem.getId();
			}
		},

		onPressDecreaseOrder: function (oEvent) {
			this.CurrentUpdateList = oEvent.getSource().getParent().getParent().getParent();
			this.getModel().setUseBatch(true);
			this.CurrentUpdateList.setBusy(true);
			this.CurrentUpdateList.setBusyIndicatorDelay(0);
			this.getModel().setProperty(oEvent.getSource().getParent().getBindingContext() + "/" + "Version", '9');
			this.getModel().submitChanges({
				success: this._DecreaseIncreaseOrderSuccess.bind(this),
				error: this._DecreaseIncreaseOrderSuccess.bind(this)
			});

			this.getModel().submitChanges();
		},
		onPressIncreaseOrder: function (oEvent) {

			this.CurrentUpdateList = oEvent.getSource().getParent().getParent().getParent();
			this.getModel().setUseBatch(true);
			this.CurrentUpdateList.setBusy(true);
			this.CurrentUpdateList.setBusyIndicatorDelay(0);
			this.getModel().setProperty(oEvent.getSource().getParent().getBindingContext() + "/" + "Version", '1');
			this.getModel().submitChanges({
				success: this._DecreaseIncreaseOrderSuccess.bind(this),
				error: this._DecreaseIncreaseOrderSuccess.bind(this)
			});
		},

		_DecreaseIncreaseOrderSuccess: function () {
			this.CurrentUpdateList.setBusy(false);
		},
		onPressDecreaseOrderGroup: function (oEvent) {
			this._oViewModel.setProperty("/DetailBusy", true);
			var that = this;
			this.getModel().setProperty(oEvent.getSource().getParent().getParent().getItems()[0].getBindingContext() + "/" + "Version", '8');
			this.getModel().setUseBatch(true);
			this.getModel().submitChanges({
				success: that._DecreaseIncreaseOrderGroupSuccess.bind(that),
				error: that._DecreaseIncreaseOrderGroupSuccess.bind(that)
			});
		},
		ClearTabConteiners: function () {
			for (var i = 0; i < this.FilterRolesTable.length; i++) {
				sap.ui.getCore().byId("stf" + this.FilterRolesTable[i].RoleID).removeAllContent();
			}
		},
		_AddGroupSuccess: function () {
			this._oDialogAddGroup.destroy();
			this._oDialogAddGroup = null;
			this.ClearTabConteiners();
			this.byId("itemsFilterIconTabBar").fireSelect();
			//	this._oViewModel.setProperty("/DetailBusy", false);
		},
		_DecreaseIncreaseOrderGroupSuccess: function () {
			this.byId("itemsFilterIconTabBar").fireSelect();
			this.getModel().setUseBatch(false);
		},
		
		_DeleteGroupSuccess  : function () {
			this.byId("itemsFilterIconTabBar").fireSelect();
			this.getModel().setUseBatch(false);
			MessageToast.show(this.getResourceBundle().getText("msgRemovedSuccess"));
		},
		_DeleteGroupError  : function () {
			this.byId("itemsFilterIconTabBar").fireSelect();
			this.getModel().setUseBatch(false);
			MessageToast.show(this.getResourceBundle().getText("msgRemovedError"));
		},

		onPressIncreaseOrderGroup: function (oEvent) {
			this._oViewModel.setProperty("/DetailBusy", true);
			this.ClearTabConteiners();
			var that = this;
			this.getModel().setUseBatch(true);
			this.getModel().setProperty(oEvent.getSource().getParent().getParent().getItems()[0].getBindingContext() + "/" + "Version", '2');
			this._oViewModel.setProperty("/DetailBusy", true);
			this.getModel().submitChanges({
				success: that._DecreaseIncreaseOrderGroupSuccess.bind(that),
				error: that._DecreaseIncreaseOrderGroupSuccess.bind(that)
			});
		},
		ExecSpActionMulti: function (oBusyFlag, oTable, oNewID, fnRequest, oBatch, oShowErrorPopup, fnAfterCreateEvent,
			fnAfterCreateErrorEvent) {
			var that = this;
			var sPath = "/vSpActions";
			var aSelectedItemsCount = 0;
			if (oBatch === undefined) {
				oBatch = true;
			}
			if (oTable.getSelectedItems) {
				aSelectedItemsCount = oTable.getSelectedItems().length;
			} else if (oTable.getSelectedIndices) {
				aSelectedItemsCount = oTable.getSelectedIndices().length;
			}

			if (oBusyFlag) {
				that._oViewModel.setProperty("/busy", true);
			}

			this.getView().getModel().setUseBatch(oBatch);
			this.getView().getModel().setDeferredGroups(this.getView().getModel().getDeferredGroups().concat(["MultiPost"]));
			for (var i = 0; i < aSelectedItemsCount; i++) {
				var aEntry = {};
				if (oTable.getSelectedItems) {
					aEntry = fnRequest(oTable.getSelectedItems()[i].getBindingContext());
				} else if (oTable.getSelectedIndices) {
					aEntry = fnRequest(oTable.getContextByIndex(oTable.getSelectedIndices()[i]));
				}

				// aEntry.Instance = glbInstance.toString();
				// aEntry.Language = this._jbBack.getLanguage();
				// aEntry.Version = glbVersion.toString();
				aEntry.SessionID = oNewID;
				aEntry.iUserID = this._jbBack.getUser(); //sap.ushell.Container.getService("UserInfo").getId();

				this.SetEHParams(aEntry.SessionID, aEntry.ApplicationID, aEntry.ModuleID, aEntry.SubmoduleID, aEntry.ObjectID, aEntry.iParam1,
					aEntry.MessageText, aEntry.LongMessageText, aEntry.iUserID);

				this.getModel().create(sPath, aEntry, {
					success: function (oData, oResponse) {
						if (oBusyFlag) {
							that._oViewModel.setProperty("/busy", false);
						}
						if (fnAfterCreateEvent !== undefined) {
							fnAfterCreateEvent(oData, oResponse);
						}
					},
					error: function (oError) {
						if (oBusyFlag) {
							that._oViewModel.setProperty("/busy", false);
						}
						if (oShowErrorPopup !== undefined && typeof (oShowErrorPopup) !== 'boolean' && oShowErrorPopup) {
							that.ShowErrorPopup(oError, aEntry);
						}
						if (fnAfterCreateErrorEvent !== undefined) {
							fnAfterCreateErrorEvent(oError);
						}
					},
					async: true,
					groupId: "MultiPost"
				});

			}
			this.getModel().submitChanges({
				success: function () {
					that._AddGroupSuccess();
					that.getView().getModel().setUseBatch(false);
					// that.getView().getModel().setDeferredGroups([]);
				},
				groupId: "MultiPost"
			});

		},

		onPressAddGroupDialogSave: function (oEvent) {
			if (sap.ui.core.Fragment.byId("AddGroup", "lGroups").getSelectedItems().length === 0) {
				MessageBox.warning(this.getResourceBundle().getText("confNotSelectedGroups"));
			} else {
				this._jbBack.getNewID(this._onPressAddGroupPrev.bind(this));
				this._oViewModel.setProperty("/DetailBusy", true);
			};
		},
		_onPressAddGroupPrev: function (oNewID) {
			var oList = sap.ui.core.Fragment.byId("AddGroup", "lGroups");
			this._ProgressIndicatorCurrent = 0;
			this._ProgressIndicatorTotal = oList.getSelectedItems().length;
			this.ExecSpActionMulti(true, oList, oNewID, this._onPressAddGroup.bind(this), true, null);
		},

		_onPressAddGroup: function (oSelectedItems) {
			var aEntry = {};
			aEntry.ActionID = "AddGroup";
			aEntry.iParam1 = this._oViewModel.getProperty("/PartnerID").toString();
			aEntry.iParam2 = this._oViewModel.getProperty("/TabSelectedKey").toString();
			aEntry.iParam3 = oSelectedItems.getProperty("AttributeID").toString();
			aEntry.ApplicationID = "12313";
			aEntry.ModuleID = "jbpartners";
			aEntry.ProjectID = "jetCloud";
			aEntry.SubModuleID = "";
			return aEntry;
		},

		onPressDeleteGroup: function (oEvent) {
			var that = this;
			this.RoleID = oEvent.getSource().getParent().getParent().getItems()[0].getBindingContext().getProperty(
				"RoleID");
			this.ParentID = oEvent.getSource().getParent().getParent().getItems()[0].getBindingContext().getProperty(
				"ParentID");
			this.PartnerID = oEvent.getSource().getParent().getParent().getItems()[0].getBindingContext().getProperty(
				"PartnerID");
			MessageBox.confirm(
				this.getResourceBundle().getText("confRemoveGroup"), {
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that._jbBack.getNewID(that._onPressDeleteGroup.bind(that));
						}
					}
				});
		},
		_onPressDeleteGroup: function (oNewID) {
			var aEntry = {};
			aEntry.ActionID = "DeleteGroup";
			aEntry.iParam1 = this.RoleID.toString();
			aEntry.iParam2 = this.ParentID.toString();
			aEntry.iParam3 = this.PartnerID.toString();
			aEntry.SessionID = oNewID;
			aEntry.ApplicationID = "12313";
			aEntry.ModuleID = "jbpartners";
			aEntry.ProjectID = "jetCloud";
			aEntry.SubModuleID = "";
			this.ExecSpAction(true, aEntry, true, this._DeleteGroupSuccess.bind(this), this._DeleteGroupError.bind(this));
		},
		ExecSpAction: function (oBusyFlag, oParams, oShowErrorPopup, fnAfterCreateEvent, fnAfterCreateErrorEvent, oBatch) {
			var that = this;
			if (oBusyFlag) {
				that._oViewModel.setProperty("/busy", true);
			}
			if (oBatch === undefined) {
				oBatch = true;
			}
			this.SetEHParams(oParams.SessionID, oParams.ApplicationID, oParams.ModuleID, oParams.ActionID, oParams.iParam1, oParams.MessageText,
				oParams.LongMessageText, oParams.iUserID);

			var sPath = "/vSpActions";
			this.getView().getModel().setUseBatch(oBatch);
			this.getModel().create(sPath, oParams, {
				success: function (oData, oResponse) {
					if (oBusyFlag) {
						that._oViewModel.setProperty("/busy", false);
					}
					if (fnAfterCreateEvent !== undefined) {
						fnAfterCreateEvent(oData, oResponse);
					} else {
						that._jbBack._Showi18nMsgToast("infExecuted");

					}
				},
				error: function (oError) {
					if (oBusyFlag) {
						that._oViewModel.setProperty("/busy", false);
					}
					if (oShowErrorPopup !== undefined && typeof (oShowErrorPopup) !== 'boolean' && oShowErrorPopup) {
						that.oShowErrorPopup(oError, oParams);
					}
					if (fnAfterCreateErrorEvent !== undefined) {
						fnAfterCreateErrorEvent(oError);
					}
				},
				async: true
			});
		},

		SetEHParams: function (oProcessID, oApplication, oModule, oSubmodule, oSource, WorkProcess, oMessageText, oLongMessageText, oUserID) {
			if (this._ErrorHandler !== undefined) {
				this._ErrorHandler.SetEHParams(oProcessID, oApplication, oModule, WorkProcess, oMessageText, oLongMessageText, oUserID);
			}
		},

		createHistoryList: function (TotalHistoryArr, AttributeID, PartnerRoleID, AttributeName, ParentName, ParentID) {
			var that = this;
			this.Attribute = AttributeID;
			this.PartnerRole = PartnerRoleID;
			this.ParentID = ParentID;

			if (this._createDialog !== undefined) {
				this._createDialog.destroy();
			}
			this._createDialog = new sap.m.Dialog({
				id: "createDialog",
				contentWidth: "800px",
				contentHeight: "250px",
				draggable: true,
				resizable: true,
				showHeader: true,
				busy: "{worklistView>/busy}",
				busyIndicatorDelay: "{worklistView>/delay}"
			});

			var dialogPage = new sap.m.Page({
				id: "createDialogPage",
				showHeader: false
			});
			var ToolbarSpacer = new sap.m.ToolbarSpacer({
				id: "ToolbarSpacer"
			});
			var addButton = new sap.m.OverflowToolbarButton({
				id: "addButton",
				icon: "sap-icon://add",

				visible: true,

				enabled: "{=${worklistView>/EditHistoryMode} !== true}",
				tooltip: "{i18n>ttAddHistory}"
			});

			var editButton = new sap.m.OverflowToolbarButton({
				id: "editButton",
				icon: "sap-icon://edit",

				visible: true,
				enabled: "{=${worklistView>/EditHistoryMode} !== true}",
				tooltip: "{i18n>ttEdit}"
			});
			editButton.attachPress(function (oEvent) {
				that._oViewModel.setProperty("/EditHistoryMode", true);
			});

			addButton.attachPress(function (oEvent) {

				that.getModel().createEntry("vMasterAttrHistory", {
					properties: {
						PartnerRoleID: that.PartnerRole,
						PartnerAttributeID: 0,
						Instance: 1,
						Version: 'A',
						PartnerAttributeDateFrom: new Date(),
						AttributeID: that.Attribute,
						ParentID: that.ParentID,
						HistorySign: 'X'
					}
				});
				that._submitHistoryAdd();
			});

			var OverflowToolbar = new sap.m.OverflowToolbar({
				id: "OverflowToolbar"
			});

			var footerToolbar = new sap.m.Toolbar({
				id: "footerToolbar"
			});
			var footerToolbarSpacer = new sap.m.ToolbarSpacer({
				id: "footerToolbarSpacer"
			});

			var buttonSave = new sap.m.Button({ /////!!!!!!!!!!!!!!!!!!
				id: "buttonSave",
				text: "{@i18n>btnSave}",
				icon: "sap-icon://save",
				type: "Accept",
				visible: "{=${worklistView>/EditHistoryMode} === true}",
				tooltip: "{i18n>ttSave}"
			});
			buttonSave.attachPress(function () {
				that._oViewModel.setProperty("/busy", true);
				that._jbBack._submitChanges(that._submitHistoryChangesSuccess.bind(that), that._submitHistoryChangesError.bind(that));
			});
			var buttonClose = new sap.m.Button({
				id: "buttonClose",
				text: "{@i18n>btnClose}",

				type: "Default",
				tooltip: "{i18n>ttClose}"
			});
			buttonClose.attachPress(function () {
				if (this.getModel().hasPendingChanges()) {
					MessageBox.confirm(
						that.getResourceBundle().getText("confDeclineChanges"), {
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.OK) {
									that._oViewModel.setProperty("/EditHistoryMode", false);
									that.getOwnerComponent().getModel().resetChanges();
									that.byId("itemsFilterIconTabBar").fireSelect();
									that._createDialog.close();
									that._createDialog.destroy();
								}
							}
						});
				} else {
					that._createDialog.close();
					that._createDialog.destroy();
					that._oViewModel.setProperty("/EditHistoryMode", false);
				}

			});

			var buttonCancel = new sap.m.Button({
				id: "buttonCancel",
				text: "{@i18n>btnCancel}",
				icon: "sap-icon://cancel",
				type: "Reject",
				visible: "{=${worklistView>/EditHistoryMode} === true}",
				tooltip: "{i18n>ttCancel}"
			});

			buttonCancel.attachPress(function () {
				if (that._oViewModel.getProperty("/EditHistoryMode")) {
					that._oViewModel.setProperty("/EditHistoryMode", false);
					that.getOwnerComponent().getModel().resetChanges();
					that.byId("itemsFilterIconTabBar").fireSelect();
				} else {
					that.getOwnerComponent().getModel().resetChanges();
					that.byId("itemsFilterIconTabBar").fireSelect();
					that._createDialog.close();
					that._createDialog.destroy();
				}
			});

// 			for (var i = 0; i < TotalHistoryArr.length; i++) {

// 				this.InputHistoryListItem = new sap.m.InputListItem({ //создание отдельной строки
// 				});

// 				//----------------------Лейбл С Edit-------------------------------Нужно сделать языкозависимым
// 				var LabelFromEdit = new sap.m.Label({
// 					text: "C",
// 					visible: "{=${worklistView>/EditHistoryMode} === true}"

// 				});
// 				LabelFromEdit.addStyleClass("HistoryLabelsEdit");
// 				this.InputHistoryListItem.addContent(LabelFromEdit);
// 				//----------------------Лейбл С Edit End-------------------------------
// 				//----------------------Лейбл С-------------------------------Нужно сделать языкозависимым
// 				var LabelFrom = new sap.m.Label({
// 					text: "C",
// 					visible: "{=${worklistView>/EditHistoryMode} !== true}"

// 				});
// 				LabelFrom.addStyleClass("HistoryLabels");
// 				this.InputHistoryListItem.addContent(LabelFrom);
// 				//----------------------Лейбл С End-------------------------------

// 				//----------------------Ввод даты С-------------------------------
// 				var InputDateFrom = new sap.m.DatePicker({
// 					value: {
// 						path: "PartnerAttributeDateFrom",
// 						type: 'sap.ui.model.type.Date',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy',
// 							UTC: true
// 						}
// 					},

// 					width: "130px",
// 					valueFormat: "dd.MM.yyyy",
// 					visible: "{=${worklistView>/EditHistoryMode} === true}"

// 				});
// 				InputDateFrom.addStyleClass("InputDateFrom");
// 				InputDateFrom.addStyleClass("sapUiTinyMarginBegin");
// 				this.InputHistoryListItem.addContent(InputDateFrom);
// 				//----------------------Ввод даты С End-------------------------------
// 				//----------------------Текст даты С-------------------------------
// 				var TextDateFrom = new sap.m.Text({
// 					text: {
// 						path: "PartnerAttributeDateFrom",
// 						type: 'sap.ui.model.type.Date',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy'
// 						}
// 					},
// 					visible: "{=${worklistView>/EditHistoryMode} !== true}"
// 				});
// 				TextDateFrom.addStyleClass("InputDateFrom");
// 				TextDateFrom.addStyleClass("sapUiTinyMarginBegin");
// 				TextDateFrom.addStyleClass("HistoryText");
// 				this.InputHistoryListItem.addContent(TextDateFrom);
// 				//----------------------Текст даты С End-------------------------------

// 				//----------------------Лейбл По Edit-------------------------------Нужно сделать языкозависимым
// 				var LabelToEdit = new sap.m.Label({
// 					text: "По",
// 					visible: "{=${worklistView>/EditHistoryMode} === true}"

// 				});
// 				LabelToEdit.addStyleClass("HistoryLabelsEdit");
// 				LabelToEdit.addStyleClass("sapUiTinyMarginBegin");
// 				this.InputHistoryListItem.addContent(LabelToEdit);
// 				//----------------------Лейбл По Edit End-------------------------------
// 				//----------------------Лейбл По-------------------------------Нужно сделать языкозависимым
// 				var LabelTo = new sap.m.Label({
// 					text: "По",
// 					visible: "{=${worklistView>/EditHistoryMode} !== true}"

// 				});
// 				LabelTo.addStyleClass("sapUiTinyMarginBegin");
// 				LabelTo.addStyleClass("HistoryLabels");
// 				this.InputHistoryListItem.addContent(LabelTo);
// 				//----------------------Лейбл По End-------------------------------

// 				//----------------------Ввод даты По-------------------------------
// 				var InputDateTo = new sap.m.DatePicker({
// 					value: {
// 						path: "PartnerAttributeDateTo",
// 						type: 'sap.ui.model.type.Date',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy',
// 							UTC: true
// 						}
// 					},

// 					width: "130px",
// 					valueFormat: "dd.MM.yyyy",
// 					visible: "{=${worklistView>/EditHistoryMode} === true}"

// 				});
// 				InputDateTo.addStyleClass("InputDateTo");
// 				InputDateTo.addStyleClass("sapUiTinyMarginBegin");
// 				this.InputHistoryListItem.addContent(InputDateTo);
// 				//----------------------Ввод даты По End-------------------------------
// 				//----------------------Текст даты С-------------------------------
// 				var TextDateTo = new sap.m.Text({
// 					text: {
// 						path: "PartnerAttributeDateTo",
// 						type: 'sap.ui.model.type.Date',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy'
// 						}
// 					},
// 					visible: "{=${worklistView>/EditHistoryMode} !== true}"
// 				});
// 				TextDateTo.addStyleClass("InputDateTo");
// 				TextDateTo.addStyleClass("sapUiTinyMarginBegin");
// 				TextDateTo.addStyleClass("HistoryText");
// 				this.InputHistoryListItem.addContent(TextDateTo);
// 				//----------------------Текст даты По-------------------------------

// 				//----------------------Text ViewMode-------------------------------
// 				var Text = new sap.m.Text({
// 					text: "{ValueString}{ValueLargeString}{ValueBoolean}{ValueTime}{ValueDecimal}",
// 					visible: "{=${worklistView>/EditHistoryMode} !== true && ${ControlType} !== 13 && ${ControlType} !== 3 && ${ControlType} !== 4 && ${ControlType} !== 6 && ${ControlType} !== 8}"
// 				});
// 				Text.addStyleClass("HistoryText");
// 				this.InputHistoryListItem.addContent(Text);
				
// 				var TextInt = new sap.m.Text({
// 					text: "{ValueInteger}",
// 					visible: "{=${worklistView>/EditHistoryMode} !== true && (${ControlType} === 13 || ${ControlType} === 9) }"
// 				});
// 				Text.addStyleClass("HistoryText");
// 				this.InputHistoryListItem.addContent(TextInt);
				
				
				
				
// 				var TextLink = new sap.m.Link({
// 					href: "http://{ValueLargeString}",
// 					text: "{ValueLargeString}",
// 					visible: "{=${worklistView>/EditHistoryMode} !== true && (${ControlType} === 6 || ${ControlType} === 8)}",
// 					target: "_blank"
// 				});
// 				TextLink.attachPress(function (oEvent) {
// 					sap.m.URLHelper.triggerEmail(that._getVal(oEvent), "Info Request");
// 				});
// 				this.InputHistoryListItem.addContent(TextLink);
				
				
// 				var TextDate = new sap.m.Text({

// 					text: {
// 						path: "ValueDate",
// 						type: 'sap.ui.model.type.Date',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy'
// 						}
// 					},
// 					visible: "{=${worklistView>/EditHistoryMode} !== true && ${ControlType} === 3 }"
// 				});
//                 this.InputHistoryListItem.addContent(TextDate);
                
//                 var TextDateTime = new sap.m.Text({

// 					text: {
// 						path: "ValueDateTime",
// 						type: 'sap.ui.model.type.DateTime',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy HH:mm:ss'
// 						}
// 					},
// 					visible: "{=${worklistView>/EditHistoryMode} !== true && ${ControlType} === 4 }"
// 				});
//                 this.InputHistoryListItem.addContent(TextDateTime);
// 				//----------------------Text ViewMode End-------------------------------

// 				var deleteButton = new sap.ui.core.Icon({
// 					src: "sap-icon://sys-minus",
// 					color: "Default",
// 					visible: "{= ${worklistView>/EditHistoryMode} !== true }",
// 					tooltip: "{i18n>ttDelete}"
// 				});
// 				deleteButton.attachPress(function (oEvent) {
// 					var oRequest = oEvent.getSource().getBindingContext().sPath;
// 					MessageBox.confirm(
// 						that.getResourceBundle().getText("confRemoveItem"), {
// 							onClose: function (oAction) {
// 								if (oAction === sap.m.MessageBox.Action.OK) {
// 									var oBatch = true;
// 									that._oViewModel.setProperty("/busy", true);
// 									that.getView().getModel().setUseBatch(oBatch);
// 									that.getView().getModel().remove(oRequest, {
// 										success: that.DeleteHistorySuccess.bind(that),
// 										error: that.DeleteHistoryError.bind(that),
// 										async: true
// 									});
// 								}
// 							}
// 						});
// 				});
// 				deleteButton.addStyleClass("Input");
// 				deleteButton.addStyleClass("deleteIcon");
// 				deleteButton.addStyleClass("sapUiTinyMarginBegin");
// 				this.InputHistoryListItem.addContent(deleteButton);

// 				//----------------------ValueString Input-------------------------------
// 				var Input = new sap.m.Input({ //создание конкретного типа ввода строки и заполнение значением

// 					value: "{ValueString}",
// 					width: "200px",
// 					visible: "{= ${ControlType} === 1 && ${LookUpType} === 0 && ${worklistView>/EditHistoryMode} === true}"
// 				});
// 				Input.addStyleClass("Input");
// 				this.InputHistoryListItem.addContent(Input);
				
// 				var InputEmail = new sap.m.Input({

// 					value: "{ValueLargeString}",
// 					placeholder: "Enter E-Mail ...",
// 					valueStateText: "E-Mail must be a valid email address.",
// 					type: "Email",
// 					width: "200px",
// 					visible: "{= ${ControlType} === 6  && ${worklistView>/EditHistoryMode} === true}",
// 					enabled: "{=${worklistView>/EditHistoryMode}}"
// 				});
// 				this.InputHistoryListItem.addContent(InputEmail);
				
// 				var MaskInput = new sap.m.Input({

// 					value: "{ValueString}",
// 					width: "200px",
// 					placeholder: "Enter phone number",
// 					visible: "{= ${ControlType} === 7 && ${worklistView>/EditHistoryMode} === true}",
// 					enabled: "{=${worklistView>/EditHistoryMode}}"
// 				});
// 				this.InputHistoryListItem.addContent(MaskInput);

// 				//-----------------------ValueString Input End-------------------------------

// 				//----------------------ValueLargeString InputLarge-------------------------------
// 				var InputTextArea = new sap.m.Input({
// 					value: "{ValueLargeString}",
// 					width: "400px",
// 					visible: "{= (${ControlType} === 2 || ${ControlType} === 8) && ${LookUpType} === 0 && ${worklistView>/EditHistoryMode} === true}"
// 				});
// 				//InputTextArea.addStyleClass("Input");
// 				this.InputHistoryListItem.addContent(InputTextArea);
				
// 				var InputDate = new sap.m.DatePicker({

// 					value: {
// 						path: "ValueDate",
// 						type: 'sap.ui.model.type.Date',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy',
// 							UTC: true
// 						}
// 					},
// 					visible: "{= ${ControlType} === 3 && ${worklistView>/EditHistoryMode} === true}",
// 					width: "200px",
// 					valueFormat: "dd.MM.yyyy",
// 					enabled: "{=${worklistView>/EditHistoryMode}}"
// 				});
// 				this.InputHistoryListItem.addContent(InputDate);
				
				
// 				var InputDateTime = new sap.m.DateTimePicker({

// 					value: {
// 						path: "ValueDateTime",
// 						type: 'sap.ui.model.type.DateTime',
// 						formatOptions: {
// 							pattern: 'dd.MM.yyyy HH:mm:ss',
// 							UTC: true
// 						}
// 					},
// 					visible: "{= ${ControlType} === 4 && ${worklistView>/EditHistoryMode} === true}",
// 					width: "200px",
// 					valueFormat: "dd.MM.yyyy HH:mm:ss",
// 					enabled: "{=${worklistView>/EditHistoryMode}}"
// 				});
// 				this.InputHistoryListItem.addContent(InputDateTime);
				
// 				var InputStepInteger = new sap.m.StepInput({

// 					value: "{ValueInteger}",
// 					width: "200px",
// 					visible: "{= ${ControlType} === 9  && ${worklistView>/EditHistoryMode} === true}",
// 					enabled: "{=${worklistView>/EditHistoryMode}}",
// 					min: "{= Math.floor(${NumberMinValue})}",
// 					max: "{= Math.floor(${NumberMaxValue})}",
// 					step: "{= Math.floor(${NumberStep})}"
// 				});
// 				this.InputHistoryListItem.addContent(InputStepInteger);
				
// 				var InputStepDecimal = new sap.m.StepInput({

// 					value: "{ValueDecimal}",
// 					width: "200px",
// 					visible: "{= ${ControlType} === 10  && ${worklistView>/EditHistoryMode} === true}",
// 					enabled: "{=${worklistView>/EditHistoryMode}}",
// 					min: "{= Math.floor(${NumberMinValue})}",
// 					max: "{= Math.floor(${NumberMaxValue})}",
// 					step: "{= Math.floor(${NumberStep})}"
// 				});
// 				this.InputHistoryListItem.addContent(InputStepInteger);
				
// 				var ComboBox = new sap.m.ComboBox({ //создание конкретного типа ввода строки и заполнение значением

// 				//	selectedKey: "{ parts : [{path: 'TypeID'},{ path : 'ValueString'},{path: 'ValueLargeString'},{path: 'ValueBoolean'},{path: 'ValueDate'},{path: 'ValueDateTime'},{path: 'ValueTime'},{path: 'ValueDecimal'},{path: 'ValueInteger'}], formatter: '.formatComboBoxHistory'}", 
// 					width: "{= ${ControlType} === 2 ? '400px' : '200px'}",
// 					visible: "{= ${LookUpType} === 1  && ${worklistView>/EditHistoryMode} === true}",
// 					enabled: "{=${worklistView>/EditHistoryMode}}"
// 					});
// 				this.InputHistoryListItem.addContent(ComboBox); //добавление типа ввода в строку
				
				
// 				var ComboBoxFixed = new sap.m.ComboBox({ //создание конкретного типа ввода строки и заполнение значением

// 					selectedKey: "{ValueInteger}",
					
// 					width: "{= ${ControlType} === 2 ? '400px' : '200px'}",
// 					visible: "{= (${LookUpType} === 2 || ${LookUpType} === 3) && ${worklistView>/EditHistoryMode} === true}",
// 					enabled: "{=${worklistView>/EditHistoryMode}}"
// 				});
// 				this.InputHistoryListItem.addContent(ComboBoxFixed); //добавление типа ввода в строку
// 				//-----------------------ValueLargeString InputLarge End-------------------------------
				
// 				var TextInt = new sap.m.Text({
// 					text: "{ValueString}{ValueLargeString}{ValueBoolean}{ValueDate}{ValueTime}{ValueDateTime}{ValueDecimal}",
// 					visible: "{=${worklistView>/EditHistoryMode} !== true && ${ControlType} === 8}"
// 				});
// 				TextInt.addStyleClass("HistoryText");
// 				this.InputHistoryListItem.addContent(TextInt);

// 			}
			var ScrollContainer = new sap.m.ScrollContainer({
				id: "ScrollContainer",
				vertical: true,
				horizontal: false
			});

			var Title = new sap.m.Title({
				id: "Title",
				// text: ParentName + "/" + AttributeName
			});
			//----------------------List-------------------------------
			var List = new sap.m.List({ //создание списка
				id: "listHistory",
				headerText: "History",
				updateFinished: this.updateFinishedHistoryList.bind(this),
				items: {
					path: '/vMasterAttrHistory',
					filters: [new Filter({
						path: "AttributeID",
						operator: FilterOperator.EQ,
						value1: AttributeID
					}), new Filter({
						path: "PartnerRoleID",
						operator: FilterOperator.EQ,
						value1: PartnerRoleID
					}), new Filter({
						path: "ParentID",
						operator: FilterOperator.EQ,
						value1: ParentID
					})],
					template: this.InputHistoryListItem
				}
			});
			//-----------------------List End-------------------------------

			footerToolbar.addContent(footerToolbarSpacer);
			footerToolbar.addContent(buttonSave);

			footerToolbar.addContent(buttonCancel);
			footerToolbar.addContent(buttonClose);
			OverflowToolbar.addContent(Title);
			OverflowToolbar.addContent(ToolbarSpacer);
			OverflowToolbar.addContent(addButton);
			OverflowToolbar.addContent(editButton);
			List.setHeaderToolbar(OverflowToolbar);
			List.setSticky([
				"HeaderToolbar"
			]);
			dialogPage.addContent(List);
			dialogPage.setFooter(footerToolbar);

			dialogPage.addContent(ScrollContainer);

			this._createDialog.insertContent(dialogPage);
			this.getView().addDependent(this._createDialog);
			this._createDialog.open();
		},
		DeleteHistorySuccess: function (oEvent) {
			this._jbBack._Showi18nMsgToast("msgRemovedSuccess");
			this._oViewModel.setProperty("/busy", false);
			this.getModel("appView").setProperty("/busy", false);
			this.getModel("worklistView").setProperty("/busy", false);
			sap.ui.core.BusyIndicator.hide();
			this.getView().getModel().setUseBatch(false);

		},

		DeleteHistoryError: function (oEvent) {
			this._jbBack._Showi18nMsgToast("msgRemovedError");
			this._oViewModel.setProperty("/busy", false);
			this.getModel("appView").setProperty("/busy", false);
			this.getModel("worklistView").setProperty("/busy", false);
			sap.ui.core.BusyIndicator.hide();
			this.getView().getModel().setUseBatch(false);
		},

		gettingHistoryData: function (oEvent) {
			var that = this;
			var AttributeID = oEvent.getSource().getBindingContext().getProperty("AttributeID");
			var PartnerRoleID = oEvent.getSource().getBindingContext().getProperty("PartnerRoleID");
			var ParentName = oEvent.getSource().getBindingContext().getProperty("ParentName");
			var ParentID = oEvent.getSource().getBindingContext().getProperty("ParentID");
			var AttributeName = oEvent.getSource().getBindingContext().getProperty("AttributeName");
			this.getOwnerComponent().getModel().read("/vMasterAttrHistory", {
				filters: [
					new Filter({
						path: "AttributeID",
						operator: FilterOperator.EQ,
						value1: oEvent.getSource().getBindingContext().getProperty("AttributeID")
					}),
					new Filter({
						path: "PartnerRoleID",
						operator: FilterOperator.EQ,
						value1: oEvent.getSource().getBindingContext().getProperty("PartnerRoleID")
					}),
					new Filter({
						path: "ParentID",
						operator: FilterOperator.EQ,
						value1: oEvent.getSource().getBindingContext().getProperty("ParentID")
					})

				],
				success: function (oData) {
					var TotalHistoryArr = oData.results;
					that.createHistoryList(TotalHistoryArr, AttributeID, PartnerRoleID, AttributeName, ParentName, ParentID);
				}
			});

		},

		_submitHistoryAdd: function () {
			var that = this;
			this.getModel().submitChanges({
				success: that._submitHistoryAddSuccess.bind(that),
				error: that._submitHistoryAddError.bind(that)
			});
		},
		_submitHistoryAddSuccess: function () {

			this._oViewModel.setProperty("/busy", false);
			this.getModel("appView").setProperty("/busy", false);
			//	this._oViewModel.setProperty("/EditHistoryMode", true);
			this.getModel("worklistView").setProperty("/busy", false);
			sap.ui.core.BusyIndicator.hide();

		},

		_submitHistoryAddError: function () {
			this._oViewModel.setProperty("/busy", false);
			this.getModel("appView").setProperty("/busy", false);
			//	this._oViewModel.setProperty("/EditHistoryMode", false);
			this.getModel("worklistView").setProperty("/busy", false);
			sap.ui.core.BusyIndicator.hide();
			this._jbBack._Showi18nMsgToast("errorText");
		},

		_submitHistoryChanges: function (oBatch) {
			var that = this;
			if (oBatch === undefined) {
				oBatch = true;
			}

			if (!this.getModel().hasPendingChanges()) {
				MessageBox.information(this.getResourceBundle().getText("msgNoChangesData"));

				this.getModel("appView").setProperty("/busy", false);

				return;
			}
			this.getModel().setUseBatch(oBatch);
			this.getModel().submitChanges({
				success: that._submitHistoryChangesSuccess.bind(that),
				error: that._submitHistoryChangesError.bind(that)
			});
		},

		_submitHistoryChangesSuccess: function (oData, oResponse) {

			if (oData && oData.__batchResponses[0] && oData.__batchResponses[0].response) {

				this.getModel().resetChanges();
				this._oViewModel.setProperty("/busy", false);
				this.getModel("appView").setProperty("/busy", false);

				this.getModel("worklistView").setProperty("/busy", false);
				sap.ui.core.BusyIndicator.hide();
				this._jbBack._Showi18nMsgToast("errorText");
				this.byId("itemsFilterIconTabBar").fireSelect();
			} else {
				this._jbBack._Showi18nMsgToast("msgSavedSucess");
				this._oViewModel.setProperty("/busy", false);
				this.getModel("appView").setProperty("/busy", false);
				this._oViewModel.setProperty("/EditHistoryMode", false);
				this.getModel("worklistView").setProperty("/busy", false);
				sap.ui.core.BusyIndicator.hide();
			}

		},
		_submitHistoryChangesError: function (oError) {

			this._oViewModel.setProperty("/busy", false);
			this.getModel("appView").setProperty("/busy", false);
			//this._oViewModel.setProperty("/EditHistoryMode", false);
			this.getModel("worklistView").setProperty("/busy", false);
			sap.ui.core.BusyIndicator.hide();
			this._jbBack._Showi18nMsgToast("errorText");

		},
		onPressEditAttributes: function (oEvent) {
			this._oViewModel.setProperty("/EditMode", true);
		},

		onPressCancelEditAttributes: function (oEvent) {
			this._oViewModel.setProperty("/EditMode", false);
			this._resetSelectChanges();
		},

		_resetSelectChanges: function () {
			var oChanges = this.getModel().getPendingChanges();

			for (var sBindingPath in oChanges) {
				if (sBindingPath.indexOf("ControlIoTImplementationSet") === -1) {
					this.getModel().resetChanges(["/" + sBindingPath], false);
					this.byId("itemsFilterIconTabBar").fireSelect();
				}
			}
		},

		RefreshAll: function (oEvent, oHideMsgToast) {
			var that = this;

			this.byId("itemsFilterIconTabBar").getBinding("items").refresh();
			setTimeout($.proxy(this.SelectTab, this), 1000);
		},

		SelectTab: function () {
			this.byId("itemsFilterIconTabBar").fireSelect();
		},

		onPressPartnerEdit: function (oEvent) {

			var aContext, aPath;

			aPath = '/' + this.getModel().createKey("vMaster", {
				Instance: 1,
				PartnerID: oEvent.getSource().getBindingContext().getProperty("PartnerID"),
				Version: 'A',
				Language: this._oViewModel.getProperty("/table/selectedLanguage")
			});
			this._oViewModel.setProperty("/PartnerEditMode", true);
			this._oViewModel.setProperty("/SelectedPartnerRoles", oEvent.getSource().getBindingContext().getProperty("Roles"));

			this.getModel().read(aPath);
			aContext = new sap.ui.model.Context(this.getModel(), aPath);
			this._oDialogPartner = this._jbBack.OpenAddEditDialog(oEvent, null, "jetCloud.PartnersEditor", "CreateEditPartner", this,
				aContext);
		},

		onPressAddGroup: function (oEvent) {
			if (this._oDialogAddGroup) {
				this._oDialogAddGroup.destroy();
			}
            var Filters = [];
			this._oDialogAddGroup = sap.ui.xmlfragment("AddGroup", "jetCloud.PartnersEditor" + ".view." + "AddGroup", this);
			this._oDialogAddGroup.setModel(this.getView().getModel());
			this.getView().addDependent(this._oDialogAddGroup);
			var RoleID = this._oViewModel.getProperty("/TabSelectedKey");

			
			Filters.push(new sap.ui.model.Filter("RoleID", sap.ui.model.FilterOperator.EQ, RoleID));
            Filters.push(new sap.ui.model.Filter("Language",   sap.ui.model.FilterOperator.EQ ,this._oViewModel.getProperty("/table/selectedLanguage")));

			Filters = new sap.ui.model.Filter({
				filters: Filters,
				and: true
			});
		
			var olListBinding = sap.ui.core.Fragment.byId("AddGroup", "lGroups").getBinding("items");

			olListBinding.filter(Filters);

			this._oDialogAddGroup.open();
			return this._oDialogAddGroup;
		},

		onPressAddAttribute: function (oEvent) {
			if (this._oDialogAddAttribute) {
				this._oDialogAddAttribute.destroy();
			}

			this._oDialogAddAttribute = sap.ui.xmlfragment("AddAttribute", "jetCloud.PartnersEditor" + ".view." + "AddAttribute", this);
			this._oDialogAddAttribute.setModel(this.getView().getModel());
			this.getView().addDependent(this._oDialogAddAttribute);

			var sQuery = oEvent.getSource().getParent().getParent().getItems()[0].getBindingContext().getProperty("ParentGroupID");

			var oFilterTempl = [new sap.ui.model.Filter("ParentGroupID", sap.ui.model.FilterOperator.EQ, sQuery)];
			var oFilterAll = [];
			this.LastAttribute = [];
			this.LastAttribute = oEvent.getSource().getParent().getParent().getItems()[oEvent.getSource().getParent().getParent().getItems().length -
				1].getBindingContext();
			this._oViewModel.setProperty("/ParentName", this.LastAttribute.getProperty("ParentName"));

			for (var i = 0; i < oEvent.getSource().getParent().getParent().getItems().length; i++) {
				var AttributeID = oEvent.getSource().getParent().getParent().getItems()[i].getBindingContext().getProperty("AttributeID");
				oFilterTempl.push(new sap.ui.model.Filter("AttributeID", sap.ui.model.FilterOperator.NE, AttributeID));
				oFilterAll.push(new sap.ui.model.Filter("AttributeID", sap.ui.model.FilterOperator.NE, AttributeID));
			}
			
			oFilterTempl.push(new sap.ui.model.Filter("Language",   sap.ui.model.FilterOperator.EQ ,this._oViewModel.getProperty("/table/selectedLanguage")));
            oFilterAll.push(new sap.ui.model.Filter("Language",   sap.ui.model.FilterOperator.EQ ,this._oViewModel.getProperty("/table/selectedLanguage")));
			

			oFilterTempl = new sap.ui.model.Filter({
				filters: oFilterTempl,
				and: true
			});
			oFilterAll = new sap.ui.model.Filter({
				filters: oFilterAll,
				and: true
			});

			var oTemplListBinding = sap.ui.core.Fragment.byId("AddAttribute", "lTemplateAttributes").getBinding("items");
			var oAllListBinding = sap.ui.core.Fragment.byId("AddAttribute", "lAllAttributes").getBinding("items");
			oTemplListBinding.filter(oFilterTempl);
			oAllListBinding.filter(oFilterAll);

			this._oDialogAddAttribute.open();
			return this._oDialogAddAttribute;
		},

		onPressPartnerAdd: function (oEvent) {
			if (this._oDialogPartner) {
				this._oDialogPartner.destroy();
			}
			var oContext = this.getModel().createEntry("vMaster", {
				properties: {
					PartnerID: 0,
					Instance: 1,
					Version: 'A',
				}
			});
			//this._oViewModel.setProperty("/CreateNew", true);
			this._oDialogPartner = this._jbBack.OpenAddEditDialog(oEvent, null, "jetCloud.PartnersEditor", "CreateEditPartner", this,
				oContext);
		},

		onPressAddAttributeDialogSave: function (oEvent) {
			this._oDialog = null;
			if (oEvent.getSource().sId.includes('AddAttribute')) {
				this._oDialog = this._oDialogAddAttribute;
			};
			var SelectedTab = sap.ui.core.Fragment.byId("AddAttribute", "itemsFilterIconTabBar").getSelectedKey();
			var SelectedItems = sap.ui.core.Fragment.byId("AddAttribute", SelectedTab).getSelectedItems();

			for (var i = 0; i < SelectedItems.length; i++) {

				var sPath = SelectedItems[i].getBindingContextPath();

				this.getModel().createEntry("vMasterAttrTotal01", {
					properties: {
						PartnerAttributeID: 0,
						Instance: 1,
						Version: this.getModel().getProperty(sPath + "/Version"),
						PartnerAttributeDateFrom: new Date(),
						PartnerAttributeDateTo: new Date('9999-12-31'),
						PartnerID: this.LastAttribute.getProperty("PartnerID"),
						PartnerRoleID: this.LastAttribute.getProperty("PartnerRoleID"),
						ParentID: this.LastAttribute.getProperty("ParentID"),
						AttributeID: this.getModel().getProperty(sPath + "/AttributeID"),
						AttributeMandatory: '',
						SortOrder: this.LastAttribute.getProperty("SortOrder") + i + 1,
						HistorySign: ''

					}
				});
			}

			this._jbBack.submitChanges(true, this._onPressAddAttributeDialogSaveSuccess.bind(this));

		},

		_onPressAddAttributeDialogSaveSuccess: function (oResponse, oBodyResponse) {
			if (oResponse !== undefined && oResponse.__batchResponses[0] !== undefined && oResponse.__batchResponses[0].response !== undefined &&
				(oResponse.__batchResponses[0].response.statusCode == 400 || oResponse.__batchResponses[0].response.statusCode == 406)) {
				return;
			}

			try {
				this._oDialog.destroy();
			} finally {
				this._oDialog = null;
			}

			MessageToast.show(this._i18n.getText("msgSavedSucess"));

		},

		updateFinishedCreateEditPartner: function (oEvent) {
		    var Filters = []
		    Filters.push(new sap.ui.model.Filter("Language",   sap.ui.model.FilterOperator.EQ ,this._oViewModel.getProperty("/table/selectedLanguage")));

			Filters = new sap.ui.model.Filter({
				filters: Filters,
				and: true
			});
			var olListBinding = sap.ui.core.Fragment.byId("CreateEditPartner", "ProductList").getBinding("items");

			olListBinding.filter(Filters);
			sap.ui.core.Fragment.byId("CreateEditPartner", "createEditPartnerSaveButton").setEnabled(true);
		},

		onPressDialogSave: function (oEvent) {
			this._oDialog = null;
			if (oEvent.getSource().sId.includes('CreateEditPartner')) {
				this._oDialog = this._oDialogPartner;
			};
			if (sap.ui.core.Fragment.byId("CreateEditPartner", "ProductList").getSelectedItems().length === 0) {
				MessageBox.warning(this.getResourceBundle().getText("confNotSelectedRoles"));
			} else {
				this._jbBack.checkValuesAndSubmitExt("gID_Item01", this._onPressDialogSave.bind(this));
			}

		},

		_onPressDialogSave: function (oCheckStatus) {
			if (oCheckStatus === sap.ui.core.ValueState.None) {
				this._jbBack.submitChanges(true, this._onPressDialogSaveSuccess.bind(this));
			}
		},
		_onPressDialogSaveSuccess: function (oResponse, oBodyResponse) {
			if (oResponse !== undefined && oResponse.__batchResponses[0] !== undefined && oResponse.__batchResponses[0].response !== undefined &&
				(oResponse.__batchResponses[0].response.statusCode == 400 || oResponse.__batchResponses[0].response.statusCode == 406)) {
				return;
			}

			try {
				this._oDialog.destroy();
			} finally {
				this._oDialog = null;
			}
this.RefreshPartnerList();
			//	MessageToast.show(this._i18n.getText("msgSavedSucess"));
			if (!this._oViewModel.getProperty("/PartnerEditMode")) {
				var theList = this.getView().byId("list").getItems();

				

						this.getView().byId("list").setSelectedItem(theList[theList.length - 1], true, true);
							
					

		
			};
			this._oViewModel.setProperty("/PartnerEditMode", false);
		},
		onPressDialogCancel: function (oEvent) {
			try {
				this._oDialog = null;
				if (oEvent.getSource().sId.includes('CreateEditPartner')) {
					this._oDialog = this._oDialogPartner;
				}
				if (oEvent.getSource().sId.includes('AddAttribute')) {
					this._oDialog = this._oDialogAddAttribute;
				}
				if (oEvent.getSource().sId.includes('AddGroup')) {
					this._oDialog = this._oDialogAddGroup;
				}

				if (this._oDialog.getModel() !== undefined && oEvent.getSource().getId().includes('CreateEditPartner') && this.getModel().hasPendingChanges()) {
					this._oDialog.getModel().resetChanges();
					this.byId("itemsFilterIconTabBar").fireSelect();
				}
			} finally {
				this._oDialog.destroy();
				this._oDialog = null;
			}
			this._oViewModel.setProperty("/PartnerEditMode", false);
		},

		updateFinishedGroupList: function (oEvent) {
			var sPath = oEvent.getSource().getItems()[0].getBindingContext().sPath;
			oEvent.getSource().getHeaderToolbar().getContent()[1].unbindValue();
			oEvent.getSource().getHeaderToolbar().getContent()[2].unbindText();
			oEvent.getSource().getHeaderToolbar().getContent()[1].bindValue(sPath + "/GroupDescription");
			oEvent.getSource().getHeaderToolbar().getContent()[2].bindText(sPath + "/GroupDescription");
			for (var i = 0; i < oEvent.getSource().getItems().length; i++) {
				var item = oEvent.getSource().getItems()[i].getBindingContext();
				var itemPath = oEvent.getSource().getItems()[i].getBindingContext().getPath();
				if (item.getProperty("LookUpType") === 3 && item.getProperty("ControlType") === 2) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{PartnerAttributeID}",
						text: "{ValueLargeStringMulti}"
					});
					oEvent.getSource().getItems()[i].getContent()[9].bindAggregation("items", {
						path: "/vLookUpValues",
						filters: new sap.ui.model.Filter([new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						new sap.ui.model.Filter({
							path: 'ValueLargeStringMulti',
							operator: FilterOperator.NE,
							value1: null
						})], true),
						template: oItemTemplate,
						templateShareable: false
					});
					oEvent.getSource().getItems()[i].getContent()[9].attachChange(this.handleChanheComboBox.bind(this));
					
					
				}
				if (item.getProperty("LookUpType") === 3 && item.getProperty("ControlType") === 1) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{PartnerAttributeID}",
						text: "{ValueStringMulti}"
					});
					oEvent.getSource().getItems()[i].getContent()[9].bindAggregation("items", {
						path: "/vLookUpValues",
						filters: new sap.ui.model.Filter([new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						new sap.ui.model.Filter({
							path: 'ValueStringMulti',
							operator: FilterOperator.NE,
							value1: null
						})], true),
						template: oItemTemplate,
						templateShareable: false
					});
					oEvent.getSource().getItems()[i].getContent()[9].attachChange(this.handleChanheComboBox.bind(this));
					
					
				}
				
				if (item.getProperty("LookUpType") === 2) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{PartnerAttributeID}",
						text: "{ValueString}"
					});
					oEvent.getSource().getItems()[i].getContent()[9].bindAggregation("items", {
						path: "/vLookUpValues",
						filters: new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						template: oItemTemplate,
						templateShareable: false
					});
					oEvent.getSource().getItems()[i].getContent()[9].attachChange(this.handleChanheComboBox.bind(this));
					
					
				}
				if (item.getProperty("LookUpType") === 1) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{AttributeValue}",
						text: "{AttributeValue}"
					});
					oEvent.getSource().getItems()[i].getContent()[8].bindAggregation("items", {
						path: "/vAttributesHistoryLookUp",
						filters: new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						template: oItemTemplate,
						templateShareable: false
					});
					switch(item.getProperty("ControlType")) {
						case 1:
							oEvent.getSource().getItems()[i].getContent()[8].bindValue( itemPath + '/ValueString');
							break;
						case 6:
							oEvent.getSource().getItems()[i].getContent()[8].bindValue( itemPath + '/ValueString');	
							break;
						case 8:
							oEvent.getSource().getItems()[i].getContent()[8].bindValue( itemPath + '/ValueLargeString');	
							break;
					}
				}
			}
		},
		
		
		updateFinishedHistoryList: function (oEvent) {
			
		
			for (var i = 0; i < oEvent.getSource().getItems().length; i++) {
				var item = oEvent.getSource().getItems()[i].getBindingContext();
				var itemPath = oEvent.getSource().getItems()[i].getBindingContext().getPath();
				if (item.getProperty("LookUpType") === 3 && item.getProperty("ControlType") === 2) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{PartnerAttributeID}",
						text: "{ValueLargeStringMulti}"
					});
					oEvent.getSource().getItems()[i].getContent()[22].bindAggregation("items", {
						path: "/vLookUpValues",
						filters: new sap.ui.model.Filter([new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						new sap.ui.model.Filter({
							path: 'ValueLargeStringMulti',
							operator: FilterOperator.NE,
							value1: null
						})], true),
						template: oItemTemplate,
						templateShareable: false
					});
					oEvent.getSource().getItems()[i].getContent()[22].attachChange(this.handleChanheComboBox.bind(this));
					
					
				}
				if (item.getProperty("LookUpType") === 3 && item.getProperty("ControlType") === 1) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{PartnerAttributeID}",
						text: "{ValueStringMulti}"
					});
					oEvent.getSource().getItems()[i].getContent()[22].bindAggregation("items", {
						path: "/vLookUpValues",
						filters: new sap.ui.model.Filter([new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						new sap.ui.model.Filter({
							path: 'ValueStringMulti',
							operator: FilterOperator.NE,
							value1: null
						})], true),
						template: oItemTemplate,
						templateShareable: false
					});
					oEvent.getSource().getItems()[i].getContent()[22].attachChange(this.handleChanheComboBox.bind(this));
					
					
				}
				
				if (item.getProperty("LookUpType") === 2) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{PartnerAttributeID}",
						text: "{ValueString}"
					});
					oEvent.getSource().getItems()[i].getContent()[22].bindAggregation("items", {
						path: "/vLookUpValues",
						filters: new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						template: oItemTemplate,
						templateShareable: false
					});
					oEvent.getSource().getItems()[i].getContent()[22].attachChange(this.handleChanheComboBox.bind(this));
					
					
				}
				if (item.getProperty("LookUpType") === 1) {

					var oItemTemplate = new sap.ui.core.ListItem({
						key: "{AttributeValue}",
						text: "{AttributeValue}"
					});
					oEvent.getSource().getItems()[i].getContent()[21].bindAggregation("items", {
						path: "/vAttributesHistoryLookUp",
						filters: new sap.ui.model.Filter({
							path: 'AttributeID',
							operator: FilterOperator.EQ,
							value1: item.getProperty("AttributeID")
						}),
						template: oItemTemplate,
						templateShareable: false
					});
					switch(item.getProperty("ControlType")) {
						case 1:
							oEvent.getSource().getItems()[i].getContent()[21].bindValue( itemPath + '/ValueString');
							break;
						
						case 6:
							oEvent.getSource().getItems()[i].getContent()[21].bindValue( itemPath + '/ValueString');
							break;
					
						case 8:
							oEvent.getSource().getItems()[i].getContent()[21].bindValue( itemPath + '/ValueLargeString');
							break;
					}
				}
			}
		},
		handleChanheComboBox: function (oEvent){
			var oValidatedComboBox = oEvent.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey(),
				sValue = oValidatedComboBox.getValue();

			if (!sSelectedKey && sValue) {
				oValidatedComboBox.setValueState("Error");
				oValidatedComboBox.setValueStateText("Please enter a valid value!");
			} else {
				oValidatedComboBox.setValueState("None");
			}
		},

		onFormatSelectedRoles: function (RoleID) {
			var arrayRoles = this._oViewModel.getProperty("/SelectedPartnerRoles").split(",");
			return !this._oViewModel.getProperty("/PartnerEditMode") ? false : arrayRoles.includes(RoleID.toString());
		},

		onChangeOrder: function (oEvent) {
			if (this._oViewModel.getProperty("/ChangeOrderMode")) {
				this._oViewModel.setProperty("/ChangeOrderMode", false);
			} else this._oViewModel.setProperty("/ChangeOrderMode", true);
		},

		Roles_selectionFinish: function (oEvent) {
			var selectedItems = oEvent.getSource().getSelectedItems();
			var messageText = "";

			for (var i = 0; i < selectedItems.length; i++) {
				if (i === 0) {
					messageText = selectedItems[i].getBindingContext().getProperty("RoleID");
				} else {
					messageText += "," + selectedItems[i].getBindingContext().getProperty("RoleID");
				}
			}
			messageText = messageText.toString()
				// console.log(messageText);
			if (messageText !== '') {
				this.getModel().setProperty(oEvent.getSource().getBindingContext().sPath + "/Roles", messageText);
			} else {
				this.getModel().setProperty(oEvent.getSource().getBindingContext().sPath + "/Roles", "");
			}
		},

		onPressSave: function (oBatch) {
		    this._oViewModel.setProperty("/DetailBusy", true);
			this._jbBack._submitChanges(this._AfterSubmitSuccess.bind(this), this._AfterSubmitError.bind(this), oBatch);
		},

		_AfterSubmitSuccess: function (oData, oResponse) {
			this._oViewModel.setProperty("/CreateNew", false);
			this._oViewModel.setProperty("/EditMode", false);

			if (oData && oData.__batchResponses[0] && oData.__batchResponses[0].response) {
				//this._AfterError(null, 'msgSavedError', [oData.__batchResponses[0].response.statusCode,oData.__batchResponses[0].response.statusText,oData.__batchResponses[0].response.body]);
				this.getModel().resetChanges();
			} else {
				this._AfterSuccess(oData, oResponse, 'msgSavedSucess');
			}

		},
		_AfterSuccess: function (oData, oResponse, oKey, oParams) {
		    this._oViewModel.setProperty("/DetailBusy", false);
			this._jbBack._Showi18nMsgToast(oKey, oParams);
			
		},

		_AfterSubmitError: function (oError) {
			this._oViewModel.setProperty("/CreateNew", false);
			this._oViewModel.setProperty("/EditMode", false);
		},

		_refreshAndEnableDisplay: function () {
			this.RefreshData();
			this._oViewModel.setProperty("/busy", false);
			this.getModel("appView").setProperty("/busy", false);
		},

		RefreshData: function (oEvent) {
			this.getModel().refresh();
			this.getModel().updateBindings();
			this.getView().updateBindingContext();
			this.onBeforeRendering();
			this.ResetSelections();
			this._oViewModel.setProperty("/busy", false);
			this.getModel("appView").setProperty("/busy", false);
			this.getModel("worklistView").setProperty("/busy", false);
			sap.ui.core.BusyIndicator.hide();
		},

		RefreshPartnerList: function (oEvent) {
			this.byId("list").getBinding("items").refresh();
				MessageToast.show(this.getResourceBundle().getText("msgRefreshed"));
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
				return;
			}

			var sQuery = this.byId("searchField").getProperty("value").toLowerCase();

			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("StringForSearch", sap.ui.model.FilterOperator.Contains, sQuery)];
				this._oListFilterState.aSearch = [new sap.ui.model.Filter(oFilter1, false)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();
		},

		onPressSortPartners: function () {
			this._openDialog("SortPartners");
		},

		_openDialog: function (sName, sPage, fInit) {
			if (!this._oDialogs) {
				this._oDialogs = {};
			}
			if (!this._oDialogs[sName]) {
				Fragment.load({
					name: "jetCloud.PartnersEditor.view." + sName,
					controller: this
				}).then(function (oDialog) {
					this._oDialogs[sName] = oDialog;
					this.getView().addDependent(this._oDialogs[sName]);
					if (fInit) {
						fInit(this._oDialogs[sName]);
					}
					this._oDialogs[sName].open(sPage);
				}.bind(this));
			} else {
				this._oDialogs[sName].open(sPage);
			}
		},

		handleConfirmSorting: function (oEvent) {
			var sKey = oEvent.getParameters().sortItem.getKey();
			var oSorter = new sap.ui.model.Sorter(sKey, oEvent.getParameters().sortDescending, false);
			this.byId("list").getBinding("items").sort(oSorter);
		},

		onSelectSwitch: function (oEvent) {
			if (oEvent.getParameter("state")) {
				this.getModel().setProperty(oEvent.getSource().getBindingContext() + "/" + "ValueBoolean", "X");
			} else {
				this.getModel().setProperty(oEvent.getSource().getBindingContext() + "/" + "ValueBoolean", "");
			}

		},

		onPressPartnerDelete: function (oEvent) {
			this.onPressDeactevateDelete(oEvent, "list", this.getRequestHdrKey.bind(this), true);
			this.getView().getModel().setUseBatch(false);
		},
		onPressDeactevateDelete: function (oEvent, oTableName, fnGetID, oBatch) {
			var that = this;
			if (this._oViewModel.getProperty("/DeactivateMode")) {

				MessageBox.confirm(
					that.getResourceBundle().getText("confRemove"), {
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								that._UpdateVersionStatus('Delete', that.getView().byId(oTableName), fnGetID, oBatch);
							}
						}
					});
			} else {
				MessageBox.confirm(
					that.getResourceBundle().getText("confDeactivate"), {
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								that._UpdateVersionStatus('Deactivate', that.getView().byId(oTableName), fnGetID, oBatch);
							}
						}
					});
			}
		},

		_UpdateVersionStatus: function (oType, oTable, fnRequest, oBatch) { // need del

			var aSelectedItemsCount = 0;
			if (oBatch === undefined) {
				oBatch = true;
			}
			if (oTable.getSelectedItems) {
				aSelectedItemsCount = oTable.getSelectedItems().length;
			} else if (oTable.getSelectedIndices) {
				aSelectedItemsCount = oTable.getSelectedIndices().length;
			}

			for (var i = 0; i < aSelectedItemsCount; i++) {

				if (oTable.getSelectedItems) {
					var aRequest = '/' + fnRequest(oTable.getSelectedItems()[i].getBindingContext());
				} else if (oTable.getSelectedIndices) {
					var aRequest = '/' + fnRequest(oTable.getContextByIndex(oTable.getSelectedIndices()[i]));
				}

				if (oType === 'Delete') {

					this._jbBack._Remove(aRequest, this._jbBack._AfterRemoveSuccessBatch, this._jbBack._AfterRemoveError, oBatch);
				} else if (oType === 'Deactivate') {

					var aEntry = {};
					aEntry.Version = glbVersionD.toString();

					// 		this._Update(aRequest, aEntry, this._AfterDeactivateSuccessBatch, this._AfterDeactivateError, oBatch);
					this._jbBack._Update(aRequest, aEntry, this._jbBack._AfterDeactivateSuccessBatch, this._jbBack._AfterDeactivateSuccess,
						oBatch);
				} else if (oType === 'Restore') {
					var aEntry = {};
					aEntry.Version = glbVersionR.toString();

					// 		this._Update(aRequest, aEntry, this._AfterRestoreSuccessBatch, this._AfterRestoreSuccess, oBatch);
					this._jbBack._Update(aRequest, aEntry, this._jbBack._AfterRestoreSuccessBatch, this._jbBack._AfterRestoreSuccess, oBatch);
				}
			}
		},

		getRequestHdrKey: function (oSelectedItems) {
				return this.getModel().createKey("vMaster", {
					Instance: oSelectedItems.getProperty("Instance"),
					PartnerID: oSelectedItems.getProperty("PartnerID"),
					Version: oSelectedItems.getProperty("Version")
				});
			}
			// #####################################################################################
			,

	onBeforeRendering: function (oEvent) {
	
				var sLanguageID = this._oViewModel.getProperty("/table/selectedLanguage");
					this.FilterRolesTable = this.RolesTable.filter(function(hero) {
	return hero.Language == sLanguageID;
});

				var oFilter = new Filter({

    filters: [

      this._jbBack.getDeactivateModeFilter(this._oViewModel.getProperty(
				"/DeactivateMode")),
      new Filter("Language", FilterOperator.EQ, sLanguageID)

    ],
    bAnd: true

  });
  this._oList.getBinding("items").filter(oFilter);
  this.byId("itemsFilterIconTabBar").getBinding("items").filter(new Filter("Language", FilterOperator.EQ, sLanguageID));
				

		},

		updateFinishedPartnerList: function (oEvent) {

			var oList = this.byId("list"),
				oParent = oList.$().parent();
			if (oParent) {
				oParent.addClass("ListPadding");
			}

			var oList = oEvent.getSource();
			if (this._oViewModel.getProperty("/PartnerName") === 'No data') {
				this.ResetSelections();
				//this.byId("itemsFilterIconTabBar").setVisible(true);
			};

			if (oList.getItems().length === 0) {
				this._oViewModel.setProperty("/PartnerName", 'No data');
				//	this.byId("itemsFilterIconTabBar").setVisible(false);
			};

			if (oList.getSelectedItems().length === 0) {
				var aItems = oList.getItems();
				oList.setSelectedItem(aItems[0], true, true);
			}
			
			
		},

		onPressDetailRestore: function (oEvent) {
			this._jbBack.onPressRestore(oEvent, "list", this.getRequestHdrKey.bind(this), false);
		},

		ResetSelections: function () {
			var oList = this.getView().byId("list");
			oList.removeSelections();
			this._oViewModel.setProperty("/SelectedItems", 0);

		},
		// #################################  Dialogs End ######################################

		// #################################  Detail End ######################################	

	});
});