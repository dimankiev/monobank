class monoClient {
	constructor() {
		this.clientInfo = { name: "Unauthorized", webHookUrl: "none", accounts: [] }
		this.currencyCodes = { "985": "PLN", "980": "UAH", "840": "USD", "978": "EUR" };
  	this.monoInstances = {};
		this.currencies = {
			"840": {currencyCodeB: 840, currencyCodeA: 980, rateSell: 1, rateBuy: 1, rateCross: 1},
			"978": {currencyCodeB: 978, currencyCodeA: 980, rateSell: 1, rateBuy: 1, rateCross: 1},
			"985": {currencyCodeB: 985, currencyCodeA: 980, rateSell: 1, rateBuy: 1, rateCross: 1}
		};
    this.updateApiKey(false);
		this.updateRates().then(data => this.currencies = data);
  }
  updateApiKey(apiKey) {
  	if(!apiKey) apiKey = localStorage.getItem('apiKey');
    if (typeof apiKey !== 'undefined' && apiKey !== null && apiKey !== "null") {
    	localStorage.setItem('apiKey', apiKey);
    	this.monoInstances.clientInfo = axios.create({
        url: 'https://api.monobank.ua/personal/client-info',
        timeout: 5000,
        method: "get",
        headers: { 'X-Token': apiKey }
      });
      this.updateClientInfo();
    }
  }
  updateClientInfo() {
		return new Promise((resolve, reject) => {
			let clientInfo_saved = false;
			let tmp = localStorage.getItem('clientInfo');
	    if (typeof tmp !== 'undefined') clientInfo_saved = JSON.parse(tmp);
	    let clientInfoRequestTimestamp = localStorage.getItem('clientInfoRequestTimestamp');
	    if((typeof clientInfoRequestTimestamp == 'undefined' || Math.round(new Date().getTime() / 1000) - Number(clientInfoRequestTimestamp) > 60) && typeof this.monoInstances.clientInfo !== 'undefined') {
				localStorage.setItem('clientInfoRequestTimestamp', Math.round(new Date().getTime() / 1000));
				this.monoInstances.clientInfo.get().then( response => {
	      	if (response.status == 200) {
	          this.clientInfo = response.data;
	          localStorage.setItem('clientInfo', JSON.stringify(this.clientInfo));
						resolve(response.data);
	        } else {
						let errorAnswer = { name: "Unauthorized", webHookUrl: "none", accounts: [] };
						localStorage.setItem('clientInfo', JSON.stringify(errorAnswer));
						this.clientInfo = errorAnswer;
						resolve(errorAnswer);
					}
	      });
	    } else if (clientInfo_saved !== false && clientInfo_saved !== null) {
	      this.clientInfo = clientInfo_saved;
				resolve(this.clientInfo);
	    } else {
				resolve(this.clientInfo);
			}
		})
  }
	updateRates() {
		return new Promise((resolve, reject) => {
			let decodedCurrencies = localStorage.getItem("currencies");
			let lastUpdate = localStorage.getItem("currenciesLastUpdate");
			if (typeof decodedCurrencies !== 'undefined' && decodedCurrencies !== null) { decodedCurrencies = JSON.parse(decodedCurrencies); } else { decodedCurrencies = false; }
			if (typeof lastUpdate !== 'undefined' && lastUpdate !== null) { lastUpdate = Number(lastUpdate); } else { lastUpdate = false; }
			if ((lastUpdate == false && decodedCurrencies == false) || (Math.round(new Date().getTime() / 1000) - lastUpdate > 30)) {
				axios.get("https://api.monobank.ua/bank/currency").then((response => {
					let currencies = {};
					if (response.status == 200) {
						response.data.forEach(item => { if (item.currencyCodeB == 980 && item.currencyCodeA !== item.currencyCodeB) currencies[item.currencyCodeA] = item; });
						this.currencies = currencies;
						localStorage.setItem("currencies", JSON.stringify(currencies));
						localStorage.setItem("currenciesLastUpdate", Math.round(new Date().getTime() / 1000));
						resolve(currencies);
					}
				})).catch((response) => { resolve(this.currencies); });
			} else {
				this.currencies = decodedCurrencies;
				resolve(decodedCurrencies);
			}
		})
	}
}

let monoInstance = new monoClient();

ReactDOM.render(
  <App />,  document.getElementById('root')
);
