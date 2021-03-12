import { Component, h, Prop, State, Listen } from '@stencil/core';

@Component({
  tag: 'my-card',
  styleUrl: 'my-card.css',
  shadow: true,
})
export class MyCard {
  @Prop({ mutable: true }) userName: string;
  @State() APIData: string = 'starting value';
  @State() showReactTab = false;
  @State() showStencilTab = false;

  @State() myStencilUsers: string;
  @State() myReactUsers: string;

  //   changeStates() {
  //     this.userName = 'name has been updated!';
  //     this.APIData = 'we have data from api';
  //     this.showCard = false;
  //   }

  //   @Watch('userName')
  //   watchHandler(newValue: boolean, oldValue: boolean) {
  //     console.log('The new value of name is: ' + newValue + ' old value ' + oldValue);
  //   }

  //   componentWillUpdate() {
  //     console.log('componentWillUpdate');
  //   }

  // connectedCallback(){
  //     console.log('connectedCallback');
  //   }

  //   disconnectedCallback(){
  //     console.log('disconnectedCallback');
  //   }

  //   componentWillLoad() {
  //     //this method is only called once, it's a good place to
  //     //load data asynchronously.
  //     console.log('componentWillLoad component is about to load');
  //   }

  //   componentWillRender() {
  //     // It's always recommended to make any rendered state updates
  //     //  within componentWillRender()

  //    // this.APIData = "updated";
  //     console.log('componentWillRender');
  //   }

  //   componentDidLoad() {
  //     //Called once just after the component fully loaded
  //     // and the first render() occurs.
  //     console.log('componentDidLoad');
  //     this.APIData = 'API has been updated';

  //   }

  //   componentShouldUpdate() {
  //     //This hook is called when a component's Prop or State
  //     //property changes and a rerender is about to be requested.
  //     return true;
  //   }

  //   componentWillUpdate() {
  //     console.log('componentWillUpdate - is called since we are updating this.myAPIData in componentDidLoad');
  //   }

  //   componentDidUpdate() {
  //     console.log('componentDidUpdate - is called since we are updating this.myAPIData in componentDidLoad');
  //   }

  componentDidLoad() {
    this.APIData = 'loading...';
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        var metaData = parsedRes['Meta Data'];
        var timeDateStencil = metaData['5. Output Size'];
        this.APIData = timeDateStencil;
      });
  }


  getStencilUserFromAPI() {
    this.myStencilUsers = 'loading data...';
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        var timeSeries = parsedRes['Time Series (5min)'];
        var timeDateStencil = timeSeries['2021-03-11 20:00:00'];
        this.myStencilUsers = timeDateStencil['5. volume'];
      }).catch(ex => {console.log(ex)});

  }

  getReactUserFromAPI() {
    this.myReactUsers = 'loading data...';
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        var timeSeries = parsedRes['Time Series (5min)'];
        var timeDateReact = timeSeries['2021-03-11 19:40:00'];
        console.log(timeSeries);
        this.myReactUsers = timeDateReact['5. volume'];
      });
  }

  fetchMyDataFromAPI(contentType: string) {
    if (contentType == 'stencil') {
      this.getStencilUserFromAPI();
    } else {
      this.getReactUserFromAPI();
    }
  }

  onContentChange(content: string) {
    if (content == 'reacttab') {
      this.showReactTab = true;
      this.showStencilTab = false;
    } else if (content == 'stenciltab') {
      this.showStencilTab = true;
      this.showReactTab = false;
    } else {
      this.showReactTab = false;
      this.showStencilTab = false;
    }
  }

  onUserInput(event: Event) {
    this.userName = (event.target as HTMLInputElement).value;
  }

  @Listen('searchWorldNameSelected',  { target: 'body' })
  searchWorldNameSelectedHandler(event:CustomEvent<string>){
    alert("called");
    this.userName= event.detail;
  }
  
  render() {
    let reactContent = (
      <div>
        <div class="card-custom" id="react-div">
          Hello, from React <br></br> Live Users <span>{this.myReactUsers}</span>
          <button class="btn-react small-btn" onClick={this.fetchMyDataFromAPI.bind(this, 'react')}>Get React Users</button> <br></br>
        </div>
      </div>
    );

    let stencilContent = (
      <div>
        <div class="card-custom" id="stencil-div">
          Hello, from Stencil
          <br></br> <br></br> 
          Live Users <span>{this.myStencilUsers}</span>
          <button class="btn-stencil small-btn" onClick={this.fetchMyDataFromAPI.bind(this, 'stencil')}>Get Stencil Users</button> <br></br>
          <br></br>
        </div>
      </div>
    );

    let contentToDisplay = '';
    if (this.showReactTab) {
      contentToDisplay = reactContent;
    } else if (this.showStencilTab) {
      contentToDisplay = stencilContent;
    }

    let mainContent = (
      <div class="my-card-wrapper">
        <h1>Hi, I am {this.userName}</h1>

        <h5>{this.APIData}</h5>
        <button class="btn-stencil" onClick={this.onContentChange.bind(this, 'reacttab')}>
          Stencil
        </button>
        <button class="btn-react" onClick={this.onContentChange.bind(this, 'stenciltab')}>
          React
        </button>

        {contentToDisplay}
        <h></h>
        <h3>Two way data binding in stencil</h3>

        <input type="text" class="my-input-textbox" onInput={this.onUserInput.bind(this)} value={this.userName}></input>
        this is child one
      

      </div>

    );
    return mainContent;
  }
}
