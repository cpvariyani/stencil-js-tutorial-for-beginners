import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'search-world',
  styleUrl: 'search-world.css',
  shadow: true,
})
export class SearchWorld {
  @Prop({ mutable: true }) searchText: string;
  @State() searchResult: { name: string; marketOpen: string }[] = [];
  @State() userInput: string;

  onUserInput(event: Event) {
    this.userInput = (event.target as HTMLInputElement).value;
    this.searchText = this.userInput;
  }

  searchFromAPI() {
    fetch('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + this.searchText + '&apikey=865I8ZLN51M0ZVJY')
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        var metaData = parsedRes['bestMatches'];
        this.searchResult = metaData.map(d => {
          return {
            name: d['2. name'],
            marketOpen: d['5. marketOpen'],
          };
        });
        console.log(this.searchResult);
      });
  }

  @Event({bubbles:true, composed:true}) searchWorldNameSelected : EventEmitter<string>;

  onRowClick(name:string){
      this.searchWorldNameSelected.emit(name);
  }

  render() {
    return (
      <div class="main-search-div">
        <input class="my-input-textbox" type="text" value={this.searchText} onInput={this.onUserInput.bind(this)}></input>
        <button class="btn-react" onClick={this.searchFromAPI.bind(this)}>
          Search it!
        </button>
        <hr></hr>
        <br></br> <br></br>
        
        <table id="api-table">
          {this.searchResult.map(r => (
            <tr onClick={this.onRowClick.bind(this,r.name)}>
              <td>{r.name}</td>
              <td>{r.marketOpen}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}
