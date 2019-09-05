sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("marcio.cadastro_infracoes.controller.S0", {
		onInit: function () {
			var sURL = "/viacep/01001000/json/";
			var oModelo = new sap.ui.model.json.JSONModel(sURL);

			this.getView().setModel(oModelo);

			var oViewModel = new sap.ui.model.json.JSONModel({
				termoBusca: ""
			});
			this.getView().setModel(oViewModel, "view");
			//
			this._oFiltroModel = new JSONModel({
				tipo: "",
				marca: "",
				modelo: "",
				ano: ""
					// ano: 2018
			});
			this.getView().setModel(this._oFiltroModel, "filtro");

			this._oTipoModel = new JSONModel([{
				codigo: "",
				nome: ""
			}, {
				codigo: "carros",
				nome: "Carros"
			}, {
				codigo: "motos",
				nome: "Motos"
			}, {
				codigo: "caminhoes",
				nome: "Caminhões"
			}]);
			this.getView().setModel(this._oTipoModel, "tipo");

			this._oMarcaModel = new JSONModel();
			this.getView().setModel(this._oMarcaModel, "marca");

			this._oModeloModel = new JSONModel();
			this.getView().setModel(this._oModeloModel, "modelo");

			this._oAnosModel = new JSONModel();
			this.getView().setModel(this._oAnosModel, "anos");

			this._oVeiculosModel = new JSONModel([]);
			this.getView().setModel(this._oVeiculosModel, "veiculos");

			//
		},
		//
		onChangeTipo: function (oEvent) {
			var sTipo = this._oFiltroModel.getProperty("/tipo");
			if (sTipo) {
				this._oMarcaModel.loadData("/api/" + sTipo + "/marcas");

			} else {
				this._oMarcaModel.setProperty("/", []);
				this._oModeloModel.setProperty("/", []);
			}
		},

		onChangeMarca: function (oEvent) {
			var sTipo = this._oFiltroModel.getProperty("/tipo");
			var sMarca = this._oFiltroModel.getProperty("/marca");

			if (sTipo && sMarca) {
				this._oModeloModel.loadData("/api/" + sTipo + "/marcas/" + sMarca + "/modelos");
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
		//
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
		}

	});
});