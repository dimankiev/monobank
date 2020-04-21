class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <h3 className="text-light">monobank API Client v.0.2.0 Beta (by dimankiev)</h3>
    )
  }
}
class ApiKeySettings extends React.Component {
  constructor(props) {
    super(props);
    let apiKey = localStorage.getItem('apiKey');
    this.state = {value: typeof apiKey !== 'undefined' && apiKey !== null ? apiKey : '', hide: true}
    this.handleChange = this.handleChange.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleHide(event) { this.setState({ hide: this.state.hide ? false : true });}
  handleChange(event) { this.setState({value: event.target.value}); }
  handleSubmit(event) {
    monoInstance.updateApiKey(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label className="text-light">
          API Key:
          <input type={this.state.hide ? "password" : "text"} value={this.state.value} onChange={this.handleChange} />
        </label>
        <div id="apiKeyFormControls">
          <input type="submit" value="Set Key" />
          <button type="button" onClick={this.handleHide}>{this.state.hide ? "Show" : "Hide"} API Key</button>
        </div>
      </form>
    );
  }
}

class Dashboard extends React.Component {
	constructor(props) {
    super(props);
    this.state = {client: monoInstance.clientInfo, secondsPassed: 0, rates: monoInstance.currencies};
    this.compareCardBalances = this.compareCardBalances.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.updateClientInfo(), 5000);
    this.counterID = setInterval(() => this.updateCounter(), 1000);
    this.updateExRates();
    this.ratesUpdateTimerID = setInterval(() => this.updateExRates(), 300000);
  }

  componentWillUnmount() {
  	clearInterval(this.timerID);
    clearInterval(this.counterID);
  }

  updateClientInfo() { monoInstance.updateClientInfo().then(data => this.setState({client: data})); }
  updateCounter() {
    let lastUpdate = localStorage.getItem('clientInfoRequestTimestamp');
    if (typeof lastUpdate !== 'undefined' && lastUpdate !== 'null') {
      let calculated = Math.round(new Date().getTime() / 1000) - Number(lastUpdate);
      this.setState({secondsPassed: calculated});
    } else {
      this.setState({secondsPassed: "Not updated yet !"});
    }
  }
  compareCardBalances(card1, card2) {
    let result = card2.balance * (card2.currencyCode !== 980 ? this.state.rates[`${card2.currencyCode}`].rateSell : 1) - card1.balance * (card1.currencyCode !== 980 ? this.state.rates[`${card1.currencyCode}`].rateSell : 1);
    return result;
  }
  updateExRates() { monoInstance.updateRates().then(data => this.setState({ rates: data })); }

  render() {
  	return (
    	<div className="dashboard">
    	  <p className="text-light">Account: {this.state.client.name} (Last update (secs ago): {this.state.secondsPassed})</p>
        <p className="text-light">USD: {this.state.rates[840].rateBuy}/{this.state.rates[840].rateSell} | EUR: {this.state.rates[978].rateBuy}/{this.state.rates[978].rateSell}</p>
        <div id="accounts">
          {this.state.client.accounts.sort((card1, card2) => this.compareCardBalances(card1, card2)).map(item => {
            return (
              <div className={item.type == "black" ? "blackCard bankCard" : "whiteCard bankCard"} key={item.id} id={item.id}>
                <span className="cardCurrency">{monoInstance.currencyCodes[item.currencyCode]}</span>
                <span className="cardNumber">{item.maskedPan[0].replace('*','******')}</span>
                <span className="cardCreditLimit">Credit Limit: {item.creditLimit / 100}</span>
                <span className="cardBalance">Balance: {(item.balance - item.creditLimit) / 100}</span>
              </div>
            )
          })}
        </div>
    	</div>
    );
  }
}

class App extends React.Component {
	render() {
  	return (
    	<div>
        <Header />
    	  <ApiKeySettings />
    	  <Dashboard />
    	</div>
    )
  }
}
