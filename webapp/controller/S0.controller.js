sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast'
], function (Controller, JSONModel,MessageToast) {
	"use strict";

	return Controller.extend("marcio.cadastro_infracoes.controller.S0", {
		onInit: function () {
			var sURL = "/viacep/json/";
			var oModelo = new sap.ui.model.json.JSONModel(sURL);

			this.getView().setModel(oModelo);

			var oViewModel = new sap.ui.model.json.JSONModel({
				termoBusca: ""
			});
			this.getView().setModel(oViewModel, "view");

			this._oFiltroModel = new JSONModel({
				tipo: "",
				marca: "",
				modelo: "",
				ano: ""
			});
			this.getView().setModel(this._oFiltroModel, "filtro");

			this._oTipoModel = new JSONModel([{
				id: "",
				nome: ""
			}, {
				id: "carros",
				nome: "Carros"
			}, {
				id: "motos",
				nome: "Motos"
			}, {
				id: "caminhoes",
				nome: "Caminhões"
			}]);

			this.getView().setModel(this._oTipoModel, "tipo");

			this._oMarcaModel = new JSONModel();
			this.getView().setModel(this._oMarcaModel, "marca");
			window._marcaModel = this._oMarcaModel;

			this._oModeloModel = new JSONModel();
			this.getView().setModel(this._oModeloModel, "modelo");
			window._oModeloModel = this._oModeloModel;

			this._oVeiculosModel = new JSONModel([]);
			this.getView().setModel(this._oVeiculosModel, "veiculos");
			window._oVeiculosModel = this._oVeiculosModel;
			// Inicio Cargo
			this._oCargoModel = new JSONModel({
				cargo: ""
			});
			this.getView().setModel(this._oFiltroModel, "cargo");

			this._oTipoCargo = new JSONModel([{
				id: "",
				cargo: ""
			}, {
				id: "1",
				cargo: "Motorista"
			}, {
				id: "2",
				cargo: "Gerente"
			}, {
				id: "3",
				cargo: "Terceiro"
			}]);

			this.getView().setModel(this._oTipoCargo, "cargo");
			// Fim Cargo

			//interno/externo
			this._oLocalModel = new JSONModel({
				local: ""
			});
			this.getView().setModel(this._oLocalModel, "local");

			this._oTipoLocal = new JSONModel([{
				id: "",
				local: ""
			}, {
				id: "1",
				local: "Interno"
			}, {
				id: "2",
				local: "Externo"
			}, {
				id: "3",
				local: "Terceiro"
			}]);
			this.getView().setModel(this._oTipoLocal, "local");

			//Fim interno/externo
		},
		//
		onChangeTipo: function (oEvent) {
			var sTipo = this._oFiltroModel.getProperty("/tipo");
			if (sTipo) {
				var sApi = "https://parallelum.com.br/fipe/api/v1/" + sTipo + "/marcas"
				this._oMarcaModel.loadData(sApi);

			} else {
				this._oMarcaModel.setProperty("/", []);
				this._oModeloModel.setProperty("/", []);
			}
		},

		onChangeMarca: function (oEvent) {
			var sTipo = this._oFiltroModel.getProperty("/tipo");
			var sMarca = this._oFiltroModel.getProperty("/marca");
			var sApi = "https://parallelum.com.br/fipe/api/v1/" + sTipo + "/marcas/" + sMarca + "/modelos"
			if (sTipo && sMarca) {
				this._oModeloModel.loadData("https://parallelum.com.br/fipe/api/v1/" + sTipo + "/marcas/" + sMarca + "/modelos");
			}
		},

		onChangeModelo: function (oEvent) {
			var sTipo = this._oFiltroModel.getProperty("/tipo");
			var sMarca = this._oFiltroModel.getProperty("/marca");
			var sModelo = this._oFiltroModel.getProperty("/modelo");

			if (sTipo && sMarca && sModelo) {
				this._oAnosModel.loadData("/api/" + sTipo + "/marcas/" + sMarca + "/modelos/" + sModelo + "/anos");
			}
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
		getSplitAppObj: function () {
			var result = this.byId("SplitS0");
			return result;
		},

		//busca o cep
		onCep: function (oEvent) {
			var sCep = this.getView().byId("cep").getValue();
			var sUrl = "/viacep/" + sCep + "/json/";
			this.getView().getModel().loadData(sUrl);
		},
		onValue: function (oEvent) {
			var sValue = this.getView().byId("valor").getValue();

		},
		handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] == "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
				}

				MessageToast.show(sMsg);
			}
		},

		handleUploadPress: function (oEvent) {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.upload();
		}

	});
});